import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('admin_access_token') || sessionStorage.getItem('admin_access_token');
const userRaw = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');

const initialState = {
  token,
  user: userRaw ? JSON.parse(userRaw) : null,
};

function persistAuth(state, remember = true) {
  const storage = remember ? localStorage : sessionStorage;
  const other = remember ? sessionStorage : localStorage;

  if (state.token) storage.setItem('admin_access_token', state.token);
  if (state.user) storage.setItem('admin_user', JSON.stringify(state.user));
  other.removeItem('admin_access_token');
  other.removeItem('admin_user');
}

function clearAuthStorage() {
  localStorage.removeItem('admin_access_token');
  localStorage.removeItem('admin_user');
  sessionStorage.removeItem('admin_access_token');
  sessionStorage.removeItem('admin_user');
}

const authSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      persistAuth(state, action.payload.remember !== false);
    },
    setUser(state, action) {
      state.user = action.payload;
      persistAuth(state, true);
    },
    clearCredentials(state) {
      state.token = null;
      state.user = null;
      clearAuthStorage();
    },
  },
});

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
