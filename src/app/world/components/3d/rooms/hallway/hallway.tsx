'use client'

import { useEffect, useState, useMemo } from 'react'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'
import { PointLight, Mesh } from 'three'
import { DoorSensor } from '@/app/world/components/3d/additions/door-sensor'
import { RigidBody, MeshCollider, useRapier } from '@react-three/rapier'
import { Vector3 } from 'three'
import { MapProps, type DoorProps } from '@/app/world/types/world-types'
import DoorSign from '@/app/world/components/3d/additions/door-sign'

const doors: DoorProps[] = [
  {id: 'A', name: 'Chris Q&A', position: new Vector3(2, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(2, 2.632, -1.895)},
  {id: 'B', name: '3D Fun Zone', position: new Vector3(10, 1.2, 2), rotation: Math.PI, doorSignPosition: new Vector3(10, 2.632, 1.895)},
  {id: 'C', name: 'Coming Soon', position: new Vector3(18, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(18, 2.632, -1.895)},
  {id: 'D', name: 'Coming Soon', position: new Vector3(26, 1.2, 2), rotation: Math.PI, doorSignPosition: new Vector3(26, 2.632, 1.895)},
  {id: 'E', name: 'Coming Soon', position: new Vector3(34, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(34, 2.632, -1.895)},
  {id: 'F', name: 'Coming Soon', position: new Vector3(42, 1.2, 2), rotation: Math.PI, doorSignPosition: new Vector3(42, 2.632, 1.895)},
  {id: 'G', name: 'Coming Soon', position: new Vector3(50, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(50, 2.632, -1.895)},
  {id: 'H', name: 'Coming Soon', position: new Vector3(60, 1.2, 0), rotation: - Math.PI / 2, doorSignPosition: new Vector3(60, 2.632, 0)},
]

export function Hallway({ onReady, onDoorEnter }: MapProps) {
  const { scene } = useCompressedGLTF('/world/Hallway-compressed.glb')
  const { world } = useRapier()

  const [collidersReady, setCollidersReady] = useState(false)

  // Clone scene to prevent reuse issues on mobile Safari
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    // Clone materials to prevent shared material issues with Environment component
    clone.traverse((child) => {
      if (child instanceof Mesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material]
        const clonedMats = mats.map((mat) => {
          const cloned = mat.clone()
          cloned.name = mat.name
          return cloned
        })
        child.material = clonedMats.length === 1 ? clonedMats[0] : clonedMats
      }
    })
    return clone
  }, [scene])

  // Check when colliders are actually ready in the physics world
  useEffect(() => {
    if (collidersReady) return
    
    let attempts = 0
    const maxAttempts = 300 // ~5 seconds at 60fps
    
    const checkColliders = () => {
      attempts++
      const numColliders = world.colliders.len()
      if (numColliders > 0) {
        setCollidersReady(true)
        onReady?.()
      } else if (attempts < maxAttempts) {
        requestAnimationFrame(checkColliders)
      } else {
        // Timeout - proceed anyway to prevent black screen
        console.warn('Collider check timed out, proceeding anyway')
        setCollidersReady(true)
        onReady?.()
      }
    }
    
    requestAnimationFrame(checkColliders)
  }, [world, collidersReady, onReady])

  return (
    <>
      <RigidBody type="fixed" colliders={false} ccd>
        <MeshCollider type="trimesh">
          <primitive object={clonedScene} />
        </MeshCollider>
      </RigidBody>
      {doors.filter((door) => door.name !== 'Coming Soon').map((door) => (
        <DoorSensor 
          key={door.id}
          name={door.id}
          position={door.position.toArray()}
          onEnter={() => {
            onDoorEnter?.(door.id)
          }}
        />
      ))}
      {doors.map((door, index) => (
        <DoorSign
          key={index}
          text={door.name}
          position={[door.doorSignPosition.x, door.doorSignPosition.y, door.doorSignPosition.z]}
          rotation={[0, door.rotation, 0]}
          scale={[0.44, 0.44, 0.44]}
        />
      ))}
    </>
  )
}