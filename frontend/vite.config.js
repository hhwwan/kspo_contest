import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.124.222.250:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
