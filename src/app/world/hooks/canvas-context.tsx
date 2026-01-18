'use client'

import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { useThree } from '@react-three/fiber'
import { CanvasContextType } from '@/app/world/types/world-types'

/* Canvas context. */
const CanvasContext = createContext<CanvasContextType | undefined>(undefined)

/**
 * Canvas provider component.
 * Provides the canvas context to child components.
 */
export const CanvasProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsCanvasLoaded(false)
  }, [pathname])

  const setCanvasLoaded = (loaded: boolean) => {
    setIsCanvasLoaded(loaded)
  }

  return (
    <CanvasContext.Provider value={{ isCanvasLoaded, setCanvasLoaded }}>
      {children}
    </CanvasContext.Provider>
  )
}

/**
 * Canvas hook.
 * Provides access to the canvas context.
 */
export const useCanvas = () => {
  const context = useContext(CanvasContext)
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider')
  }
  return context
}

/**
 * Canvas loader component.
 * Loads the canvas and sets the event listeners for context loss and restoration.
 */
export function CanvasLoader() {
    const { gl } = useThree()
    const { setCanvasLoaded } = useCanvas()

    useEffect(() => {
        const handleContextLost = (event: Event) => {
            if (event instanceof WebGLContextEvent) {
                event.preventDefault()
                console.error('WebGL context lost. Trying to restore...')
                setCanvasLoaded(false)
            }
        }

        const handleContextRestored = () => {
            console.error('WebGL context restored.')
            setCanvasLoaded(true)
        }

        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored)

        setCanvasLoaded(true)

        return () => {
            gl.domElement.removeEventListener('webglcontextlost', handleContextLost)
            gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored)
        }
    }, [gl, setCanvasLoaded])

    return null
}