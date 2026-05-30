import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Kosa/', // <-- Tambah baris ni (pastikan ada / di depan dan belakang)
  plugins: [
    vue(),
    tailwindcss(),
  ],
})