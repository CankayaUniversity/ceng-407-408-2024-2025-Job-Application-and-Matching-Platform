# AI Öneri Servisi

Bu servis, iş ilanları ve adaylar arasında eşleşme yapan bir yapay zeka modeli içerir.

## Kurulum

1. Gerekli bağımlılıkları yükleyin:
```
pip install -r requirements.txt
```

2. Modeli eğitin (sadece bir kez yapılması gerekir):
```
python ai_model.py
```

3. API servisini başlatın:
```
python app.py
```

## Kullanım

Servis aşağıdaki API endpoint'lerini sağlar:

### Sağlık Kontrolü

```
GET /health
```

### İş Önerisi

```
POST /recommend-jobs
```

İstek gövdesi örneği:
```json
{
  "candidate_profile": {
    "candidate_degreeType": "Bachelor",
    "candidate_department": "Computer Engineering",
    "candidate_graduationYear": 2020,
    "candidate_gpa": 3.5,
    ...
  },
  "job_pool": [
    {
      "id": 1,
      "job_positionName": "Software Engineer",
      "job_industry": "Technology",
      ...
    },
    ...
  ],
  "limit": 10
}
```

### Aday Önerisi

```
POST /recommend-candidates
```

İstek gövdesi örneği:
```json
{
  "job_profile": {
    "job_positionName": "Software Engineer",
    "job_industry": "Technology",
    ...
  },
  "candidate_pool": [
    {
      "id": 1,
      "candidate_degreeType": "Bachelor",
      "candidate_department": "Computer Engineering",
      ...
    },
    ...
  ],
  "limit": 10
}
``` 