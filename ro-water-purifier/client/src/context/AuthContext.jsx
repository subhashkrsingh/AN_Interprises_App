import React, { createContext, useContext, useState, useEffect } from "react";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUserFromStorage,
  clearAuthData,
  forgotPassword as apiForgotPassword, // ✅ FIX ADDED
} from "../api/index.js";

// Create context
const AuthContext = createContext(null);

// Provider
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on app start
  useEffect(() => {
    const token =
      localStorage.getItem("auth_token") ||
      sessionStorage.getItem("auth_token");

    const user = getCurrentUserFromStorage();

    if (token && user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // LOGIN
  const login = async (credentials, remember = false) => {
    setError(null);
    setLoading(true);

    try {
      const response = await apiLogin(credentials);

      const user = response?.data?.user || response.user;
      const token = response?.data?.token || response.token;

      if (remember) {
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("auth_token", token);
        sessionStorage.setItem("auth_user", JSON.stringify(user));
      }

      setCurrentUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Login failed";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const register = async (userData) => {
    setError(null);
    setLoading(true);

    try {
      const response = await apiRegister(userData);

      const user = response?.data?.user || response.user;
      const token = response?.data?.token || response.token;

      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));

      setCurrentUser(user);
      setIsAuthenticated(true);

      return { success: true, user };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Registration failed";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // FORGOT PASSWORD
  const forgotPassword = async ({ email }) => {
    setError(null);

    try {
      await apiForgotPassword({ email });
      return { message: "Password reset link sent" };
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || err.message || "Failed request";

      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // OAuth login
  const oauthLogin = async (data, remember = false) => {
    const user = {
      id: Date.now(),
      fullName: data.name || "OAuth User",
      email: data.email,
      username: data.email?.split("@")[0],
      role: "user",
    };

    const token = "oauth-token-" + Date.now();

    if (remember) {
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("auth_token", token);
      sessionStorage.setItem("auth_user", JSON.stringify(user));
    }

    setCurrentUser(user);
    setIsAuthenticated(true);

    return { success: true, user };
  };

  // LOGOUT
  const logout = () => {
    clearAuthData();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// CUSTOM HOOK
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}

export default AuthContext;