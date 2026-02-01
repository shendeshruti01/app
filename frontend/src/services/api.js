import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// ===== PUBLIC API =====

export const getPortfolio = async () => {
  const response = await api.get('/portfolio');
  return response.data;
};

export const downloadDocument = async (docType) => {
  const response = await api.get(`/documents/download/${docType}`, {
    responseType: 'blob',
  });
  return response.data;
};

// ===== AUTHENTICATION API =====

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const verifyToken = async () => {
  const response = await api.post('/auth/verify');
  return response.data;
};

// ===== ADMIN API =====

export const updatePersonalInfo = async (personalInfo) => {
  const response = await api.put('/admin/portfolio/personal', personalInfo);
  return response.data;
};

export const updateSocialLinks = async (socialLinks) => {
  const response = await api.put('/admin/portfolio/social-links', socialLinks);
  return response.data;
};

// Experience
export const addExperience = async (experience) => {
  const response = await api.post('/admin/portfolio/experience', experience);
  return response.data;
};

export const updateExperience = async (id, experience) => {
  const response = await api.put(`/admin/portfolio/experience/${id}`, experience);
  return response.data;
};

export const deleteExperience = async (id) => {
  const response = await api.delete(`/admin/portfolio/experience/${id}`);
  return response.data;
};

// Certifications
export const addCertification = async (certification) => {
  const response = await api.post('/admin/portfolio/certification', certification);
  return response.data;
};

export const updateCertification = async (id, certification) => {
  const response = await api.put(`/admin/portfolio/certification/${id}`, certification);
  return response.data;
};

export const deleteCertification = async (id) => {
  const response = await api.delete(`/admin/portfolio/certification/${id}`);
  return response.data;
};

// Skills
export const addSkill = async (skill) => {
  const response = await api.post('/admin/portfolio/skill', skill);
  return response.data;
};

export const updateSkill = async (id, skill) => {
  const response = await api.put(`/admin/portfolio/skill/${id}`, skill);
  return response.data;
};

export const deleteSkill = async (id) => {
  const response = await api.delete(`/admin/portfolio/skill/${id}`);
  return response.data;
};

// Documents
export const uploadDocuments = async (files) => {
  const formData = new FormData();
  
  if (files.resumePDF) formData.append('resumePDF', files.resumePDF);
  if (files.resumeDOCX) formData.append('resumeDOCX', files.resumeDOCX);
  if (files.coverLetterPDF) formData.append('coverLetterPDF', files.coverLetterPDF);
  if (files.coverLetterDOCX) formData.append('coverLetterDOCX', files.coverLetterDOCX);
  
  const response = await api.post('/admin/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export default api;
