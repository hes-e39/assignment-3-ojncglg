import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    __DEFINES__: '{}'
  },
  base: '/assignment-3-ojncglg/'
})
