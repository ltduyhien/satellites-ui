import { defineConfig } from 'vite'
// defineConfig: Helper function from Vite that provides type hints and autocompletion
// for the configuration object. It doesn't transform the config — just improves DX.

import react from '@vitejs/plugin-react'
// @vitejs/plugin-react: Official Vite plugin that enables React support.
// Handles JSX transformation (converting <Component /> into React.createElement calls),
// Fast Refresh (hot module replacement that preserves component state during edits),
// and automatic JSX runtime injection (so you don't need `import React` in every file).

export default defineConfig({
  // export default: Vite reads this file at startup and expects a default export
  // with the configuration object (or a function that returns one).

  plugins: [react()],
  // plugins: Array of Vite plugins to activate.
  // react(): Initializes the React plugin with default settings.
  // Under the hood, this uses SWC (a Rust-based compiler) for fast JSX transforms.
})
