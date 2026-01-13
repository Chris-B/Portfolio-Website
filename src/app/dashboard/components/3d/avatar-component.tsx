'use client'

import React, { useEffect, useRef, useMemo, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { useAvatarStore } from "~/app/dashboard/stores/avatar-store";
import { type SkinnedMesh, type Object3D, LoopOnce } from "three";
import { useFrame, useGraph } from "@react-three/fiber";

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

export function ChrisAvatar(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/ChrisAvatar.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes } = useGraph(clone) as { nodes: Record<string, Object3D> }
  const { actions, mixer } = useAnimations(animations, clone)
  const { isSitting, isDancing, response } = useAvatarStore((state) => state)

  const [pageInitialized, setPageInitialized] = useState(false)

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

      const state = useAvatarStore.getState()
      if (state.isSpeaking) state.toggleSpeech()
      state.setResponse(null)
    }
  }, [])

  // Handle response audio and lip sync data
  useEffect(() => {
    if (response?.status !== 'success') return
    if (!response.audio_url || !response.lip_sync_data) return

    const existing = responseAudioRef.current
    if (existing && existing.src === response.audio_url && !existing.ended) {
      setActiveLipSync(response.lip_sync_data as unknown as LipSyncJSON)
      return
    }

    if (responseAudioRef.current) {
      responseAudioRef.current.pause()
      responseAudioRef.current.src = ""
      responseAudioRef.current.load()
      responseAudioRef.current = null
    }

    setActiveLipSync(response.lip_sync_data as unknown as LipSyncJSON)

    const audio = new Audio(response.audio_url)
    audio.preload = 'auto'
    responseAudioRef.current = audio

    const onEnded = () => {
      const speaking = useAvatarStore.getState().isSpeaking
      if (speaking) useAvatarStore.getState().toggleSpeech()
      responseAudioRef.current = null
      useAvatarStore.getState().setResponse(null)
    }
    audio.addEventListener('ended', onEnded)

    audio
      .play()
      .then(() => {
        const speaking = useAvatarStore.getState().isSpeaking
        if (!speaking) useAvatarStore.getState().toggleSpeech()
      })
      .catch(() => {
        console.log('Response Audio Error')
      })

    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      audio.src = ""
      audio.load()
      if (responseAudioRef.current === audio) {
        responseAudioRef.current = null
      }
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

    const idleSit = () => {
      actions[ActionNames[0]]?.play()
    }
    const idleStand = () => {
      actions[ActionNames[2]]?.play()
    }

    mixer.stopAllAction()

    actions[ActionNames[4]]?.play()

    if (!pageInitialized) { // Set avatar to correct idle state and skip standing up or sitting down action.
      if(isSitting) idleSit(); else idleStand();
      setPageInitialized(true)
      return
    }

    const nextAction = actions[ActionNames[isSitting ? 3 : 1]] // Sit down or stand up action
    if (nextAction) {
      nextAction.clampWhenFinished = true
      nextAction.reset().setLoop(LoopOnce, 1).play()
      mixer.addEventListener('finished', isSitting ? idleSit : idleStand)
    }

    return () => {
      mixer.removeEventListener('finished', idleSit)
      mixer.removeEventListener('finished', idleStand)
    }

  }, [isSitting, actions, mixer])

  useEffect(() => { // Dancing Animation
    mixer.stopAllAction()
    actions[ActionNames[4]]?.play()
    actions[ActionNames[isDancing ? 5 : isSitting ? 0 : 2]]?.play()
  }, [isDancing, actions, mixer])

  useFrame((state) => {
    headMesh?.lookAt(state.camera.position)
  })

  return (
    <group {...props} dispose={null}>
      <primitive object={clone} position={[0, 0, -0.04]} />
    </group>
  )
}

useGLTF.preload('/ChrisAvatar.glb')