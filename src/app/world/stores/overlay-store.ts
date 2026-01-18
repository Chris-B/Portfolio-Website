import { create } from 'zustand'

/* Overlay store state types */
export type OverlayState = {
  isControlsOpen: boolean
  isAvatarChatOpen: boolean
  isMusicVideoControlsOpen: boolean
  musicVideoSelection: string
}

/* Overlay store actions types */
export type OverlayActions = {
  toggleControls: (isControlsOpen: boolean) => void
  toggleAvatarChat: (isAvatarChatOpen: boolean) => void
  toggleMusicVideoControls: (isMusicVideoControlsOpen: boolean) => void
  setMusicVideoSelection: (musicVideoSelection: string) => void
}

/* Overlay store combined type */
export type OverlayStore = OverlayState & OverlayActions

/**
 * Overlay store hook.
 * Sets default values and returns the overlay store.
 * The overlay store is used to control the visibility of each overlay component.
 * 
 * @returns {OverlayStore} The overlay store.
 */
export const useOverlayStore = create<OverlayStore>((set) => ({
  isControlsOpen: true,
  isAvatarChatOpen: false,
  isMusicVideoControlsOpen: false,
  musicVideoSelection: "Middle",

  toggleControls: (isControlsOpen: boolean) => set(() => ({ isControlsOpen })),
  toggleAvatarChat: (isAvatarChatOpen: boolean) => set(() => ({ isAvatarChatOpen })),
  toggleMusicVideoControls: (isMusicVideoControlsOpen: boolean) => set(() => ({ isMusicVideoControlsOpen })),
  setMusicVideoSelection: (musicVideoSelection: string) => set(() => ({ musicVideoSelection })),
}))