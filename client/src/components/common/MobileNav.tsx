import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

interface MobileNavProps {
  onNavigate: (section: string) => void
  onAuthClick: () => void
}

export default function MobileNav({ onNavigate, onAuthClick }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuthStore()

  const handleNavigate = (section: string) => {
    onNavigate(section)
    setIsOpen(false)
  }

  const handleAuth = () => {
    onAuthClick()
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-white text-xl font-bold">Aquarian Gnosis</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white p-2 hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-black bg-opacity-90 backdrop-blur-md border-b border-white border-opacity-10 z-50">
            <div className="flex flex-col p-4 space-y-2">
              <button
                onClick={() => handleNavigate('resources')}
                className="text-white text-left py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
              >
                Resources
              </button>
              <button
                onClick={() => handleNavigate('organizations')}
                className="text-white text-left py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
              >
                Organizations
              </button>
              <button
                onClick={() => handleNavigate('community')}
                className="text-white text-left py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
              >
                Community
              </button>
              <button
                onClick={() => handleNavigate('map')}
                className="text-white text-left py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
              >
                Map
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => handleNavigate('messages')}
                  className="text-white text-left py-3 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-colors"
                >
                  Messages
                </button>
              )}

              <div className="border-t border-white border-opacity-20 pt-2 mt-2">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="text-white text-sm px-4 py-2">
                      Welcome, {user?.username}
                    </div>
                    <button
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="w-full text-white text-left py-3 px-4 bg-white bg-opacity-10 hover:bg-opacity-20 rounded-md transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAuth}
                    className="w-full text-white text-left py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden lg:grid grid-cols-3 items-center py-5 px-10 bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
        <div>
          <h1 className="text-white text-2xl font-bold tracking-wide">Aquarian Gnosis</h1>
        </div>

        <div className="flex justify-center space-x-8">
          <button
            onClick={() => onNavigate('resources')}
            className="text-white text-opacity-90 hover:text-opacity-100 font-medium py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-all"
          >
            Resources
          </button>
          <button
            onClick={() => onNavigate('organizations')}
            className="text-white text-opacity-90 hover:text-opacity-100 font-medium py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-all"
          >
            Organizations
          </button>
          <button
            onClick={() => onNavigate('community')}
            className="text-white text-opacity-90 hover:text-opacity-100 font-medium py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-all"
          >
            Community
          </button>
          <button
            onClick={() => onNavigate('map')}
            className="text-white text-opacity-90 hover:text-opacity-100 font-medium py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-all"
          >
            Map
          </button>
          {isAuthenticated && (
            <button
              onClick={() => onNavigate('messages')}
              className="text-white text-opacity-90 hover:text-opacity-100 font-medium py-2 px-4 hover:bg-white hover:bg-opacity-10 rounded-md transition-all"
            >
              Messages
            </button>
          )}
        </div>

        <div className="flex justify-end">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <span className="text-white text-opacity-90 text-sm">
                Welcome, {user?.username}
              </span>
              <button
                onClick={logout}
                className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-30 text-white py-2 px-4 rounded-md text-sm font-medium transition-all"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="bg-white bg-opacity-10 hover:bg-opacity-20 border border-white border-opacity-30 text-white py-2 px-4 rounded-md text-sm font-medium transition-all"
            >
              Sign In / Register
            </button>
          )}
        </div>
      </nav>
    </>
  )
}