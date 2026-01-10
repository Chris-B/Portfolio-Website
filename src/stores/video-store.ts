'use client'

import { createStore } from 'zustand/vanilla'

import * as THREE from "three";

export type VideoState = {
  videoLoaded: boolean,
  audioLoaded: boolean,
  isPlaying: boolean,
  videoElement: HTMLVideoElement | null,
  audio: THREE.Audio | null,
  videoSrc: string | null,
  audioBuffer: AudioBuffer | null,
}

export type VideoActions = {
  setLoaded: (loaded: boolean) => void,
  setAudioLoaded: (loaded: boolean) => void,
  setIsPlaying: (playing: boolean) => void,
  setVideoElement: (videoElement: HTMLVideoElement) => void,
  setAudio: (audio: THREE.Audio) => void,
  setVideoSrc: (videoSrc: string) => void,
  setAudioBuffer: (audioBuffer: AudioBuffer) => void,
}

export type VideoStore = VideoState & VideoActions

export const defaultInitState: VideoState = {
  isPlaying: false,
  audioLoaded: false,
  videoLoaded: false,
  videoElement: null,
  audio: null,
  videoSrc: null,
  audioBuffer: null
}

export const createVideoStore = (
  initState: VideoState = defaultInitState,
) => {
  return createStore<VideoStore>()((set) => ({
          ...initState,
          setIsPlaying: (playing) => set(() => ({ isPlaying: playing })),
          setLoaded: (loaded ) => set(() => ({ videoLoaded: loaded })),
          setAudioLoaded: (loaded ) => set(() => ({ audioLoaded: loaded })),
          setVideoElement: (element: HTMLVideoElement ) => set(() => ({ videoElement: element })),
          setAudio: (audio: THREE.Audio ) => set(() => ({ audio: audio })),
          setVideoSrc: (videoSrc: string) => set(() => ({ videoSrc: videoSrc })),
          setAudioBuffer: (audioBuffer: AudioBuffer) => set(() => ({ audioBuffer: audioBuffer })),
  }))
}