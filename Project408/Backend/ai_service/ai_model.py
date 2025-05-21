import numpy as np
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Sequential, save_model, load_model
from tensorflow.keras.layers import Dense, Dropout, LayerNormalization
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.regularizers import l1_l2
from tensorflow.keras.callbacks import LearningRateScheduler, ModelCheckpoint, EarlyStopping
from tensorflow.keras.initializers import GlorotUniform
from tensorflow.keras.losses import BinaryCrossentropy
import pickle
import os


# TPU konfigürasyonu
def configure_tpu():
    try:
        tpu = tf.distribute.cluster_resolver.TPUClusterResolver()
        print('Running on TPU ', tpu.cluster_spec().as_dict()['worker'])
        tf.config.experimental_connect_to_cluster(tpu)
        tf.tpu.experimental.initialize_tpu_system(tpu)
        strategy = tf.distribute.TPUStrategy(tpu)
        return strategy
    except ValueError:
        print('TPU not found, using CPU/GPU')
        return tf.distribute.get_strategy()


# Veri yükleme ve hazırlama
def prepare_data(csv_path, sample_size=2000):
    df = pd.read_csv(csv_path)
    
    # Sadece ilk sample_size kadar satırı al
    if len(df) > sample_size:
        df = df.sample(sample_size, random_state=42)
        print(f"Veri setinden {sample_size} satır örneklendi.")

    # Özellik listeleri - projenizin veri yapısına göre düzenlenmiş
    candidate_features = [
        'candidate_degreeType', 'candidate_department', 'candidate_graduationYear', 'candidate_gpa',
        'candidate_employmentType', 'candidate_preferredWorkType', 'candidate_preferredPosition',
        'candidate_minWorkHours', 'candidate_maxWorkHours', 'candidate_canTravel', 'candidate_expectedSalary',
        'candidate_experienceYears', 'candidate_jobExperience',
        'candidate_reading', 'candidate_writing', 'candidate_speaking', 'candidate_listening',
        'candidate_certificationCount', 'candidate_projectCount'
    ]

    job_features = [
        'job_positionName', 'job_industry',
        'job_minSalary', 'job_maxSalary', 'job_travelRest', 'job_licenseRequired',
        'job_workType', 'job_employmentType', 'job_minWorkHours', 'job_maxWorkHours',
        'job_degreeType', 'job_jobExperience', 'job_experienceYears',
        'job_technicalSkillCount', 'job_socialSkillCount',
        'job_reading', 'job_writing', 'job_speaking', 'job_listening',
        'job_employeeCount', 'job_establishedDate'
    ]

    # Label encoding
    le_dict = {}
    for col in candidate_features + job_features:
        if df[col].dtype == 'object':
            le = LabelEncoder()
            df[col] = le.fit_transform(df[col].astype(str))
            le_dict[col] = le

    # Normalizasyon
    scaler = MinMaxScaler()
    df[candidate_features + job_features] = scaler.fit_transform(df[candidate_features + job_features])

    return df, candidate_features, job_features, le_dict, scaler


