import axios from 'axios';

// In development: Vite proxy forwards /api → localhost:5000
// In production:  VITE_API_URL env var points to Render backend URL
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bfc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 401 → clear auth and redirect, but never loop on /login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      if (!isLoginPage) {
        localStorage.removeItem('bfc_token');
        localStorage.removeItem('bfc_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
