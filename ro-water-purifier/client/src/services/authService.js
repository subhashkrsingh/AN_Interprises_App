import axios from 'axios';
import api from './apiService.js';

let accessToken = null;
let isRefreshing = false;
let refreshSubscribers = [];

const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/<[^>]*?>/g, '');
};

const sanitizePayload = (payload) =>
  Object.fromEntries(Object.entries(payload).map(([key, value]) => [key, sanitizeString(value)]));

const notifySubscribers = (token) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const subscribeRefresh = () =>
  new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
  });

export const initializeAuth = (token) => {
  accessToken = token;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const clearAuthTokens = () => {
  accessToken = null;
  delete api.defaults.headers.common.Authorization;
};

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  const csrfToken = localStorage.getItem('csrf_token');
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true;

      if (isRefreshing) {
        const token = await subscribeRefresh();
        if (!token) return Promise.reject(error);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }

      isRefreshing = true;
      try {
        const refreshResponse = await api.post('/auth/refresh');
        const { accessToken: newAccessToken } = refreshResponse.data;
        initializeAuth(newAccessToken);
        notifySubscribers(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        notifySubscribers(null);
        clearAuthTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

const authService = {
  login: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/auth/login', safePayload);
    return response.data;
  },

  register: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/auth/register', safePayload);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // ignore logout network errors
    }
  },

  forgotPassword: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/auth/forgot-password', safePayload);
    return response.data;
  },

  resetPassword: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/auth/reset-password', safePayload);
    return response.data;
  },

  sendOtp: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/auth/send-otp', safePayload);
    return response.data;
  },

  verifyOtp: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/auth/verify-otp', safePayload);
    return response.data;
  },

  googleLogin: async (payload) => {
    const response = await api.post('/auth/google', payload);
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};

export default authService;
