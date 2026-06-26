import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  clearAuthData,
  getCurrentUserFromStorage
} from '../api/index.js';


// Create the context
const AuthContext = createContext(null);

// Auth Provider component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    const user = getCurrentUserFromStorage();

    if (token && user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (credentials, remember = false) => {
    setError(null);
    setLoading(true);
    try {
      const response = await apiLogin(credentials);

      let user, token;
      if (response.data) {
        user = response.data.user;
        token = response.data.token;
      } else {
        // Fallback for mock data
        user = response.user || {
          id: 1,
          fullName: 'Demo User',
          email: credentials.identifier || 'demo@example.com',
          username: credentials.identifier || 'demo_user',
          role: 'user',
        };
        token = response.token || 'mock-token-' + Date.now();
      }

      if (remember) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
      }

      localStorage.setItem('auth_last_login', new Date().toISOString());

      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setError(null);
    setLoading(true);
    try {
      const response = await apiRegister(userData);

      let user, token;
      if (response.data) {
        user = response.data.user;
        token = response.data.token;
      } else {
        // Fallback for mock data
        user = response.user || {
          id: Date.now(),
          fullName: userData.fullName,
          email: userData.email,
          username: userData.username || userData.email,
          mobile: userData.mobile || '',
          role: 'user',
        };
        token = response.token || 'mock-token-' + Date.now();
      }

      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(user));

      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async ({ email }) => {
    setError(null);
    try {
      // Import dynamically to avoid circular dependency
      const { forgotPassword: apiForgotPassword } = await import('../api/index.js');
      await apiForgotPassword({ email });
      return { message: 'Password reset link sent to your email' };
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err.message || 'Failed to send reset link';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const oauthLogin = async (data, remember = false) => {
    setError(null);
    try {
      const user = {
        id: Date.now(),
        fullName: data.name || 'OAuth User',
        email: data.email || 'oauth@example.com',
        username: data.email?.split('@')[0] || 'oauth_user',
        role: 'user',
        isAdmin: false,
      };

      const token = 'oauth-token-' + Date.now();

      if (remember) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      } else {
        sessionStorage.setItem('auth_token', token);
        sessionStorage.setItem('auth_user', JSON.stringify(user));
      }

      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.message || 'OAuth login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    oauthLogin,
    setError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the context for direct use if needed
export default AuthContext;

// Custom hook to consume the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};