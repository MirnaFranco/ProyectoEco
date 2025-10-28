import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  root: '.', // raíz del proyecto
  server: {
    port: 5173,
  },
  plugins:[
    tailwindcss(),
  ],
})
