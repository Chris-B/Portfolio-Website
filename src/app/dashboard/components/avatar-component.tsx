'use client'

import React, { useEffect, useRef, useMemo, useState } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { type GLTF } from 'three-stdlib'
import { useAvatarStore } from "~/providers/avatar-store-provider";
import {
  type SkinnedMesh,
  type Bone,
  type MeshStandardMaterial,
  type Group,
  LoopOnce,
  FileLoader,
  MathUtils,
} from "three";
import { useFrame, useLoader } from "@react-three/fiber";

type lipSyncJSON = {
  mouthCues: [
    {start: number, end: number, value: string}
  ]
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


type GLTFResult = GLTF & {
  nodes: {
    avaturn_hair_0: SkinnedMesh
    avaturn_hair_1: SkinnedMesh
    avaturn_look_0: SkinnedMesh
    avaturn_shoes_0: SkinnedMesh
    Body_Mesh: SkinnedMesh
    Eye_Mesh002: SkinnedMesh
    EyeAO_Mesh002: SkinnedMesh
    Eyelash_Mesh002: SkinnedMesh
    Head_Mesh002: SkinnedMesh
    Teeth_Mesh002: SkinnedMesh
    Tongue_Mesh002: SkinnedMesh
    Hips: Bone
  }
  materials: {
    ['avaturn_hair_0_material.001']: MeshStandardMaterial
    ['avaturn_hair_1_material.001']: MeshStandardMaterial
    ['avaturn_look_0_material.001']: MeshStandardMaterial
    ['avaturn_shoes_0_material.001']: MeshStandardMaterial
    ['Body.001']: MeshStandardMaterial
    ['Eyes.001']: MeshStandardMaterial
    ['EyeAO.001']: MeshStandardMaterial
    ['Eyelash.001']: MeshStandardMaterial
    ['Head.001']: MeshStandardMaterial
    ['Teeth.002']: MeshStandardMaterial
    ['Teeth.003']: MeshStandardMaterial
  }
}

const ActionNames = ['SittingIdle','SitToStand','StandingIdleNew','StandToSit', 'avaturn_animation', 'SillyDancing'] as const

export function ChrisAvatar(props: JSX.IntrinsicElements['group']) {
  const group = useRef<Group>(null)
  const { nodes, materials, animations } = useGLTF('/ChrisAvatar.glb', true) as GLTFResult
  const { actions, mixer } = useAnimations(animations, group)
  const { isSitting, isSpeaking, stopSpeaking, isDancing } = useAvatarStore((state) => state)

  const [pageInitialized, setPageInitialized] = useState(false)

  const memoizedMeshes = useMemo(() => (
    <>
      <skinnedMesh
            name="avaturn_hair_0"
            geometry={nodes.avaturn_hair_0.geometry}
            material={materials['avaturn_hair_0_material.001']}
            skeleton={nodes.avaturn_hair_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_hair_1"
            geometry={nodes.avaturn_hair_1.geometry}
            material={materials['avaturn_hair_1_material.001']}
            skeleton={nodes.avaturn_hair_1.skeleton}
          />
          <skinnedMesh
            name="avaturn_look_0"
            geometry={nodes.avaturn_look_0.geometry}
            material={materials['avaturn_look_0_material.001']}
            skeleton={nodes.avaturn_look_0.skeleton}
          />
          <skinnedMesh
            name="avaturn_shoes_0"
            geometry={nodes.avaturn_shoes_0.geometry}
            material={materials['avaturn_shoes_0_material.001']}
            skeleton={nodes.avaturn_shoes_0.skeleton}
          />
          <skinnedMesh
            name="Body_Mesh"
            geometry={nodes.Body_Mesh.geometry}
            material={materials['Body.001']}
            skeleton={nodes.Body_Mesh.skeleton}
          />
          <group name="Eye_Mesh" />
          <group name="Eye_Mesh001" />
          <skinnedMesh
            name="Eye_Mesh002"
            geometry={nodes.Eye_Mesh002.geometry}
            material={materials['Eyes.001']}
            skeleton={nodes.Eye_Mesh002.skeleton}
            morphTargetDictionary={nodes.Eye_Mesh002.morphTargetDictionary}
            morphTargetInfluences={nodes.Eye_Mesh002.morphTargetInfluences}
          />
          <group name="EyeAO_Mesh" />
          <group name="EyeAO_Mesh001" />
          <skinnedMesh
            name="EyeAO_Mesh002"
            geometry={nodes.EyeAO_Mesh002.geometry}
            material={materials['EyeAO.001']}
            skeleton={nodes.EyeAO_Mesh002.skeleton}
            morphTargetDictionary={nodes.EyeAO_Mesh002.morphTargetDictionary}
            morphTargetInfluences={nodes.EyeAO_Mesh002.morphTargetInfluences}
          />
          <group name="Eyelash_Mesh" />
          <group name="Eyelash_Mesh001" />
          <skinnedMesh
            name="Eyelash_Mesh002"
            geometry={nodes.Eyelash_Mesh002.geometry}
            material={materials['Eyelash.001']}
            skeleton={nodes.Eyelash_Mesh002.skeleton}
            morphTargetDictionary={nodes.Eyelash_Mesh002.morphTargetDictionary}
            morphTargetInfluences={nodes.Eyelash_Mesh002.morphTargetInfluences}
          />
          <group name="Head_Mesh" />
          <group name="Head_Mesh001" />
          <skinnedMesh
            name="Head_Mesh002"
            geometry={nodes.Head_Mesh002.geometry}
            material={materials['Head.001']}
            skeleton={nodes.Head_Mesh002.skeleton}
            morphTargetDictionary={nodes.Head_Mesh002.morphTargetDictionary}
            morphTargetInfluences={nodes.Head_Mesh002.morphTargetInfluences}
          />
          <group name="Teeth_Mesh" />
          <group name="Teeth_Mesh001" />
          <skinnedMesh
            name="Teeth_Mesh002"
            geometry={nodes.Teeth_Mesh002.geometry}
            material={materials['Teeth.002']}
            skeleton={nodes.Teeth_Mesh002.skeleton}
            morphTargetDictionary={nodes.Teeth_Mesh002.morphTargetDictionary}
            morphTargetInfluences={nodes.Teeth_Mesh002.morphTargetInfluences}
          />
          <group name="Tongue_Mesh" />
          <group name="Tongue_Mesh001" />
          <skinnedMesh
            name="Tongue_Mesh002"
            geometry={nodes.Tongue_Mesh002.geometry}
            material={materials['Teeth.003']}
            skeleton={nodes.Tongue_Mesh002.skeleton}
            morphTargetDictionary={nodes.Tongue_Mesh002.morphTargetDictionary}
            morphTargetInfluences={nodes.Tongue_Mesh002.morphTargetInfluences}
          />
    </>
  ), [nodes, materials])

  const [welcomeAudio] = useState(new Audio('/audio/Portfolio Introduction.mp3'))

  const welcomeAudioJSON: string = useLoader(FileLoader, '/audio/Portfolio Introduction.json')

  const [welcomeLipSync] = useState<lipSyncJSON>(JSON.parse(welcomeAudioJSON) as lipSyncJSON)


  useFrame(() => {

    Object.values(visemeTargets).forEach((value) => {
      if(nodes.Head_Mesh002.morphTargetInfluences && nodes.Head_Mesh002.morphTargetDictionary && nodes.Teeth_Mesh002.morphTargetInfluences && nodes.Teeth_Mesh002.morphTargetDictionary) {
        const headIndex = nodes.Head_Mesh002.morphTargetDictionary[value]
        const teethIndex = nodes.Teeth_Mesh002.morphTargetDictionary[value]
        nodes.Head_Mesh002.morphTargetInfluences[headIndex!] = 0
        nodes.Teeth_Mesh002.morphTargetInfluences[teethIndex!] = 0
      }
    })

    const currentAudioTime = welcomeAudio.currentTime
    for (const mouthCue of welcomeLipSync.mouthCues) {
      const mouthCueValue = mouthCue.value
      const visemeTarget = visemeTargets[mouthCueValue]!
      if(nodes.Head_Mesh002.morphTargetInfluences && nodes.Head_Mesh002.morphTargetDictionary && nodes.Teeth_Mesh002.morphTargetInfluences && nodes.Teeth_Mesh002.morphTargetDictionary) {
        const headIndex = nodes.Head_Mesh002.morphTargetDictionary[visemeTarget]!
        const teethIndex = nodes.Teeth_Mesh002.morphTargetDictionary[visemeTarget]!
        if (currentAudioTime >= mouthCue.start && currentAudioTime < mouthCue.end) {
          nodes.Head_Mesh002.morphTargetInfluences[headIndex] = 1
          nodes.Teeth_Mesh002.morphTargetInfluences[teethIndex] = 1
          break;
        }
      }
    }
  })

  useEffect(() => {
    if (isSpeaking) {
      welcomeAudio.play().finally(() => {stopSpeaking()}).catch(() => {console.log('Welcome Audio Error')})
    }
  }, [isSpeaking])

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
     group.current!.getObjectByName("Head_Mesh002")!.lookAt(state.camera.position);
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" position={[0, 0, -0.04]}>
          {memoizedMeshes}
          <primitive object={nodes.Hips} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/ChrisAvatar.glb')