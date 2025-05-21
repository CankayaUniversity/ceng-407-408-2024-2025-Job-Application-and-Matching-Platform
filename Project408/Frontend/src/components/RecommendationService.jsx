import axios from 'axios';

// AI Öneri Servisi
const API_URL = 'http://localhost:9090/api/recommendations';

// İş arayanlar için iş önerileri getir
export const getRecommendedJobs = async (candidateId, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Oturum bulunamadı');
    
    const response = await axios.get(`${API_URL}/jobs/${candidateId}?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('İş önerileri alınırken hata oluştu:', error);
    throw error;
  }
};

// İşverenler için aday önerileri getir
export const getRecommendedCandidates = async (jobId, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Oturum bulunamadı');
    
    const response = await axios.get(`${API_URL}/candidates/${jobId}?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Aday önerileri alınırken hata oluştu:', error);
    throw error;
  }
}; 