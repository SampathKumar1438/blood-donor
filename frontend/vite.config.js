import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
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
    'process.env': {}
  }
})
