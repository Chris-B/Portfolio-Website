'use client'

import { OverlayProps } from "@/app/world/types/world-types"
import MovementControls from "@/app/world/components/overlay/content/movement-controls"
import { ControlLegend } from "@/app/world/components/overlay/content/control-legend"
import QAOverlay from "@/app/world/components/overlay/content/q&a/q&a-overlay"
import MusicVideosOverlay from "@/app/world/components/overlay/content/music-videos/music-videos-overlay"
import { useTouchDetection } from "@/app/world/hooks/touch-detection"
import { useOverlayStore } from "@/app/world/stores/overlay-store"
import { useShallow } from "zustand/shallow"
import { useCanvas } from "@/app/world/hooks/canvas-context"

/**
 * The wrapper component for all overlays.
 * Updates the overlay based on the current scene.
 * Utilizes touch detection hook to determine if movement controls should be displayed.
 * 
 * @param {OverlayProps} currentScene The current scene.
 * @returns The overlay component.
 */
export default function Overlay({ currentScene }: OverlayProps) {

    const isTouchDevice = useTouchDetection()

    const [isControlsOpen] = useOverlayStore(useShallow((state) => [state.isControlsOpen]))

    const { isCanvasLoaded } = useCanvas()

    if (!isCanvasLoaded) return null

    return (
        <>
            {isTouchDevice && isControlsOpen && (
                <MovementControls />
            )}
            {!isTouchDevice && (
                <ControlLegend />
            )}
            {currentScene === 'room-Q&A' && (
                <QAOverlay isTouchDevice={isTouchDevice} />
            )}

            {currentScene === 'room-music-videos' && (
                <MusicVideosOverlay isTouchDevice={isTouchDevice} />
            )}
        </>
    )
}