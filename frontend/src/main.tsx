// main.tsx: Application entry point — the first file that runs.
// Mounts the React app into the DOM element with id="root" in index.html.

import { StrictMode } from 'react'
// StrictMode: React development tool that enables extra checks and warnings.
// It renders components twice in development (not in production) to catch side effects,
// detects deprecated APIs, and warns about unsafe lifecycle methods.

import { createRoot } from 'react-dom/client'
// createRoot: React 18+ API to create a root DOM node for rendering.
// Replaces the old ReactDOM.render() method and enables concurrent features.

import './index.css'
// index.css: Global styles — imports Tailwind CSS, shadcn theme variables,
// and base styles. Must be imported here so styles are available everywhere.

import { App } from './app/App'
// App: The root React component that wires providers and router together.

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found. Check index.html.')
createRoot(rootEl)
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
    // Render the App component inside StrictMode.
    // StrictMode wrapping is development-only — it's stripped out in production builds.
  )
