import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables for the current mode (development or production)
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    // Used for production builds
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 1600,
    },
    // For production preview
    preview: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0', // Make it externally accessible
    },
    // Environment variable configuration
    define: {
      // Making VITE_API_URL available at build time
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:5000'),
    }
  }
})
