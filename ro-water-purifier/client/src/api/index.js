import axios from 'axios';

const normalizeApiBaseUrl = (url) => {
  if (!url) return 'http://localhost:5000/api';
  const trimmed = url.toString().trim().replace(/\/$/, '');
  if (trimmed.endsWith('/api')) return trimmed;
  if (trimmed.includes('/api/')) return trimmed;
  return `${trimmed}/api`;
};

// Create main API instance
const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_URL),
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      clearAuthData();
    }
    return Promise.reject(error);
  }
);

// ===== AUTH HELPER FUNCTIONS =====

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  return !!token;
};

// Get current user from storage
export const getCurrentUserFromStorage = () => {
  const user = localStorage.getItem('auth_user') || sessionStorage.getItem('auth_user');
  return user ? JSON.parse(user) : null;
};

// Clear auth data
export const clearAuthData = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('auth_user');
  sessionStorage.removeItem('auth_token');
  sessionStorage.removeItem('auth_user');
};

// ===== PUBLIC API ENDPOINTS =====

// Services
export const getServices = async () => {
  try {
    const response = await api.get('/services');
    return response.data;
  } catch (error) {
    console.warn('Using mock services data');
    return [
      { id: 1, title: 'RO Water Purifier Sales', description: 'Best RO water purifiers at affordable prices.', price: '₹12,999', icon: '🛒' },
      { id: 2, title: 'RO Installation Service', description: 'Professional installation by certified technicians.', price: '₹999', icon: '🔧' },
      { id: 3, title: 'RO Repair & Maintenance', description: 'Quick repair and maintenance services.', price: '₹499', icon: '🛠️' },
      { id: 4, title: 'Filter & Membrane Replacement', description: 'Genuine filter and membrane replacement.', price: '₹2,499', icon: '🔄' },
      { id: 5, title: 'AMC Plans', description: 'Annual maintenance contracts for peace of mind.', price: '₹3,999', icon: '📋' },
    ];
  }
};

// Products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.warn('Using mock products data');
    return [
      { id: 1, name: 'LifeGuard RO Purifier', category: 'Domestic', description: '7-stage RO purification with UV and UF.', price: '₹14,999', stage: 7 },
      { id: 2, name: 'LifeGuard Booster Pump', category: 'Accessory', description: 'High-performance booster pump for RO systems.', price: '₹4,999', stage: 7 },
      { id: 3, name: 'LifeGuard MAX', category: 'Commercial', description: 'Advanced RO system with 100% pure water.', price: '₹19,999', stage: 7 },
      { id: 4, name: 'LifeGuard PURIX', category: 'Premium', description: 'Alkaline & Copper Technology for next gen purity.', price: '₹24,999', stage: 6 },
      { id: 5, name: 'LifeGuard PURIX Copper', category: 'Premium', description: 'Copper infused water for health benefits.', price: '₹26,999', stage: 6 },
    ];
  }
};

// Testimonials
export const getTestimonials = async () => {
  try {
    const response = await api.get('/testimonials');
    return response.data;
  } catch (error) {
    console.warn('Using mock testimonials data');
    return [
      { id: 1, author: 'Rahul Sharma', rating: 5, text: 'Best RO service in town. My family is now drinking safe water.' },
      { id: 2, author: 'Priya Patel', rating: 4, text: 'Professional installation and great customer support.' },
      { id: 3, author: 'Amit Kumar', rating: 5, text: 'AMC plan is affordable and service is prompt. Highly recommended!' },
    ];
  }
};

// FAQs
export const getFaqs = async () => {
  try {
    const response = await api.get('/faqs');
    return response.data;
  } catch (error) {
    console.warn('Using mock FAQs data');
    return [
      { id: 1, question: 'How often should I replace the RO membrane?', answer: 'RO membranes typically need replacement every 2-3 years depending on water quality and usage.' },
      { id: 2, question: 'What is the maintenance cost of an RO purifier?', answer: 'Annual maintenance costs range from ₹3,000 to ₹5,000 depending on the model and usage.' },
      { id: 3, question: 'Do you provide installation services?', answer: 'Yes, we provide professional installation services with a team of certified technicians.' },
      { id: 4, question: 'What is an AMC plan?', answer: 'AMC (Annual Maintenance Contract) covers regular servicing, filter changes, and priority support for a fixed annual fee.' },
    ];
  }
};

// Contact
export const submitContact = async (payload) => {
  try {
    const response = await api.post('/contact', payload);
    return response.data;
  } catch (error) {
    console.warn('Using mock contact submission');
    return { message: 'Your request has been submitted successfully. We will contact you soon!' };
  }
};

// ===== AUTH ENDPOINTS =====

// Login
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    // For demo, simulate successful login
    if (import.meta.env.DEV) {
      console.warn('Using mock login - API not available');
      return {
        user: {
          id: 1,
          fullName: 'Demo User',
          email: credentials.identifier || 'demo@example.com',
          username: credentials.identifier || 'demo_user',
          role: 'user',
        },
        token: 'mock-token-' + Date.now()
      };
    }
    throw error;
  }
};

// Register
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Using mock registration - API not available');
      return {
        user: {
          id: Date.now(),
          fullName: userData.fullName,
          email: userData.email,
          username: userData.username || userData.email,
          role: 'user',
        },
        token: 'mock-token-' + Date.now()
      };
    }
    throw error;
  }
};

// Logout
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    console.warn('Logout error:', error);
    return { success: true };
  }
};

// Get Current User
export const getCurrentUser = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    const user = getCurrentUserFromStorage();
    if (user) {
      return { data: user };
    }
    throw error;
  }
};

// Forgot Password
export const forgotPassword = async (data) => {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Using mock forgot password - API not available');
      return { message: 'If your email exists, a reset link has been sent.' };
    }
    throw error;
  }
};

// Reset Password
export const resetPassword = async (data) => {
  try {
    const response = await api.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Using mock reset password - API not available');
      return { message: 'Password reset successfully!' };
    }
    throw error;
  }
};

export default api;