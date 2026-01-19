'use client'

import { useEffect, useState, useMemo } from 'react'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'
import { Mesh } from 'three'
import { DoorSensor } from '@/app/world/components/3d/additions/door-sensor'
import { RigidBody, MeshCollider, useRapier } from '@react-three/rapier'
import { SceneProps } from '@/app/world/types/world-types'
import DoorSign from '@/app/world/components/3d/additions/door-sign'
import { HallwayDoors } from '@/app/world/tables/world-tables'

/**
 * Hallway component for the scene. Connects all rooms in the scene.
 * 
 * @param {SceneProps} onReady - Callback function to be called when the room is ready
 * @param {SceneProps} onDoorEnter - Callback function to be called when the door is entered
 * 
 * @returns Hallway component with trimesh colliders configured.
 */
export function Hallway({ onReady, onDoorEnter }: SceneProps) {
  const { scene } = useCompressedGLTF('/world/Hallway-Compressed.glb')
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
      {HallwayDoors.filter((door) => door.name !== 'Coming Soon').map((door) => (
        <DoorSensor 
          key={door.id}
          name={door.id}
          position={door.position.toArray()}
          onEnter={() => {
            onDoorEnter?.(door.id, [0, 1.5, -3])
          }}
        />
      ))}
      {HallwayDoors.map((door, index) => (
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