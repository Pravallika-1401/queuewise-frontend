import axios from 'axios';

// Backend URL — local lo localhost, deployed lo Render URL
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
});

// Every request ki JWT token automatic ga add cheyyi
API.interceptors.request.use(config => {
  const token = localStorage.getItem('queuewise_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 response vaste — logout cheyyi
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ========== AUTH APIs ==========
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ========== QUEUE APIs ==========
export const getAllQueues = () => API.get('/queues');
export const getQueueStatus = (queueId) => API.get(`/queues/public/status/${queueId}`);
export const joinQueue = (queueId) => API.post(`/queues/join/${queueId}`);

// ========== TOKEN APIs ==========
export const getTokenStatus = (tokenId) => API.get(`/tokens/${tokenId}/status`);

// ========== ADMIN APIs ==========
export const createQueue = (data) => API.post('/admin/queues', data);
export const getQueueTokens = (queueId) => API.get(`/admin/queues/${queueId}/tokens`);
export const callNextToken = (queueId) => API.put(`/admin/queues/${queueId}/next`);
export const skipToken = (tokenId) => API.put(`/admin/tokens/${tokenId}/skip`);

export default API;
