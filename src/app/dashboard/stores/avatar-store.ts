import { create } from 'zustand'
import { AskResponse } from '~/app/dashboard/schemas/ask-schemas'

export type AvatarState = {
  isSitting: boolean
  isSpeaking: boolean
  isDancing: boolean
  response: AskResponse | null
}

export type AvatarActions = {
  sitDown: () => void
  standUp: () => void
  toggleSitting: () => void
  toggleSpeech: () => void
  toggleDancing: () => void
  setResponse: (response: AskResponse | null) => void
}

export type AvatarStore = AvatarState & AvatarActions

export const useAvatarStore = create<AvatarStore>((set) => ({
  isSitting: true,
  isSpeaking: false,
  isDancing: false,
  response: null,
  sitDown: () => set(() => ({ isDancing: false, isSitting: true })),
  standUp: () => set(() => ({ isDancing: false, isSitting: false })),
  toggleSitting: () => set((state) => ({ isDancing: false, isSitting: !state.isSitting })),
  toggleSpeech: () => set((state) => ({ isSpeaking: !state.isSpeaking })),
  toggleDancing: () => set((state) => ({ isSitting: !state.isDancing ? false : state.isSitting, isDancing: !state.isDancing })),
  setResponse: (response: AskResponse | null) => set(() => ({ response })),
}))