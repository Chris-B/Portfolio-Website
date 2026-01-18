'use client'

import { useEffect, useState, useMemo } from 'react'
import { Mesh } from 'three'
import { RigidBody, MeshCollider, useRapier } from '@react-three/rapier'
import { DoorProps } from '@/app/world/types/world-types'
import { Vector3 } from 'three'
import { MapProps } from '@/app/world/types/world-types'
import { DoorSensor } from '@/app/world/components/3d/additions/door-sensor'
import { VideoScreen, ImageScreen } from '@/app/world/components/3d/additions/media-screens'
import { ChrisAvatar } from '@/app/world/components/3d/rooms/q&a/avatar-component'
import DoorSign from '@/app/world/components/3d/additions/door-sign'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'

const door: DoorProps = {id: 'RoomA', name: 'Exit', position: new Vector3(0, 1.2, -6), rotation: 0, doorSignPosition: new Vector3(0, 2.632, -5.885)}

export function RoomQA({ onReady, onDoorEnter }: MapProps) {
    const { scene } = useCompressedGLTF('/world/rooms/room-a/RoomA-Compressed.glb')
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

    // Check when colliders are ready
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
            <RigidBody type="fixed" colliders={false}>
                <MeshCollider type="trimesh">
                    <primitive object={clonedScene} />
                </MeshCollider>
            </RigidBody>

            <ChrisAvatar />

            {door && <DoorSensor
                key={door.id}
                name={door.id}
                position={door.position.toArray()}
                onEnter={() => {
                    onDoorEnter?.(door.id, [0, 1.5, 0])
                }}
            />}

            {door && <DoorSign
                text="Exit"
                position={[door.doorSignPosition.x, door.doorSignPosition.y, door.doorSignPosition.z]}
                rotation={[0, door.rotation, 0]}
                scale={[0.44, 0.44, 0.44]}
            />}

            <VideoScreen
                url="/world/rooms/room-b/rally.mp4"
                position={[0.011432774364948273, 1.5062336921691895 + 0.73, 5.266734600067139 + 0.015]}
                rotation={[0, Math.PI, 0]}
                scale={[2.19, 1.18]}
            />

            <ImageScreen
                url="/world/rooms/room-a/laptop.jpg"
                position={[0.0085, 1.515, 2.199]}
                rotation={[0, 0, 0]}
                scale={[0.507, 0.32]}
            />
        </>
    )
}
