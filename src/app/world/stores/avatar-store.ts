import { create } from 'zustand'
import { AskResponse } from '@/app/world/schemas/ask-schemas'
import { ChatMessage } from '@/app/world/types/world-types'

/**
 * Avatar store state.
 * 
 * @property {boolean} isSpeaking - Whether the avatar is speaking.
 * @property {AskResponse | null} response - The current response from the avatar.
 * @property {HTMLAudioElement | null} audio - The audio for the current response.
 * @property {ChatMessage[]} messages - The chat messages history.
 */
export type AvatarState = {
  isSpeaking: boolean
  response: AskResponse | null
  audio: HTMLAudioElement | null
  messages: ChatMessage[]
}

/**
 * Avatar store actions.
 * 
 * @property {function} toggleSpeech - Toggles the speech state.
 * @property {function} setResponse - Sets the response.
 * @property {function} ensureAudio - Ensures the audio element is created.
 * @property {function} addMessage - Adds a message to the chat history.
 */
export type AvatarActions = {
  toggleSpeech: (isSpeaking: boolean) => void
  setResponse: (response: AskResponse | null) => void
  ensureAudio: () => HTMLAudioElement | null
  addMessage: (message: ChatMessage) => void
}

/**
 * Avatar store type.
 */
export type AvatarStore = AvatarState & AvatarActions

/**
 * Avatar store hook.
 * Sets default values and provides actions for the avatar.
 * 
 * @returns {AvatarStore} The avatar store.
 */
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