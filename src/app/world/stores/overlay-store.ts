import { create } from 'zustand'

export type OverlayState = {
  isControlsOpen: boolean
  isAvatarChatOpen: boolean
  isMusicVideoControlsOpen: boolean
  musicVideoSelection: string
}

export type OverlayActions = {
  toggleControls: (isControlsOpen: boolean) => void
  toggleAvatarChat: (isAvatarChatOpen: boolean) => void
  toggleMusicVideoControls: (isMusicVideoControlsOpen: boolean) => void
  setMusicVideoSelection: (musicVideoSelection: string) => void
}

export type OverlayStore = OverlayState & OverlayActions

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