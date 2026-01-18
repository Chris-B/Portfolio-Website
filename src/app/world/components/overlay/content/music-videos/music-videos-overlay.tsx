'use client'

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useOverlayStore } from "@/app/world/stores/overlay-store"
import { useShallow } from "zustand/shallow"
import VideoControls from "@/app/world/components/overlay/content/music-videos/video-controls"
import { RoomOverlayProps } from "@/app/world/types/world-types"

/**
 * Music Video Overlay Component
 * Mobile friendly overlay for music video controls.
 * 
 * @param {RoomOverlayProps} - Props object for room overlays.
 * @returns The music video overlay component.
 */
export default function MusicVideoOverlay({isTouchDevice}: RoomOverlayProps) {

    const [musicVideoControlsOpen, toggleMusicVideoControls, toggleControls] = useOverlayStore(useShallow((state) => [state.isMusicVideoControlsOpen, state.toggleMusicVideoControls, state.toggleControls]))

    const videoControlsContainerRef = useRef<HTMLDivElement | null>(null)

    /* Mobile touch device support for music video controls. */
    useEffect(() => {
        if (!isTouchDevice) return
        if (!musicVideoControlsOpen) return

        const onPointerDown = (e: PointerEvent) => {
            const el = videoControlsContainerRef.current
            if (!el) return

            const target = e.target
            if (!(target instanceof Node)) return

            if (!el.contains(target)) {
                useOverlayStore.getState().toggleMusicVideoControls(false)
                useOverlayStore.getState().toggleControls(true)
            }
        }

        document.addEventListener('pointerdown', onPointerDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
        }
    }, [musicVideoControlsOpen])

    const handleMusicVideoControlsButton = () => {
        toggleMusicVideoControls(true)
        toggleControls(false)
    }

     if (!isTouchDevice) return <VideoControls />

    return (
        <>
            {musicVideoControlsOpen && (
                <div ref={videoControlsContainerRef}>
                    <VideoControls />
                </div>
            )}
            {!musicVideoControlsOpen && (
                <div className="fixed bottom-[19%] left-[5%] right-[5%] pointer-events-none z-50 p-4 flex justify-end">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-20 h-20 rounded-full bg-background/75 border-primary/30 border backdrop-blur-sm pointer-events-auto touch-none flex items-center justify-center text-foreground text-wrap font-bold transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] focus:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
                        onClick={() => handleMusicVideoControlsButton()}
                    >
                        Video<br />Controls
                    </Button>
                </div>
            )}
        </>
    )
}