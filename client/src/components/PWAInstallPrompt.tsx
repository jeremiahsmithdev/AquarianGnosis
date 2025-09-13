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
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault()
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Show the prompt
    deferredPrompt.prompt()

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      console.log('User accepted the PWA install prompt')
    } else {
      console.log('User dismissed the PWA install prompt')
    }

    // Clear the deferredPrompt and hide the button
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    setDeferredPrompt(null)
  }

  if (!isVisible || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-blue-600 text-white p-4 rounded-lg shadow-lg z-50 md:left-auto md:right-4 md:max-w-sm">
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
        <button
          onClick={handleDismiss}
          className="text-blue-100 hover:text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Maybe Later
        </button>
      </div>
    </div>
  )
}