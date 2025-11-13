import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  base: '/couchdb/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname)
    }
  }
})
