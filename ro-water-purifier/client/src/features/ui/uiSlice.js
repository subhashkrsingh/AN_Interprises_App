import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  mode: localStorage.getItem('admin_theme') || 'dark',
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMode: (state) => {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('admin_theme', state.mode);
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleMode, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;