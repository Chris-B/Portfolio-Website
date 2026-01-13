import { create } from 'zustand'
import type * as THREE from "three"

export type VideoState = {
  videoLoaded: boolean
  audioLoaded: boolean
  isPlaying: boolean
  videoElement: HTMLVideoElement | null
  audio: THREE.Audio | null
  videoSrc: string | null
  audioBuffer: AudioBuffer | null
}

export type VideoActions = {
  setLoaded: (loaded: boolean) => void
  setAudioLoaded: (loaded: boolean) => void
  setIsPlaying: (playing: boolean) => void
  setVideoElement: (videoElement: HTMLVideoElement) => void
  setAudio: (audio: THREE.Audio | null) => void
  setVideoSrc: (videoSrc: string) => void
  setAudioBuffer: (audioBuffer: AudioBuffer) => void
}

export type VideoStore = VideoState & VideoActions

export const useVideoStore = create<VideoStore>((set) => ({
  isPlaying: false,
  audioLoaded: false,
  videoLoaded: false,
  videoElement: null,
  audio: null,
  videoSrc: null,
  audioBuffer: null,
  setIsPlaying: (playing) => set(() => ({ isPlaying: playing })),
  setLoaded: (loaded) => set(() => ({ videoLoaded: loaded })),
  setAudioLoaded: (loaded) => set(() => ({ audioLoaded: loaded })),
  setVideoElement: (element) => set(() => ({ videoElement: element })),
  setAudio: (audio) => set(() => ({ audio: audio })),
  setVideoSrc: (videoSrc) => set(() => ({ videoSrc: videoSrc })),
  setAudioBuffer: (audioBuffer) => set(() => ({ audioBuffer: audioBuffer })),
}))