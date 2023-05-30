import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pluginRoutes } from 'freestyle/plugins';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pluginRoutes()],
})
