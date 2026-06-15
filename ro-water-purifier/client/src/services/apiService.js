import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
