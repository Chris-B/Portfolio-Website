import { Audio } from 'three'
import { createStore, useStore, StoreApi } from 'zustand';

/**
 * Music video state interface.
 * Types the variables and actions for the music video store.
 */
interface MusicVideoState {
  isPlaying: boolean
  audioLoaded: boolean
  videoLoaded: boolean
  videoElement: HTMLVideoElement | null
  audio: Audio | null
  videoSrc: string | null
  audioBuffer: AudioBuffer | null
  depthEffect: number
  currentTime: number
  volume: number
  readyForControl: boolean
  setIsPlaying: (playing: boolean) => void
  setLoaded: (loaded: boolean) => void
  setAudioLoaded: (loaded: boolean) => void
  setVideoElement: (element: HTMLVideoElement | null) => void
  setAudio: (audio: Audio | null) => void
  setVideoSrc: (videoSrc: string | null) => void
  setAudioBuffer: (audioBuffer: AudioBuffer | null) => void
  setDepthEffect: (depthEffect: number) => void
  setCurrentTime: (currentTime: number) => void
  setVolume: (volume: number) => void
  setReadyForControl: (readyForControl: boolean) => void
}

/**
 * Music video store registry.
 * Contains all current music video stores.
 * 
 * @type {Record<string, StoreApi<MusicVideoState>>}
 */
const musicVideoRegistry: Record<string, StoreApi<MusicVideoState>> = {}

/**
 * Gets a music video store instance based on the ID.
 * If the store doesn't exist, it creates a new one and sets default values.
 * 
 * @param id - The ID of the music video store.
 * @returns The music video store instance.
 */
export const getMusicVideoStoreInstance = (id: string): StoreApi<MusicVideoState> => {
  if (!musicVideoRegistry[id]) {
    musicVideoRegistry[id] = createStore<MusicVideoState>((set) => ({
      isPlaying: false,
      audioLoaded: false,
      videoLoaded: false,
      videoElement: null,
      audio: null,
      videoSrc: null,
      audioBuffer: null,
      depthEffect: 3,
      currentTime: 0,
      volume: 0.5,
      readyForControl: false,
      setIsPlaying: (playing: boolean) => set(() => ({ isPlaying: playing })),
      setLoaded: (loaded: boolean) => set(() => ({ videoLoaded: loaded })),
      setAudioLoaded: (loaded: boolean) => set(() => ({ audioLoaded: loaded })),
      setVideoElement: (element: HTMLVideoElement | null) => set(() => ({ videoElement: element })),
      setAudio: (audio: Audio | null) => set(() => ({ audio: audio })),
      setVideoSrc: (videoSrc: string | null) => set(() => ({ videoSrc: videoSrc })),
      setAudioBuffer: (audioBuffer: AudioBuffer | null) => set(() => ({ audioBuffer: audioBuffer })),
      setDepthEffect: (depthEffect: number) => set(() => ({ depthEffect: depthEffect })),
      setCurrentTime: (currentTime: number) => set(() => ({ currentTime: currentTime })),
      setVolume: (volume: number) => set(() => ({ volume: volume })),
      setReadyForControl: (readyForControl: boolean) => set(() => ({ readyForControl: readyForControl })),
    }))
  }
  return musicVideoRegistry[id]
}

/**
 * Hook for accessing a music video store based on the ID.
 * 
 * @param id - The ID of the music video store.
 * @param selector - The selector used to get the values from the store.
 * @returns The selected values from the store.
 */
export function useMusicVideoStore<T>(id: string, selector: (state: MusicVideoState) => T): T {
  const store = getMusicVideoStoreInstance(id)
  return useStore(store, selector)
}

/* Helper function to pause all music videos */
export function pauseAllMusicVideos() {
    Object.values(musicVideoRegistry).forEach(store => {
        store.setState({ isPlaying: false })
    })
}

/* Helper function to cleanup all video and audio elements and reset the store */
export function cleanupAllMusicVideos() {
    Object.entries(musicVideoRegistry).forEach(([id, store]) => {
        const state = store.getState()
        
        /* Stop and cleanup audio */
        if (state.audio) {
            if (state.audio.isPlaying) state.audio.stop()
            state.audio.disconnect()
        }
        
        /* Cleanup video element */
        if (state.videoElement) {
            state.videoElement.pause()
            state.videoElement.src = ''
            state.videoElement.load()
        }
        
        /* Reset store state */
        store.setState({
            isPlaying: false,
            audioLoaded: false,
            videoLoaded: false,
            videoElement: null,
            audio: null,
            currentTime: 0,
        })
    })
}