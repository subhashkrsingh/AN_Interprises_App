import { createContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { clearAuthTokens, initializeAuth } from '../services/authService.js';

const AuthContext = createContext({});

const STORAGE_KEYS = {
  token: 'auth_access_token',
  user: 'auth_current_user',
  loginTime: 'auth_last_login',
};

const readStorage = (key) => sessionStorage.getItem(key) ?? localStorage.getItem(key);
const writeStorage = (key, value, remember) => {
  if (remember) {
    localStorage.setItem(key, value);
    sessionStorage.removeItem(key);
  } else {
    sessionStorage.setItem(key, value);
    localStorage.removeItem(key);
  }
};
const clearStorage = (key) => {
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
};

const readJsonStorage = (key) => {
  const raw = readStorage(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => readJsonStorage(STORAGE_KEYS.user));
  const [token, setToken] = useState(() => readStorage(STORAGE_KEYS.token));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      initializeAuth(token);
    }
  }, [token]);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (token) {
          initializeAuth(token);
          const me = await authService.fetchMe();
          const user = me && me.user ? me.user : me;
          setCurrentUser(user);
          const remember = Boolean(localStorage.getItem(STORAGE_KEYS.token));
          writeStorage(STORAGE_KEYS.user, JSON.stringify(user), remember);
        } else {
          const refreshData = await authService.refreshToken();
          persistSession(refreshData, true);
        }
      } catch (error) {
        clearSession();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [token]);

  const persistSession = (data, remember) => {
    if (!data) return;

    const { accessToken, user } = data;
    const persistedRemember = remember ?? true;

    setToken(accessToken);
    setCurrentUser(user);
    initializeAuth(accessToken);
    writeStorage(STORAGE_KEYS.token, accessToken, persistedRemember);
    writeStorage(STORAGE_KEYS.user, JSON.stringify(user), persistedRemember);
    writeStorage(STORAGE_KEYS.loginTime, new Date().toISOString(), persistedRemember);
  };

  const oauthLogin = (data, remember = true) => {
    // data is expected to contain { accessToken, user }
    persistSession(data, remember);
  };

  const clearSession = () => {
    setToken(null);
    setCurrentUser(null);
    clearAuthTokens();
    clearStorage(STORAGE_KEYS.token);
    clearStorage(STORAGE_KEYS.user);
    clearStorage(STORAGE_KEYS.loginTime);
  };

  const handleLogout = async (quiet = false) => {
    try {
      await authService.logout();
    } catch {
      // continue to clear client state regardless of logout response
    }

    clearSession();

    if (!quiet) {
      navigate('/login');
    }
  };

  const login = async (payload, remember) => {
    setLoading(true);
    try {
      const sanitizedPayload = {
        ...payload,
        identifier: payload.identifier?.trim?.(),
        password: payload.password?.trim?.(),
      };
      const data = await authService.login(sanitizedPayload);
      persistSession(data, remember);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const sanitizedPayload = {
        ...payload,
        fullName: payload.fullName?.trim?.(),
        email: payload.email?.trim?.().toLowerCase(),
        mobile: payload.mobile?.trim?.(),
        username: payload.username?.trim?.(),
        password: payload.password?.trim?.(),
      };
      const data = await authService.register(sanitizedPayload);
      persistSession(data, true);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (payload) => {
    setLoading(true);
    try {
      const sanitizedPayload = {
        email: payload.email?.trim?.().toLowerCase(),
      };
      const data = await authService.forgotPassword(sanitizedPayload);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(token && currentUser),
      loading,
      login,
      logout: handleLogout,
      register,
      oauthLogin,
      forgotPassword,
    }),
    [currentUser, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };
