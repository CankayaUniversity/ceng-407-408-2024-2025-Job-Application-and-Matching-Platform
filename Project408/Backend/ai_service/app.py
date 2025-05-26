#!/usr/bin/env python
# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import pickle
import os
from ai_model import load_saved_models, recommend_jobs_for_candidate, recommend_candidates_for_job

app = Flask(__name__)

# Modelleri yükle
MODEL_DIR = "models"
try:
    user_to_job_model, job_to_user_model, le_dict, scaler, features = load_saved_models(MODEL_DIR)
    print("Modeller başarıyla yüklendi!")
except Exception as e:
    print("Modeller yüklenemedi: {}".format(e))
    print("Lütfen önce modelleri eğitin: python ai_model.py")

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    data = request.json
    
    # Aday profilini al
    candidate_profile = data.get("candidate_profile", {})
    
    # İş havuzunu al
    job_pool = data.get("job_pool", [])
    job_pool_df = pd.DataFrame(job_pool)
    
    if job_pool_df.empty:
        return jsonify({"error": "No jobs in pool"}), 400
    
    # Önerileri al
    k = data.get("limit", 10)
    try:
        recommendations = recommend_jobs_for_candidate(
            candidate_profile, job_pool_df, user_to_job_model, le_dict, scaler, features, k)
        
        # Skor ekleyerek sonuçları döndür
        return jsonify({
            "recommendations": recommendations.to_dict(orient="records"),
            "job_ids": recommendations["id"].tolist() if "id" in recommendations.columns else []
        })
    except Exception as e:
        print("Hata: {}".format(e))
        return jsonify({"error": str(e)}), 500

@app.route('/recommend-candidates', methods=['POST'])
def recommend_candidates():
    data = request.json
    
    # İş profilini al
    job_profile = data.get("job_profile", {})
    
    # Aday havuzunu al
    candidate_pool = data.get("candidate_pool", [])
    candidate_pool_df = pd.DataFrame(candidate_pool)
    
    if candidate_pool_df.empty:
        return jsonify({"error": "No candidates in pool"}), 400
    
    # Önerileri al
    k = data.get("limit", 10)
    try:
        recommendations = recommend_candidates_for_job(
            job_profile, candidate_pool_df, job_to_user_model, le_dict, scaler, features, k)
        
        # Skor ekleyerek sonuçları döndür
        return jsonify({
            "recommendations": recommendations.to_dict(orient="records"),
            "candidate_ids": recommendations["id"].tolist() if "id" in recommendations.columns else []
        })
    except Exception as e:
        print("Hata: {}".format(e))
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 