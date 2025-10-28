// src/services/api.js - FIXED VERSION
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth tokens
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const doctorToken = localStorage.getItem('doctorToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (doctorToken) {
      config.headers.Authorization = `Bearer ${doctorToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('doctorToken');
      localStorage.removeItem('doctorData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', userData),
    verifyOTP: (data) => api.post('/auth/verify-otp', data),
  resendOTP: (data) => api.post('/auth/resend-otp', data),

};

// Doctor API
export const doctorAPI = {
  login: (credentials) => api.post('/dr/login', credentials),
  signup: (doctorData) => api.post('/dr/signup', doctorData),
  checkExists: () => api.get('/dr/check'),
  getProfile: () => api.get('/dr/profile'),
  updateProfile: (data) => api.put('/dr/profileUpdate', data),
};

// TB Prediction API
export const tbAPI = {
  predict: (formData) => api.post('/tb/predict', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Results API
export const resultsAPI = {
  getHistory: () => api.get('/result/history'),
  getCount: () => api.get('/result/count'),
  getPatientResults: (patientId) => api.get(`/result/patient/${patientId}`),
};

// Reports API
export const reportsAPI = {
  create: (data) => api.post('/report/create', data),
  getPending: () => api.get('/report/pending'),
  review: (reportId, data) => api.post(`/report/review/${reportId}`, data),
  getCount: () => api.get('/report/count'),
  getReport: (reportId) => api.get(`/report/${reportId}`),
  getApproved: () => api.get('/report/approved'), 
  getRejected: () => api.get('/report/rejected'),
};

// Patients API - FIXED ENDPOINTS
export const patientsAPI = {
  getAll: () => api.get('/patient'),
  getById: (id) => api.get(`/patient/${id}`), 
  getHistory: (patientId) => api.get(`/patient/${patientId}/history`),
};

export default api;