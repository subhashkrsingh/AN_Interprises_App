import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          charts: ['recharts'],
          motion: ['framer-motion'],
          client: ['@tanstack/react-query', '@react-oauth/google', 'axios', 'react-hook-form', 'zod', 'react-icons'],
        },
      },
    },
  },
});
