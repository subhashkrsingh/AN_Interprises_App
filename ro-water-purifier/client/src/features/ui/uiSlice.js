import { createSlice } from '@reduxjs/toolkit';

const initialMode = localStorage.getItem('admin_theme_mode') || 'dark';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    mode: initialMode,
    sidebarOpen: false,
  },
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin_theme_mode', state.mode);
    },
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleMode, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
