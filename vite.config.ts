import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // The PDF layer also runs inside a Web Worker, where React Fast Refresh's `window` preamble would crash it
    // (react-pdf's pre-bundled dep looks like a component library to the plugin, so it is excluded too).
    react({ exclude: [/[\\/]src[\\/]pdf[\\/]/, /[\\/]\.vite[\\/]deps[\\/]@react-pdf/, /[\\/]@react-pdf[\\/]/] }),
    tailwindcss(),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  worker: { format: 'es' },
})
