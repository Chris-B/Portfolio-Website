'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"
import { useMusicVideoStore, getMusicVideoStoreInstance } from '@/app/world/stores/music-videos-store'
import { useShallow } from 'zustand/shallow'
import { useOverlayStore } from '@/app/world/stores/overlay-store'

/**
 * Video controls component for music videos.
 * Features:
 * - Play/Pause
 * - Timeline
 * - Depth Scale
 * - Volume
 * 
 * @returns The video controls component.
 */
export default function VideoControls({ref}: {ref: React.RefObject<HTMLDivElement | null>}) {
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

  if (!readyForControlMiddle || !readyForControlLeft || !readyForControlRight) 
    return (
      <div ref={ref} className="bg-background/80 backdrop-blur-md text-foreground p-4 border border-primary/30 rounded-2xl z-50 w-[90%] max-w-xs text-center pointer-events-auto">
        Loading Video Controls...
      </div>
    ) 

  return (
    <div ref={ref} className="bg-background/80 backdrop-blur-md text-foreground p-4 border border-primary/30 rounded-2xl z-50 w-[90%] max-w-xs pointer-events-auto">
      <div className="flex justify-center gap-2 mb-4">
        {["Left", "Middle", "Right"].map((videoId) => (
          <button
            key={videoId}
            onClick={() => setMusicVideoSelection(videoId)}
            className={`px-4 py-1.5 rounded-full text-xs transition-all ${
              musicVideoSelection === videoId ? "bg-primary text-background font-bold" : "bg-foreground/10 text-foreground/70 hover:bg-foreground/20 font-medium"
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
            className="h-12 w-12 rounded-full bg-primary hover:bg-primary/80 text-background"
            aria-label={getState(musicVideoSelection).isPlaying ? "Pause" : "Play"}
          >
            {getState(musicVideoSelection).isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-foreground/50">
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
          <div className="flex justify-between text-[10px] text-foreground/50">
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
          <div className="flex justify-between text-[10px] text-foreground/50">
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