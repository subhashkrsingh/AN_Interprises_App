import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
});

export const getServices = async () => {
  const response = await api.get('/api/services');
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/api/products');
  return response.data;
};

export const getTestimonials = async () => {
  const response = await api.get('/api/testimonials');
  return response.data;
};

export const getFaqs = async () => {
  const response = await api.get('/api/faqs');
  return response.data;
};

export const submitContact = async (payload) => {
  const response = await api.post('/api/contact', payload);
  return response.data;
};
