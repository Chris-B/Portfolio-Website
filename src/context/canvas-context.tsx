'use client'

import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react'
import { usePathname } from 'next/navigation'

type CanvasContextType = {
  isCanvasLoaded: boolean
  setCanvasLoaded: (loaded: boolean) => void
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined)

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

export const useCanvas = () => {
  const context = useContext(CanvasContext)
  if (context === undefined) {
    throw new Error('useCanvas must be used within a CanvasProvider')
  }
  return context
}