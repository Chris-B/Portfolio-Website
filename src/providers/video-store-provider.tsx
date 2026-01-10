'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type VideoStore, createVideoStore } from '~/stores/video-store'

export type VideoStoreApi = ReturnType<typeof createVideoStore>

export const VideoStoreContext = createContext<VideoStoreApi | undefined>(
  undefined,
)

export interface VideoStoreProviderProps {
  children: ReactNode
}

export const VideoStoreProvider = ({
  children,
}: VideoStoreProviderProps) => {
  const storeRef = useRef<VideoStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createVideoStore()
  }

  return (
    <VideoStoreContext.Provider value={storeRef.current}>
      {children}
    </VideoStoreContext.Provider>
  )
}

export const useVideoStore = <T,>(
  selector: (store: VideoStore) => T,
): T => {
  const videoStoreContext = useContext(VideoStoreContext)

  if (!videoStoreContext) {
    throw new Error(`useVideoStore must be used within VideoStoreProvider`)
  }

  return useStore(videoStoreContext, selector)
}