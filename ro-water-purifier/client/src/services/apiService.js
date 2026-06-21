import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  if (!url) return 'http://localhost:5000/api';
  const trimmed = url.toString().trim().replace(/\/$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  if (trimmed.includes('/api/')) return trimmed;
  return `${trimmed}/api`;
};

const baseURL = normalizeApiBaseUrl(import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data && typeof error.response.data.message === 'string') {
      return Promise.reject(error);
    }
    return Promise.reject(new Error('Network error. Please try again.'));
  }
);

export default api;
