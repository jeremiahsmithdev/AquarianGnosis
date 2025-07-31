import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Aggressively unregister any existing service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    let hasServiceWorkers = registrations.length > 0;
    for(let registration of registrations) {
      registration.unregister().then(() => {
        console.log('Service worker unregistered');
      });
    }
    
    // Force reload after clearing service workers
    if (hasServiceWorkers) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  });
  
  // Also clear any cached service worker
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
