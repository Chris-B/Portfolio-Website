'use client'

import { type ReactNode, createContext, useRef, useContext } from 'react'
import { useStore } from 'zustand'

import { type AvatarStore, createAvatarStore } from '~/stores/avatar-store'

export type AvatarStoreApi = ReturnType<typeof createAvatarStore>

export const AvatarStoreContext = createContext<AvatarStoreApi | undefined>(
  undefined,
)

export interface AvatarStoreProviderProps {
  children: ReactNode
}

export const AvatarStoreProvider = ({
  children,
}: AvatarStoreProviderProps) => {
  const storeRef = useRef<AvatarStoreApi>()
  if (!storeRef.current) {
    storeRef.current = createAvatarStore()
  }

  return (
    <AvatarStoreContext.Provider value={storeRef.current}>
      {children}
    </AvatarStoreContext.Provider>
  )
}

export const useAvatarStore = <T,>(
  selector: (store: AvatarStore) => T,
): T => {
  const avatarStoreContext = useContext(AvatarStoreContext)

  if (!avatarStoreContext) {
    throw new Error(`useAvatarStore must be used within AvatarStoreProvider`)
  }

  return useStore(avatarStoreContext, selector)
}