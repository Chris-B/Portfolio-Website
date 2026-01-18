import { Audio } from 'three'
import { createStore, useStore, StoreApi } from 'zustand';

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

const musicVideoRegistry: Record<string, StoreApi<MusicVideoState>> = {}

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
      depthEffect: 2,
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

export function useMusicVideoStore<T>(id: string, selector: (state: MusicVideoState) => T): T {
  const store = getMusicVideoStoreInstance(id)
  return useStore(store, selector)
}

export function pauseAllMusicVideos() {
    Object.values(musicVideoRegistry).forEach(store => {
        store.setState({ isPlaying: false })
    })
}

export function cleanupAllMusicVideos() {
    Object.entries(musicVideoRegistry).forEach(([id, store]) => {
        const state = store.getState()
        
        // Stop and cleanup audio
        if (state.audio) {
            if (state.audio.isPlaying) state.audio.stop()
            state.audio.disconnect()
        }
        
        // Cleanup video element
        if (state.videoElement) {
            state.videoElement.pause()
            state.videoElement.src = ''
            state.videoElement.load()
        }
        
        // Reset store state
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