'use client'

import { useRef, useState, useEffect } from 'react'
import { useJoystickControls } from 'ecctrl'
import { Button } from "@/components/ui/button"

/**
 * The movement controls component.
 * Displays the on-screen controls for touch devices.
 * Features:
 * - Joystick control for movement with auto-sprint
 * - Jump button for jumping
 * 
 * @returns The movement controls component.
 */
export default function MovementControls() {
  const joystickRef = useRef<HTMLDivElement>(null)
  const jumpRef = useRef<HTMLButtonElement>(null)
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 })
  const isDraggingRef = useRef(false)

  const setJoystick = useJoystickControls((state) => state.setJoystick)
  const pressButton1 = useJoystickControls((state) => state.pressButton1)
  const releaseAllButtons = useJoystickControls((state) => state.releaseAllButtons)

  useEffect(() => {

    const joystick = joystickRef.current
    const jump = jumpRef.current

    if (!joystick) return

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      if (touch) {
        isDraggingRef.current = true
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!isDraggingRef.current) return
      const touch = e.touches[0]
      if (touch && joystick) {
        const rect = joystick.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        let deltaX = touch.clientX - centerX
        let deltaY = touch.clientY - centerY
        const maxRadius = 60
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        if (distance > maxRadius) {
          deltaX = (deltaX / distance) * maxRadius
          deltaY = (deltaY / distance) * maxRadius
        }
        setJoystickPos({ x: deltaX, y: deltaY })
        const normalizedDistance = Math.min(distance / maxRadius, 1)
        const angle = Math.atan2(deltaX, deltaY) - Math.PI / 2
        setJoystick(normalizedDistance, angle, true)
      }
    }

    const onTouchEnd = () => {
      isDraggingRef.current = false
      setJoystickPos({ x: 0, y: 0 })
      setJoystick(0, 0, false)
    }

    const onJumpTouch = (e: TouchEvent) => {
      e.preventDefault()
      pressButton1()
      setTimeout(() => releaseAllButtons(), 100)
    }

    joystick.addEventListener('touchstart', onTouchStart, { passive: false })
    joystick.addEventListener('touchmove', onTouchMove, { passive: false })
    joystick.addEventListener('touchend', onTouchEnd)
    jump?.addEventListener('touchstart', onJumpTouch, { passive: false })
    
    return () => {
      joystick.removeEventListener('touchstart', onTouchStart)
      joystick.removeEventListener('touchmove', onTouchMove)
      joystick.removeEventListener('touchend', onTouchEnd)
      jump?.removeEventListener('touchstart', onJumpTouch)
    }
  }, [setJoystick, pressButton1, releaseAllButtons])

  return (
    <div className="z-50 pointer-events-none flex justify-between items-end m-0">
      {/* Joystick */}
      <div
        ref={joystickRef}
        className="relative w-32 h-32 rounded-full bg-background/75 border-primary/30 border backdrop-blur-sm pointer-events-auto touch-none"
      >
        {/* Joystick knob */}
        <div
          className="absolute w-16 h-16 rounded-full bg-foreground/60 backdrop-blur-md"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${joystickPos.x}px), calc(-50% + ${joystickPos.y}px))`
          }}
        />
      </div>

      {/* Jump button */}
      <Button
        ref={jumpRef}
        className="w-20 h-20 rounded-full bg-background/75 border-primary/30 border backdrop-blur-sm pointer-events-auto touch-none flex items-center justify-center text-foreground font-bold"
      >
        JUMP
      </Button>
    </div>
  )
}
