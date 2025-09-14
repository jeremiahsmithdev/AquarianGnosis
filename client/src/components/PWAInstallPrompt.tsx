import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true) {
      return
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    const handleAppInstalled = () => {
      setIsVisible(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    // Development mode: Show install prompt after 2 seconds for testing
    if (import.meta.env.DEV) {
      const devTimer = setTimeout(() => {
        setIsVisible(true)
        // Create a mock prompt for development
        setDeferredPrompt({
          prompt: async () => console.log('Mock PWA install triggered'),
          userChoice: Promise.resolve({ outcome: 'accepted' as const, platform: 'web' }),
          platforms: ['web'],
          preventDefault: () => {},
          type: 'beforeinstallprompt'
        } as BeforeInstallPromptEvent)
      }, 2000)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.removeEventListener('appinstalled', handleAppInstalled)
        clearTimeout(devTimer)
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      // Show the prompt
      await deferredPrompt.prompt()

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice

      console.log(`PWA install prompt result: ${outcome}`)

      // Always clear the prompt and hide the button after interaction
      setDeferredPrompt(null)
      setIsVisible(false)
    } catch (error) {
      console.error('Error during PWA install:', error)
      // Still hide the prompt even if there's an error
      setDeferredPrompt(null)
      setIsVisible(false)
    }
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setDeferredPrompt(null)
  }

  if (!isVisible || !deferredPrompt) {
    return null
  }

  return (
    <div
      className="fixed text-white shadow-xl z-50 transform transition-all duration-300 ease-out animate-slide-in"
      style={{
        top: window.innerWidth >= 768 ? '80px' : '60px',
        right: '16px',
        left: window.innerWidth >= 768 ? 'auto' : '16px',
        transform: 'none',
        maxWidth: window.innerWidth >= 768 ? '20rem' : 'calc(100vw - 32px)',
        padding: window.innerWidth >= 768 ? '24px' : '16px',
        borderRadius: window.innerWidth >= 768 ? '16px' : '8px',
        animation: 'slideInRight 0.3s ease-out',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Install Aquarian Gnosis</h3>
          <p className="text-xs text-blue-100 mt-1">
            Add to your home screen for quick access and offline use
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-blue-100 hover:text-white p-1"
          aria-label="Dismiss install prompt"
        >
          ✕
        </button>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleInstallClick}
          className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50 transition-colors"
        >
          Install
        </button>
        <div className="flex-1"></div>
        <button
          onClick={handleDismiss}
          className="text-blue-100 hover:text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Maybe Later
        </button>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}