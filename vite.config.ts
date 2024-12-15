import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __DEFINES__: '{}'
  },
  server: {
    port: 4173
  },
  base: '/assignment-3-ojncglg/',
  preview: {
    port: 4173
  }
})