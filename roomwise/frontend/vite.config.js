import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mui/x-date-pickers'],
    include: ['date-fns'],
  },
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      // Redirigir las peticiones de /api al backend de Flask
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      }
    }
  }
});
