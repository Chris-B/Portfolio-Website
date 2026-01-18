'use client'

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import AvatarChat from "@/app/world/components/overlay/content/q&a/avatar-chat"
import { useOverlayStore } from "@/app/world/stores/overlay-store"
import { useShallow } from "zustand/shallow"

export default function QAOverlay({isTouchDevice}: {isTouchDevice: boolean}) {

    const [isChatOpen, toggleChatBox, toggleControls] = useOverlayStore(useShallow((state) => [state.isAvatarChatOpen, state.toggleAvatarChat, state.toggleControls]))

    const chatContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!isTouchDevice) return
        if (!isChatOpen) return

        const onPointerDown = (e: PointerEvent) => {
            const el = chatContainerRef.current
            if (!el) return

            const target = e.target
            if (!(target instanceof Node)) return

            if (!el.contains(target)) {
                useOverlayStore.getState().toggleAvatarChat(false)
                useOverlayStore.getState().toggleControls(true)
            }
        }

        document.addEventListener('pointerdown', onPointerDown)
        return () => {
            document.removeEventListener('pointerdown', onPointerDown)
        }
    }, [isChatOpen])

    const handleChatButton = () => {
        toggleChatBox(true)
        toggleControls(false)
    }

    if (!isTouchDevice) return <AvatarChat />

    return (
        <>
            {isChatOpen && (
                <div ref={chatContainerRef}>
                    <AvatarChat />
                </div>
            )}
            {!isChatOpen && (
                <div className="fixed bottom-[19%] left-[5%] right-[5%] pointer-events-none z-50 p-4 flex justify-end">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-20 h-20 rounded-full bg-black/75 border-cyan-500/30 border backdrop-blur-sm pointer-events-auto touch-none flex items-center justify-center text-white text-wrap font-bold transition-all duration-300 ease-in-out hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] focus:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
                        onClick={() => handleChatButton()}
                    >
                        Chat<br />With Me
                    </Button>
                </div>
            )}
        </>
    )
}