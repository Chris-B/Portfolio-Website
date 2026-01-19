'use client'

import { useState, useCallback } from "react";
import { Environment, KeyboardControls } from "@react-three/drei";

import { Hallway } from '@/app/world/components/3d/rooms/hallway/hallway'
import { RoomQA } from '@/app/world/components/3d/rooms/q&a/room-q&a'
import { RoomMusicVideos } from '@/app/world/components/3d/rooms/music-videos/room-music-videos'

import { CanvasLoader } from '@/app/world/hooks/canvas-context'
import { SceneType } from "@/app/world/types/world-types";

import { Canvas } from '@react-three/fiber'

import Ecctrl from "ecctrl";
import Overlay from "@/app/world/components/overlay/overlay";
import { Physics } from "@react-three/rapier";
import CharacterModel from "@/app/world/components/3d/character/character-model";
import { DoorToScene, KeyboardControlsMap } from "@/app/world/tables/world-tables";

/**
 * World Scene Component
 * Core react three fiber component that contains all rooms and models.
 * Sets the base environment, physics, and controls.
 * Creates the canvas and mantains the context.
 * 
 * @returns World Scene Component.
 */
export default function WorldScene() {

    const [currentScene, setCurrentScene] = useState<SceneType>('hallway')
    const [physicsReady, setPhysicsReady] = useState(false)
    const [currentSpawnPosition, setCurrentSpawnPosition] = useState<[number, number, number]>([0, 1, 0])

    const handleSceneChange = useCallback((newScene: SceneType, newSpawnPosition: [number, number, number]) => {
        if (!physicsReady) return

        setPhysicsReady(false)
        setCurrentScene(newScene)
        setCurrentSpawnPosition(newSpawnPosition)

    }, [physicsReady])

    const handleDoorEnter = useCallback((doorId: string, newSpawnPosition: [number, number, number]) => {
        const targetScene = DoorToScene[doorId]
        if (targetScene) {
            handleSceneChange(targetScene, newSpawnPosition)
        }
    }, [handleSceneChange])

    return (
        <>
            <div
                className={`fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${!physicsReady ? 'opacity-100' : 'opacity-0'
                    }`}
            />
            <Overlay currentScene={currentScene} />
            <Canvas
                dpr={[1, 1.5]}
                gl={{
                    antialias: false,
                    powerPreference: 'high-performance',
                    alpha: false,
                    stencil: false,
                }}
                onCreated={({ gl }) => {
                }}>
                <CanvasLoader />
                <Environment files="/world/skybox/night-sky.hdr" environmentIntensity={0.6} background={true} backgroundIntensity={0.1} />
                <ambientLight intensity={0.4} />
                <Physics paused={!physicsReady}>

                    {/* Render current scene */}
                    {currentScene === 'hallway' && <Hallway onReady={() => setPhysicsReady(true)} onDoorEnter={handleDoorEnter} />}

                    {currentScene === 'room-Q&A' && <RoomQA onReady={() => setPhysicsReady(true)} onDoorEnter={handleDoorEnter} />}

                    {currentScene === 'room-music-videos' && <RoomMusicVideos onReady={() => setPhysicsReady(true)} onDoorEnter={handleDoorEnter} />}

                    {physicsReady && (
                        <KeyboardControls map={KeyboardControlsMap}>
                            <Ecctrl
                                position={currentSpawnPosition}
                                capsuleHalfHeight={0.5} capsuleRadius={0.3}
                                camInitDir={{ x: 0, y: currentScene === 'hallway' ? Math.PI / 2 : 0 }}
                                characterInitDir={currentScene === 'hallway' ? Math.PI / 2 : 0}
                                camInitDis={-2}
                                camMinDis={-2}
                                camFollowMult={15}
                                camLerpMult={25}
                            >
                                <CharacterModel />
                            </Ecctrl>
                        </KeyboardControls>
                    )}
                </Physics>
            </Canvas>
        </>
    )
}