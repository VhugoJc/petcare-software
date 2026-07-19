import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  // Bind to 0.0.0.0 so the container is reachable from the host
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,

    // Enable polling for hot reload inside Docker (file system events
    // don't always propagate across container boundaries on macOS/Windows)
    watch: {
      usePolling: true,
      interval: 1000,
    },

    // Proxy API requests to the backend container during development.
    // This avoids CORS issues and keeps the frontend config simple.
    proxy: {
      '/api': {
        target: 'http://petcare-backend:5000',
        changeOrigin: true,
      },
    },
  },
})
