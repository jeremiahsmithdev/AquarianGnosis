import { ReactNode, TouchEvent, useState } from 'react'

interface TouchOptimizedProps {
  children: ReactNode
  onTap?: () => void
  onLongPress?: () => void
  className?: string
  disabled?: boolean
}

export default function TouchOptimized({
  children,
  onTap,
  onLongPress,
  className = '',
  disabled = false
}: TouchOptimizedProps) {
  const [touchStart, setTouchStart] = useState<number>(0)
  const [longPressTimeout, setLongPressTimeout] = useState<NodeJS.Timeout | null>(null)
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled) return

    const touch = e.touches[0]
    setTouchStart(Date.now())
    setIsPressed(true)

    // Set up long press detection
    if (onLongPress) {
      const timeout = setTimeout(() => {
        onLongPress()
        setLongPressTimeout(null)
      }, 500) // 500ms for long press

      setLongPressTimeout(timeout)
    }
  }

  const handleTouchEnd = (e: TouchEvent) => {
    if (disabled) return

    const touchEnd = Date.now()
    const touchDuration = touchEnd - touchStart

    setIsPressed(false)

    // Clear long press timeout
    if (longPressTimeout) {
      clearTimeout(longPressTimeout)
      setLongPressTimeout(null)
    }

    // If it was a quick tap and not a long press
    if (touchDuration < 500 && onTap) {
      onTap()
    }
  }

  const handleTouchCancel = () => {
    setIsPressed(false)
    if (longPressTimeout) {
      clearTimeout(longPressTimeout)
      setLongPressTimeout(null)
    }
  }

  const baseClasses = `
    select-none touch-manipulation
    ${isPressed ? 'scale-95' : 'scale-100'}
    transition-transform duration-150 ease-out
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `

  return (
    <div
      className={`${baseClasses} ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchCancel}
      // Fallback for mouse events
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => {
        setIsPressed(false)
        if (!disabled && onTap) onTap()
      }}
      onMouseLeave={() => setIsPressed(false)}
    >
      {children}
    </div>
  )
}