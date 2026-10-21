import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import '@fontsource-variable/figtree'
import '@fontsource-variable/plus-jakarta-sans'

import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)

// Let the splash screen from index.html play for a moment, then zoom it away once the app has painted.
const splash = document.getElementById('splash')
if (splash) {
  const MIN_VISIBLE_MS = 1000
  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now())
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      window.setTimeout(() => {
        splash.classList.add('done')
        window.setTimeout(() => splash.remove(), 400)
      }, wait),
    ),
  )
}
