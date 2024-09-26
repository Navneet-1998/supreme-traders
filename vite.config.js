import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Enable React plugin
  plugins: [react()],

  // Resolve aliases
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Alias for src directory
    },
  },

  // Server configuration
  server: {
    port: 3000, // Run server on port 3000
  },

  // Build configuration
  build: {
    chunkSizeWarningLimit: 10000, // Set chunk size warning limit to 1 MB
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@mui/material'], // Move heavy libraries to separate chunks
        },
      },
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
          return;
        }
        warn(warning);
      },
    },
  },
});