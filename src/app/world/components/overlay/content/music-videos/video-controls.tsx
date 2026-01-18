'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"
import { useMusicVideoStore, getMusicVideoStoreInstance } from '@/app/world/stores/music-videos-store'
import { useShallow } from 'zustand/shallow'
import { useOverlayStore } from '@/app/world/stores/overlay-store'

export default function VideoControls() {
  const [musicVideoSelection, setMusicVideoSelection] = useOverlayStore(useShallow((state) => [state.musicVideoSelection, state.setMusicVideoSelection] as const))

  // Use hooks at top level for reactive state
  const [isPlayingMiddle, videoElementMiddle, depthEffectMiddle, currentTimeMiddle, volumeMiddle, readyForControlMiddle] = useMusicVideoStore("Middle", useShallow((state) => [state.isPlaying, state.videoElement, state.depthEffect, state.currentTime, state.volume, state.readyForControl] as const))
  const [isPlayingLeft, videoElementLeft, depthEffectLeft, currentTimeLeft, volumeLeft, readyForControlLeft] = useMusicVideoStore("Left", useShallow((state) => [state.isPlaying, state.videoElement, state.depthEffect, state.currentTime, state.volume, state.readyForControl] as const))
  const [isPlayingRight, videoElementRight, depthEffectRight, currentTimeRight, volumeRight, readyForControlRight] = useMusicVideoStore("Right", useShallow((state) => [state.isPlaying, state.videoElement, state.depthEffect, state.currentTime, state.volume, state.readyForControl] as const))

  const stateMap = {
    Middle: { isPlaying: isPlayingMiddle, videoElement: videoElementMiddle, depthEffect: depthEffectMiddle, currentTime: currentTimeMiddle, volume: volumeMiddle, readyForControl: readyForControlMiddle },
    Left: { isPlaying: isPlayingLeft, videoElement: videoElementLeft, depthEffect: depthEffectLeft, currentTime: currentTimeLeft, volume: volumeLeft, readyForControl: readyForControlLeft },
    Right: { isPlaying: isPlayingRight, videoElement: videoElementRight, depthEffect: depthEffectRight, currentTime: currentTimeRight, volume: volumeRight, readyForControl: readyForControlRight },
  }

  const togglePlay = (id: string) => {
    const store = getMusicVideoStoreInstance(id)
    const state = store.getState()
    if (!state.isPlaying) {
      store.getState().setIsPlaying(true)
      if (state.audio) {
        state.audio.play()
        state.audio.pause()
      }
    } else {
      store.getState().setIsPlaying(false)
    }
  }

  const updateCurrentTime = (id: string, time: number[]) => {
    const value = time[0]
    if (value === undefined || value < 0) return
    const store = getMusicVideoStoreInstance(id)
    store.getState().setCurrentTime(value)
  }

  const updateDepthEffect = (id: string, depth: number[]) => {
    const value = depth[0]
    if (value === undefined) return
    const store = getMusicVideoStoreInstance(id)
    store.getState().setDepthEffect(value)
  }

  const updateVolume = (id: string, volume: number[]) => {
    const value = volume[0]
    if (value === undefined) return
    const store = getMusicVideoStoreInstance(id)
    store.getState().setVolume(value)
  }

  const getState = (id: string) => stateMap[id as keyof typeof stateMap]

  // Show loading state if videos aren't ready yet
  if (!readyForControlMiddle || !readyForControlLeft || !readyForControlRight) return null

  return (
    <div className="fixed bottom-[7%] left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md text-white p-4 border border-cyan-500/30 rounded-2xl z-50 w-[90%] max-w-xs">
      <div className="flex justify-center gap-2 mb-4">
        {["Left", "Middle", "Right"].map((videoId) => (
          <button
            key={videoId}
            onClick={() => setMusicVideoSelection(videoId)}
            className={`px-4 py-1.5 rounded-full text-xs transition-all ${
              musicVideoSelection === videoId ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-white/70 hover:bg-white/20 font-medium"
            }`}
          >
            {videoId}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {/* Play/Pause Button */}
        <div className="flex justify-center">
          <Button
            size="icon"
            onClick={() => togglePlay(musicVideoSelection)}
            className="h-12 w-12 rounded-full bg-cyan-500 hover:bg-cyan-400 text-black"
            aria-label={getState(musicVideoSelection).isPlaying ? "Pause" : "Play"}
          >
            {getState(musicVideoSelection).isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/50">
            <span>Timeline</span>
            <span>{Math.round(getState(musicVideoSelection).currentTime)}s</span>
          </div>
          <Slider
            value={[getState(musicVideoSelection).currentTime]}
            onValueChange={(value: number[]) => updateCurrentTime(musicVideoSelection, value)}
            max={getState(musicVideoSelection).videoElement?.duration ?? 100}
            step={0.5}
            className="w-full"
            aria-label="Timeline"
          />
        </div>

        {/* Depth Scale Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/50">
            <span>Depth Scale</span>
            <span>{getState(musicVideoSelection).depthEffect}</span>
          </div>
          <Slider
            value={[getState(musicVideoSelection).depthEffect]}
            onValueChange={(value: number[]) => updateDepthEffect(musicVideoSelection, value)}
            min={1}
            max={5}
            step={1}
            className="w-full"
            aria-label="Depth scale"
          />
        </div>

        {/* Volume Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-white/50">
            <span>Volume</span>
            <span>{getState(musicVideoSelection).volume}</span>
          </div>
          <Slider
            value={[getState(musicVideoSelection).volume]}
            onValueChange={(value: number[]) => updateVolume(musicVideoSelection, value)}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  )
}