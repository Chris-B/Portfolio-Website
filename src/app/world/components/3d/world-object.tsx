'use client'

import React, { useMemo, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from "three-stdlib";
import { type Object3D, Mesh, MeshStandardMaterial, type Material, type MeshPhysicalMaterial } from "three";
import { useFrame, useGraph } from "@react-three/fiber";

export function WorldObject(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/World.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as { nodes: Record<string, Object3D>, materials: Record<string, Material> }

  const { actions, mixer } = useAnimations(animations, clone)

  return (
    <group {...props} dispose={null}>
      <primitive 
        object={clone}
        /*onPointerOver={(e: any) => {
          e.stopPropagation()
          console.log('Hovered:', e.object.name)
        }}*/
      />
    </group>
  )
}

useGLTF.preload('/World.glb')