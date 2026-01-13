'use client'

import React, { useMemo, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { SkeletonUtils } from "three-stdlib";
import { type Object3D, Mesh, MeshStandardMaterial, type Material, type MeshPhysicalMaterial } from "three";
import { useFrame, useGraph } from "@react-three/fiber";

import { useAvatarStore } from "~/app/dashboard/stores/avatar-store"

export function Office(props: JSX.IntrinsicElements['group']) {
  const { scene, animations } = useGLTF('/Office.glb')
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as { nodes: Record<string, Object3D>, materials: Record<string, Material> }

  const { actions, mixer } = useAnimations(animations, clone)
  const { isDancing } = useAvatarStore((state) => state)

  useEffect(() => {
    const detailsMaterial = materials.details as MeshPhysicalMaterial | undefined
    const bookcaseMaterial = materials.bookcase as MeshPhysicalMaterial | undefined

    if (detailsMaterial?.metalness) {
      detailsMaterial.metalness = 1
    }
    if (bookcaseMaterial?.metalness) {
      bookcaseMaterial.metalness = 1
    }
  }, [materials])

  useEffect(() => {
    const chairBase = nodes.chair_furniture_0 as Mesh | undefined
    const chairBack = nodes.Cube053_furniture_0 as Mesh | undefined
    
    if (chairBase?.position) {
      chairBase.position.set(-0.1, -0.52, -0.03)
    }
    
    if (chairBack?.position) {
      chairBack.position.set(-0.1, -0.52, -0.13)
      chairBack.rotation.set(0, 0, Math.PI / 7.5)
    }

  }, [nodes])

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

useGLTF.preload('/Office.glb')