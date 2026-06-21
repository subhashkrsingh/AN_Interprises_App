import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  if (!url) return 'http://localhost:5000/api';
  const trimmed = url.toString().trim().replace(/\/$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  if (trimmed.includes('/api/')) return trimmed;
  return `${trimmed}/api`;
};

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: { 'Content-Type': 'application/json' },
});

export const getServices = async () => {
  const response = await api.get('/services');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

export const getFaqs = async () => {
  const response = await api.get('/faqs');
  return response.data;
};

export const submitContact = async (payload) => {
  const response = await api.post('/contact', payload);
  return response.data;
};
