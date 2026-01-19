'use client'

import { useEffect, useState, useMemo } from 'react'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'
import { Mesh } from 'three'
import { RigidBody, MeshCollider, useRapier } from '@react-three/rapier'
import { SceneProps } from '@/app/world/types/world-types'
import { DoorSensor } from '@/app/world/components/3d/additions/door-sensor'
import { VideoScreenMesh3D } from '@/app/world/components/3d/additions/media-screens'
import DoorSign from '@/app/world/components/3d/additions/door-sign'
import { pauseAllMusicVideos, cleanupAllMusicVideos } from '@/app/world/stores/music-videos-store'
import { MusicVideoRoomDoor } from '@/app/world/tables/world-tables'

/**
 * Music Video Room Model/Component
 * 
 * @param {SceneProps} onReady - Callback function to be called when the room is ready
 * @param {SceneProps} onDoorEnter - Callback function to be called when the door is entered
 * 
 * @returns {JSX.Element} - The model primitive and 3D video screens <VideoScreenMesh3D />
 */
export function RoomMusicVideos({ onReady, onDoorEnter }: SceneProps) {
    const { scene } = useCompressedGLTF('/world/rooms/room-b/RoomB-Compressed.glb')
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
        return () => {
            cleanupAllMusicVideos()
        }
    }, [])

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

            {MusicVideoRoomDoor && <DoorSensor
                key={MusicVideoRoomDoor.id}
                name={MusicVideoRoomDoor.id}
                position={MusicVideoRoomDoor.position.toArray()}
                onEnter={() => {
                    pauseAllMusicVideos()
                    onDoorEnter?.(MusicVideoRoomDoor.id, [10, 1.5, 0])
                }}
            />}

            {MusicVideoRoomDoor && <DoorSign
                text="Exit"
                position={[MusicVideoRoomDoor.doorSignPosition.x, MusicVideoRoomDoor.doorSignPosition.y, MusicVideoRoomDoor.doorSignPosition.z]}
                rotation={[0, MusicVideoRoomDoor.rotation, 0]}
                scale={[0.44, 0.44, 0.44]}
            />}

            <VideoScreenMesh3D  
                id="Middle"
                url="/world/rooms/room-b/feel-good.mp4"
                poster="/world/rooms/room-b/feel-good-poster.jpg"
                position={[0.00, 1.823, 5.1]}
                rotation={[0, Math.PI, 0]}
                scale={[5.475, 2.95]}
            />

            <VideoScreenMesh3D  
                id="Right"
                url="/world/rooms/room-b/electric-feel.mp4"
                poster="/world/rooms/room-b/electric-feel-poster.jpg"
                position={[-5.1, 1.823, 0]}
                rotation={[0, Math.PI / 2, 0]}
                scale={[5.475, 2.95]}
            />

            <VideoScreenMesh3D  
                id="Left"
                url="/world/rooms/room-b/rally.mp4"
                poster="/world/rooms/room-b/rally-poster.jpg"
                position={[5.1, 1.823, 0]}
                rotation={[0, - Math.PI / 2, 0]}
                scale={[5.475, 2.95]}
            />

        </>
    )
}
