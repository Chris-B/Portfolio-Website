'use client'

import { useEffect, useState, useMemo } from 'react'
import { Mesh } from 'three'
import { RigidBody, MeshCollider, useRapier } from '@react-three/rapier'
import { SceneProps } from '@/app/world/types/world-types'
import { DoorSensor } from '@/app/world/components/3d/additions/door-sensor'
import { VideoScreen, ImageScreen } from '@/app/world/components/3d/additions/media-screens'
import { ChrisAvatar } from '@/app/world/components/3d/rooms/q&a/avatar-component'
import DoorSign from '@/app/world/components/3d/additions/door-sign'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'
import { TargetedDirectionalLight } from '@/app/world/components/3d/additions/targeted-directional-light'
import { QAndARoomDoor } from '@/app/world/tables/world-tables'

/**
 * Q&A Room Model/Component
 * 
 * @param {SceneProps} onReady - Callback function to be called when the room is ready
 * @param {SceneProps} onDoorEnter - Callback function to be called when the door is entered
 * 
 * @returns Q&A Room Model/Component with 2D tv video and laptop image.
 */
export function RoomQA({ onReady, onDoorEnter }: SceneProps) {
    const { scene } = useCompressedGLTF('/world/rooms/room-a/RoomA-Compressed.glb')
    const { world } = useRapier()
    const [collidersReady, setCollidersReady] = useState(false)

    const clonedScene = useMemo(() => {
        const clone = scene.clone(true)
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

    useEffect(() => {
        if (collidersReady) return

        let attempts = 0
        const maxAttempts = 300

        const checkColliders = () => {
            attempts++
            const numColliders = world.colliders.len()
            if (numColliders > 0) {
                setCollidersReady(true)
                onReady?.()
            } else if (attempts < maxAttempts) {
                requestAnimationFrame(checkColliders)
            } else {
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

            <TargetedDirectionalLight position={[0, 4, 0]} target={[0, 0, 5.5]} intensity={0.5} />
                                        
            <ambientLight intensity={0.4} />

            {QAndARoomDoor && <DoorSensor
                key={QAndARoomDoor.id}
                name={QAndARoomDoor.id}
                position={QAndARoomDoor.position.toArray()}
                onEnter={() => {
                    onDoorEnter?.(QAndARoomDoor.id, [0, 1.5, 0])
                }}
            />}

            {QAndARoomDoor && <DoorSign
                text="Exit"
                position={[QAndARoomDoor.doorSignPosition.x, QAndARoomDoor.doorSignPosition.y, QAndARoomDoor.doorSignPosition.z]}
                rotation={[0, QAndARoomDoor.rotation, 0]}
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