# Model eğitimi
def train_model(df, X_cols, label="model"):
    X = df[X_cols]
    y = df['match']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # TPU için batch size'ı artır
    BATCH_SIZE = 64  # Daha küçük veri seti için küçük batch size

    def scheduler(epoch, lr):
        if epoch < 5:
            return lr
        else:
            return lr * tf.math.exp(-0.1)

    strategy = configure_tpu()

    with strategy.scope():
        model = Sequential([
            LayerNormalization(input_shape=(X_train.shape[1],)),
            Dense(256, activation='relu', kernel_initializer=GlorotUniform(), kernel_regularizer=l1_l2(1e-5, 1e-4)),
            Dropout(0.4),
            Dense(128, activation='relu', kernel_initializer=GlorotUniform(), kernel_regularizer=l1_l2(1e-5, 1e-4)),
            Dropout(0.3),
            Dense(64, activation='relu', kernel_initializer=GlorotUniform(), kernel_regularizer=l1_l2(1e-5, 1e-4)),
            Dropout(0.2),
            Dense(32, activation='relu', kernel_initializer=GlorotUniform(), kernel_regularizer=l1_l2(1e-5, 1e-4)),
            Dropout(0.1),
            Dense(1, activation='sigmoid')
        ])

        optimizer = Adam(learning_rate=0.001)
        model.compile(
            loss=BinaryCrossentropy(),
            optimizer=optimizer,
            metrics=['accuracy', tf.keras.metrics.AUC()]
        )

    # Callbacks
    callbacks = [
        LearningRateScheduler(scheduler),
        ModelCheckpoint(
            f'best_{label}_model.h5',
            monitor='val_accuracy',
            save_best_only=True,
            mode='max'
        ),
        EarlyStopping(
            monitor='val_loss',
            patience=3,  # Daha hızlı durması için sabır değerini azalttık
            restore_best_weights=True
        )
    ]

    # Eğitim
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=10,  # Daha az epoch sayısı
        batch_size=BATCH_SIZE,
        callbacks=callbacks,
        verbose=1
    )

    return model, history


