import { create } from 'zustand'
import { AskResponse } from '@/app/world/schemas/ask-schemas'
import { ChatMessage } from '@/app/world/types/world-types'

export type AvatarState = {
  isSpeaking: boolean
  response: AskResponse | null
  audio: HTMLAudioElement | null
  messages: ChatMessage[]
}

export type AvatarActions = {
  toggleSpeech: (isSpeaking: boolean) => void
  setResponse: (response: AskResponse | null) => void
  ensureAudio: () => HTMLAudioElement | null
  addMessage: (message: ChatMessage) => void
}

export type AvatarStore = AvatarState & AvatarActions

export const useAvatarStore = create<AvatarStore>((set, get) => ({
  isSpeaking: false,
  response: null,
  audio: null,
  messages: [],
  toggleSpeech: (isSpeaking: boolean) => set(() => ({ isSpeaking })),
  setResponse: (response: AskResponse | null) => set(() => ({ response })),
  ensureAudio: () => {
    if (typeof window === 'undefined') return null

    const existing = get().audio
    if (existing) return existing

    const created = new Audio()
    created.preload = 'auto'
    created.setAttribute('playsinline', 'true')
    created.setAttribute('webkit-playsinline', 'true')
    set(() => ({ audio: created }))
    return created
  },
  addMessage: (message: ChatMessage) => {
    const messages = get().messages
    set(() => ({ messages: [...messages, message] }))
  },
}))