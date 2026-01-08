import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initAnalytics } from './services/analytics'

// Initialize PostHog analytics before React renders
initAnalytics()

// Register PWA service worker
if ('serviceWorker' in navigator) {
  // Import and register the PWA service worker
  import('virtual:pwa-register').then(({ registerSW }) => {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Show a prompt to user for update
        if (confirm('New content available. Reload?')) {
          updateSW(true)
        }
      },
      onOfflineReady() {
        console.log('App ready to work offline')
      },
      onRegistered(r) {
        console.log('SW Registered: ' + r)
      },
      onRegisterError(error) {
        console.log('SW registration error', error)
      }
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