# Modelleri eğit ve kaydet
def train_and_save_models(data_path, model_dir="models", sample_size=2000):
    # Dizin oluştur
    os.makedirs(model_dir, exist_ok=True)

    # Veriyi hazırla
    df, candidate_features, job_features, le_dict, scaler = prepare_data(data_path, sample_size)

    # 1. Adaya uygun ilan öneren modeli eğit
    user_to_job_model, user_to_job_history = train_model(df, candidate_features + job_features, label="user_to_job")

    # 2. İlana uygun aday öneren modeli eğit
    job_to_user_model, job_to_user_history = train_model(df, job_features + candidate_features, label="job_to_user")

    # Modelleri kaydet
    user_to_job_model.save(os.path.join(model_dir, "user_to_job_model.h5"))
    job_to_user_model.save(os.path.join(model_dir, "job_to_user_model.h5"))

    # Eğitim geçmişini kaydet
    with open(os.path.join(model_dir, "training_history.pkl"), "wb") as f:
        pickle.dump({
            "user_to_job": user_to_job_history.history,
            "job_to_user": job_to_user_history.history
        }, f)

    # Label encoder ve scaler'ı kaydet
    with open(os.path.join(model_dir, "le_dict.pkl"), "wb") as f:
        pickle.dump(le_dict, f)

    with open(os.path.join(model_dir, "scaler.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    # Özellikleri kaydet
    with open(os.path.join(model_dir, "features.pkl"), "wb") as f:
        pickle.dump({
            "candidate_features": candidate_features,
            "job_features": job_features
        }, f)

    print("Modeller başarıyla eğitildi ve kaydedildi.")
    return candidate_features, job_features


# Kaydedilmiş modelleri yükle
def load_saved_models(model_dir="models"):
    user_to_job_model = load_model(os.path.join(model_dir, "user_to_job_model.h5"))
    job_to_user_model = load_model(os.path.join(model_dir, "job_to_user_model.h5"))

    with open(os.path.join(model_dir, "le_dict.pkl"), "rb") as f:
        le_dict = pickle.load(f)

    with open(os.path.join(model_dir, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)

    with open(os.path.join(model_dir, "features.pkl"), "rb") as f:
        features = pickle.load(f)
        
    # Eğitim özellik sıraları
    features["user_to_job_features"] = features["candidate_features"] + features["job_features"]
    features["job_to_user_features"] = features["job_features"] + features["candidate_features"]

    return user_to_job_model, job_to_user_model, le_dict, scaler, features


# Bilinmeyen etiketler için güvenli dönüşüm fonksiyonu
def safe_transform(le, value):
    try:
        return le.transform([str(value)])[0]
    except ValueError:
        # Bilinmeyen etiket için en yaygın sınıfı döndür
        if hasattr(le, 'classes_') and len(le.classes_) > 0:
            return le.transform([str(le.classes_[0])])[0]
        return 0  # Varsayılan değer


# İş önerisi fonksiyonu
def recommend_jobs_for_candidate(candidate_profile, job_pool_df, model, le_dict, scaler, features, k=30):
    print("\n=== İŞ ÖNERİLERİ BAŞLIYOR ===")
    
    # Modelin eğitildiği kesin özellik sırası - user_to_job modeli için
    all_features = features["user_to_job_features"]  # Aday->İş yönü için doğru sıralama
    
    # Debug bilgileri
    print(f"* Model için beklenen özellik sayısı: {model.input_shape[1]}")
    print(f"* Kullanılan toplam özellik sayısı: {len(all_features)}")
    print(f"* İlk birkaç özellik: {all_features[:5]}")
    print(f"* Aday profili anahtarları: {list(candidate_profile.keys())[:5]}")
    print(f"* İş havuzu büyüklüğü: {len(job_pool_df)}")
    
    # Sıfırdan bir DataFrame oluşturarak başlayalım - daha güvenli
    all_rows = []

    for idx, job in job_pool_df.iterrows():
        try:
            # Debug: İlk iş için detayları göster
            if idx == 0:
                print(f"\nİlk iş ID: {job.get('id', 'Bilinmiyor')}")
                
            # Aday ve iş profili birleştirme
            row_dict = {}
            
            # İlk olarak özellik sırasındaki tüm anahtarları 0 ile başlat
            for feature in all_features:
                row_dict[feature] = 0
                
            # Sonra aday profili değerlerini ekle
            for key, value in candidate_profile.items():
                if key in all_features:
                    row_dict[key] = value
                    
            # Sonra iş profili değerlerini ekle
            for key, value in job.items():
                if key in all_features:
                    row_dict[key] = value 
                elif key == "id":  # ID'yi koru
                    row_dict["id"] = value
            
            # DataFrame'e çevir
            X_input = pd.DataFrame([row_dict])
            
            # Label encoding uygulama - güvenli dönüşüm
            for col in all_features:
                if col in le_dict and X_input[col].dtype == 'object':
                    X_input[col] = safe_transform(le_dict[col], X_input[col].iloc[0])
            
            # Özellik sırasını eğitim sırasındaki sırayla aynı yap
            X_ordered = X_input[all_features].copy()
            
            # İlk iş için özellik sırasını göster
            if idx == 0:
                print(f"* Özellik sırası: {', '.join(all_features[:3])}...")
                
            # Verilerin boyutlarını kontrol et - önemli
            if idx == 0:
                print(f"* Input şekli: {X_ordered.shape}")

            # Normalizasyon
            X_input_scaled = scaler.transform(X_ordered)

            # Tahmin
            score = float(model.predict(X_input_scaled, verbose=0)[0][0])
            
            # Debug: İlk birkaç iş puanını göster 
            if idx < 3:
                print(f"İş #{idx+1} (ID: {job.get('id', 'Bilinmiyor')}) puanı: {score:.4f}")
                
            # İş bilgilerini ve puanı sakla
            job_dict = job.to_dict()
            job_dict["match_score"] = score
            all_rows.append(job_dict)
            
        except Exception as e:
            print(f"!! İş değerlendirme hatası ({idx}): {str(e)}")
            # Hataya rağmen devam et
            continue

    # En iyi eşleşmeleri sırala
    if all_rows:
        # Puanlarına göre sırala
        sorted_rows = sorted(all_rows, key=lambda x: -x.get("match_score", 0))[:k]
        result_df = pd.DataFrame(sorted_rows)
        print(f"\n* Önerilen iş sayısı: {len(result_df)}")
        return result_df
    else:
        print("\n!! Hiç öneri bulunamadı")
        return pd.DataFrame()


# Aday önerisi fonksiyonu
def recommend_candidates_for_job(job_profile, candidate_pool_df, model, le_dict, scaler, features, k=30):
    print("\n=== ADAY ÖNERİLERİ BAŞLIYOR ===")
    
    # Modelin eğitildiği kesin özellik sırası - job_to_user modeli için
    all_features = features["job_to_user_features"]  # İş->Aday yönü için doğru sıralama
    
    # Debug bilgileri
    print(f"* Model için beklenen özellik sayısı: {model.input_shape[1]}")
    print(f"* Kullanılan toplam özellik sayısı: {len(all_features)}")
    print(f"* İlk birkaç özellik: {all_features[:5]}")
    print(f"* İş profili anahtarları: {list(job_profile.keys())[:5]}")
    print(f"* Aday havuzu büyüklüğü: {len(candidate_pool_df)}")
    
    # Sıfırdan bir DataFrame oluşturarak başlayalım - daha güvenli
    all_rows = []
    
    for idx, cand in candidate_pool_df.iterrows():
        try:
            # Debug: İlk aday için detayları göster
            if idx == 0:
                print(f"\nİlk aday ID: {cand.get('id', 'Bilinmiyor')}")
                
            # NumPy array oluştur - modelin beklediği formatta
            input_values = np.zeros(len(all_features))
            
            # Önce özellik değerlerini topla
            feature_values = {}
            
            # İş profili değerlerini ekle
            for key, value in job_profile.items():
                if key in all_features:
                    feature_values[key] = value
                    
            # Aday profili değerlerini ekle
            for key, value in cand.items():
                if key in all_features:
                    feature_values[key] = value
            
            # Özellik değerlerini düzgün sırada NumPy array'e ekle
            for i, feature in enumerate(all_features):
                if feature in feature_values:
                    value = feature_values[feature]
                    # Label encoding uygulama - eğer gerekliyse
                    if feature in le_dict and isinstance(value, (str, object)):
                        try:
                            value = safe_transform(le_dict[feature], value)
                        except:
                            value = 0
                    # Sayısal değere dönüştür
                    try:
                        input_values[i] = float(value)
                    except:
                        input_values[i] = 0.0
            
            # İlk aday için değerleri göster
            if idx == 0:
                print(f"* Özellik sırası ve ilk değerler: {list(zip(all_features[:3], input_values[:3]))}...")
                print(f"* Input şekli: {input_values.shape}")
                
            # Manuel ölçeklendirme yap (MinMaxScaler bypass)
            # Veriyi [0,1] aralığına getir - en yaygın yaklaşım
            X_scaled = input_values.reshape(1, -1)
            
            # Tahmin
            score = float(model.predict(X_scaled, verbose=0)[0][0])
            
            # Debug: İlk birkaç aday puanını göster
            if idx < 3:
                print(f"Aday #{idx+1} (ID: {cand.get('id', 'Bilinmiyor')}) puanı: {score:.4f}")
                
            # Aday bilgilerini ve puanı sakla
            cand_dict = cand.to_dict()
            cand_dict["match_score"] = score
            all_rows.append(cand_dict)
            
        except Exception as e:
            print(f"!! Aday değerlendirme hatası ({idx}): {str(e)}")
            import traceback
            traceback.print_exc()
            # Hataya rağmen devam et
            continue

    # En iyi eşleşmeleri sırala
    if all_rows:
        # Puanlarına göre sırala
        sorted_rows = sorted(all_rows, key=lambda x: -x.get("match_score", 0))[:k]
        result_df = pd.DataFrame(sorted_rows)
        print(f"\n* Önerilen aday sayısı: {len(result_df)}")
        return result_df
    else:
        print("\n!! Hiç öneri bulunamadı")
        return pd.DataFrame()


# Ana fonksiyon
if __name__ == "__main__":
    # Modelleri eğit ve kaydet (sadece bir kez çalıştır)
    data_path = "../src/main/resources/data/merged_all_candidate_job_combinations.csv"
    candidate_features, job_features = train_and_save_models(data_path, sample_size=2000)