'use client'

import { useEffect, useRef, useMemo, useState } from "react";
import { useAnimations } from "@react-three/drei";
import { useAvatarStore } from "@/app/world/stores/avatar-store";
import { type SkinnedMesh, type Object3D, LoopOnce } from "three";
import { useFrame } from "@react-three/fiber";
import { useShallow } from "zustand/shallow";
import { useCompressedGLTF } from "@/app/world/hooks/use-compressed-gltf";

type LipSyncJSON = {
  mouthCues: Array<{ start: number; end: number; value: string }>
}

const visemeTargets: Record<string, string> = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_aa",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

const ActionNames = ['SittingIdle', 'SitToStand', 'StandingIdleNew', 'StandToSit', 'avaturn_animation', 'SillyDancing'] as const

export function ChrisAvatar() {
  const { scene, nodes, animations } = useCompressedGLTF('/world/rooms/room-a/ChrisAvatar-Compressed.glb')
  const { actions, mixer } = useAnimations(animations, scene)

  const [response, ensureAudio] = useAvatarStore(useShallow(
    (state) => [state.response, state.ensureAudio]
  ))

  const headMesh = nodes.Head_Mesh002 as SkinnedMesh | undefined
  const teethMesh = nodes.Teeth_Mesh002 as SkinnedMesh | undefined

  const responseAudioRef = useRef<HTMLAudioElement | null>(null)
  const pausedByVisibilityRef = useRef(false)

  const [activeLipSync, setActiveLipSync] = useState<LipSyncJSON | null>(null)

  // Cleanup audio and state when component unmounts
  useEffect(() => {
    return () => {
      const audio = responseAudioRef.current
      if (audio) {
        audio.pause()
        audio.src = ""
        audio.load()
        responseAudioRef.current = null
      }

      setActiveLipSync(null)
      pausedByVisibilityRef.current = false

      if (useAvatarStore.getState().isSpeaking) useAvatarStore.getState().toggleSpeech(false)
      useAvatarStore.getState().setResponse(null)
    }
  }, [])

  // Handle response audio and lip sync data
  useEffect(() => {
    if (response?.status !== 'success') return
    if (!response.audio_url || !response.lip_sync_data) return

    const sharedAudio = ensureAudio()
    if (!sharedAudio) return

    const existing = responseAudioRef.current
    if (existing && existing.src === response.audio_url && !existing.ended) {
      setActiveLipSync(response.lip_sync_data as unknown as LipSyncJSON)
      return
    }

    if (responseAudioRef.current && responseAudioRef.current !== sharedAudio) {
      responseAudioRef.current.pause()
      responseAudioRef.current.src = ""
      responseAudioRef.current.load()
      responseAudioRef.current = null
    }

    setActiveLipSync(response.lip_sync_data as unknown as LipSyncJSON)

    const audio = sharedAudio
    audio.pause()
    audio.src = response.audio_url
    audio.crossOrigin = 'anonymous'
    audio.volume = 0.5
    audio.load()
    responseAudioRef.current = audio

    const onEnded = () => {
      const speaking = useAvatarStore.getState().isSpeaking
      if (speaking) useAvatarStore.getState().toggleSpeech(false)
      responseAudioRef.current = null
      useAvatarStore.getState().setResponse(null)
    }

    const onError = () => {
      const mediaError = audio.error
      console.error('Response audio element error', {
        code: mediaError?.code,
        message: (mediaError as any)?.message,
        src: audio.src,
        networkState: audio.networkState,
        readyState: audio.readyState,
      })
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    let retryHandler: (() => void) | null = null

    const markSpeaking = () => {
      const speaking = useAvatarStore.getState().isSpeaking
      if (!speaking) useAvatarStore.getState().toggleSpeech(true)
    }

    const retryOnNextGesture = () => {
      if (retryHandler) return

      retryHandler = () => {
        audio
          .play()
          .then(() => {
            markSpeaking()
          })
          .catch((error) => {
            const err = error as any
            console.error('Response audio play() retry failed', {
              name: err?.name,
              message: err?.message,
              code: err?.code,
              toString: String(error),
              src: audio.src,
              networkState: audio.networkState,
              readyState: audio.readyState,
              muted: audio.muted,
              volume: audio.volume,
            })
          })
      }

      window.addEventListener('touchend', retryHandler, { once: true })
      window.addEventListener('click', retryHandler, { once: true })
    }

    audio.load()

    audio
      .play()
      .then(() => {
        markSpeaking()
      })
      .catch((error) => {
        const err = error as any
        console.error('Response audio play() failed', {
          error,
          name: err?.name,
          message: err?.message,
          code: err?.code,
          toString: String(error),
          src: audio.src,
          networkState: audio.networkState,
          readyState: audio.readyState,
          muted: audio.muted,
          volume: audio.volume,
        })

        retryOnNextGesture()
      })

    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      if (retryHandler) {
        window.removeEventListener('touchend', retryHandler)
        window.removeEventListener('click', retryHandler)
        retryHandler = null
      }
      audio.pause()
      audio.src = ""
      audio.load()
    }
  }, [response])

  useFrame(() => {
    if (!headMesh?.morphTargetInfluences || !headMesh?.morphTargetDictionary) return
    if (!teethMesh?.morphTargetInfluences || !teethMesh?.morphTargetDictionary) return

    Object.values(visemeTargets).forEach((value) => {
      const headIndex = headMesh.morphTargetDictionary![value]
      const teethIndex = teethMesh.morphTargetDictionary![value]
      if (headIndex !== undefined) headMesh.morphTargetInfluences![headIndex] = 0
      if (teethIndex !== undefined) teethMesh.morphTargetInfluences![teethIndex] = 0
    })

    const activeAudio = responseAudioRef.current
    if (!activeAudio || !activeLipSync) return
    const currentAudioTime = activeAudio.currentTime
    for (const mouthCue of activeLipSync.mouthCues) {
      const visemeTarget = visemeTargets[mouthCue.value]!
      const headIndex = headMesh.morphTargetDictionary![visemeTarget]
      const teethIndex = teethMesh.morphTargetDictionary![visemeTarget]
      if (currentAudioTime >= mouthCue.start && currentAudioTime < mouthCue.end) {
        if (headIndex !== undefined) headMesh.morphTargetInfluences![headIndex] = 1
        if (teethIndex !== undefined) teethMesh.morphTargetInfluences![teethIndex] = 1
        break
      }
    }
  })

  useEffect(() => {

    mixer.stopAllAction()

    actions[ActionNames[4]]?.play()
    actions[ActionNames[0]]?.play()

  }, [actions, mixer])

  useFrame((state) => {
    headMesh?.lookAt(state.camera.position)
  })

  return (
    <primitive object={scene} position={[0, 0, 2.85]} rotation={[0, Math.PI, 0]} scale={[1.75, 1.75, 1.75]} />
  )
}