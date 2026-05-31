import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let accessToken = null;
let refreshTokenValue = null;
let isRefreshing = false;
let refreshSubscribers = [];

const sanitizeString = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/<[^>]*?>/g, '');
};

const sanitizePayload = (payload) => {
  return Object.fromEntries(
    Object.entries(payload).map(([key, value]) => [key, sanitizeString(value)])
  );
};

const notifySubscribers = (token) => {
  refreshSubscribers.forEach(({ resolve }) => resolve(token));
  refreshSubscribers = [];
};

const subscribeRefresh = () =>
  new Promise((resolve, reject) => {
    refreshSubscribers.push({ resolve, reject });
  });

export const initializeAuth = (token, refreshToken) => {
  accessToken = token;
  refreshTokenValue = refreshToken;
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshTokenValue = null;
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

    if (error.response?.status === 401 && refreshTokenValue) {
      originalRequest._retry = true;

      if (isRefreshing) {
        const token = await subscribeRefresh();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      }

      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/api/auth/refresh`,
          { refreshToken: refreshTokenValue },
          { headers: { 'Content-Type': 'application/json' } }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
        initializeAuth(newAccessToken, newRefreshToken || refreshTokenValue);
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
    const response = await api.post('/api/auth/login', safePayload);
    return response.data;
  },

  register: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/api/auth/register', safePayload);
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/api/auth/logout', { refreshToken: refreshTokenValue });
    } catch (error) {
      // continue to clear local state even if the backend logout fails
    }
  },

  forgotPassword: async (payload) => {
    const safePayload = sanitizePayload(payload);
    const response = await api.post('/api/auth/forgot-password', safePayload);
    return response.data;
  },

  fetchMe: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
};

export default authService;
