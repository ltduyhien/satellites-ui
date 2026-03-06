import { defineConfig } from 'vite'
// defineConfig: Helper function from Vite that provides type hints and autocompletion
// for the configuration object. It doesn't transform the config — just improves DX.

import react from '@vitejs/plugin-react'
// @vitejs/plugin-react: Official Vite plugin that enables React support.
// Handles JSX transformation (converting <Component /> into React.createElement calls),
// Fast Refresh (hot module replacement that preserves component state during edits),
// and automatic JSX runtime injection (so you don't need `import React` in every file).

import tailwindcss from '@tailwindcss/vite'
// @tailwindcss/vite: Official Tailwind CSS v4 Vite plugin.
// Processes Tailwind utility classes at build time — scans your source files for class names
// and generates only the CSS you actually use. Replaces the old PostCSS-based setup.

import path from 'path'
// path: Node.js built-in module for working with file and directory paths.
// We use path.resolve() below to create an absolute path for the @ import alias.

export default defineConfig({
  // export default: Vite reads this file at startup and expects a default export
  // with the configuration object (or a function that returns one).

  plugins: [react(), tailwindcss()],
  // plugins: Array of Vite plugins to activate.
  // react(): Initializes the React plugin with SWC for fast JSX transforms.
  // tailwindcss(): Enables Tailwind CSS processing — scans files and generates utility CSS.

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // alias "@" → "./src": Mirrors the tsconfig paths configuration for Vite's runtime.
      // TypeScript paths only affect type-checking; Vite needs its own alias config
      // to actually resolve `@/shared/ui/button` to `./src/shared/ui/button` at build time.
      // path.resolve(__dirname, './src') creates an absolute path to the src directory.
      // __dirname: Node.js variable containing the directory of the current file (frontend/).
    },
  },

  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        // target: Where to forward requests that match the '/api' prefix.
        // The LARVIS backend runs on port 8080 (either directly or via Docker).
        changeOrigin: true,
        // changeOrigin: Modify the Origin header to match the target URL.
        // Some servers reject requests with mismatched origins.
        rewrite: (path) => path.replace(/^\/api/, ''),
        // rewrite: Strip the '/api' prefix before forwarding to the backend.
        // Frontend calls /api/token → proxy sends /token to localhost:8080.
        // This matches the nginx proxy behavior in production (see nginx.conf).
      },
    },
  },
  // server.proxy: Vite dev server proxy configuration.
  // In development (npm run dev), the frontend runs on :5173 and the backend on :8080.
  // Without a proxy, browser CORS policy would block cross-origin API requests.
  // The proxy makes the browser think API calls go to :5173 (same origin),
  // but Vite secretly forwards them to :8080 behind the scenes.
})
