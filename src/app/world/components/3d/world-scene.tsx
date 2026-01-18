'use client'

import { useEffect, useState, useCallback, useRef } from "react";
import { Environment, KeyboardControls } from "@react-three/drei";

import { Hallway } from '@/app/world/components/3d/rooms/hallway/hallway'
import { RoomQA } from '@/app/world/components/3d/rooms/q&a/room-q&a'
import { RoomMusicVideos } from '@/app/world/components/3d/rooms/music-videos/room-music-videos'

import { useCanvas } from '@/context/canvas-context'

import { Canvas, useThree } from '@react-three/fiber'
import { Color, DirectionalLightHelper, DirectionalLight } from "three";

import Ecctrl from "ecctrl";
import Overlay from "@/app/world/components/overlay/overlay";
import { Physics } from "@react-three/rapier";
import CharacterModel from "@/app/world/components/3d/character/character-model";
import { SceneType } from "@/app/world/types/world-types";

const ROOM_SPAWN_POSITIONS: Record<SceneType, [number, number, number]> = {
    'hallway': [0, 1, 0],
    'room-Q&A': [0, 1, -3],
    'room-music-videos': [0, 1, -3],
    'roomC': [0, 1, -3],
    'roomD': [0, 1, -3],
    'roomE': [0, 1, -3],
    'roomF': [0, 1, -3],
    'roomG': [0, 1, -3],
    'roomH': [0, 1, -3],
}

// Debug component to visualize directional light
function TargetedDirectionalLight({ position, intensity, target = [0, 0, 0] }: { 
    position: [number, number, number], 
    intensity: number,
    target?: [number, number, number]
}) {
    const lightRef = useRef<DirectionalLight>(null!)
    //useHelper(lightRef, DirectionalLightHelper, 2, 'yellow')
    
    // Update target position
    useEffect(() => {
        if (lightRef.current) {
            lightRef.current.target.position.set(...target)
            lightRef.current.target.updateMatrixWorld()
        }
    }, [target])
    
    return (
        <directionalLight 
            ref={lightRef}
            position={position} 
            intensity={intensity} 
        />
    )
}

function CanvasLoader() {
    const { gl } = useThree()
    const { setCanvasLoaded } = useCanvas()

    useEffect(() => {
        const handleContextLost = (event: Event) => {
            if (event instanceof WebGLContextEvent) {
                event.preventDefault()
                console.error('WebGL context lost. Trying to restore...')
                setCanvasLoaded(false)
            }
        }

        const handleContextRestored = () => {
            console.error('WebGL context restored.')
            setCanvasLoaded(true)
        }

        gl.domElement.addEventListener('webglcontextlost', handleContextLost)
        gl.domElement.addEventListener('webglcontextrestored', handleContextRestored)

        // Initial load
        setCanvasLoaded(true)

        return () => {
            gl.domElement.removeEventListener('webglcontextlost', handleContextLost)
            gl.domElement.removeEventListener('webglcontextrestored', handleContextRestored)
        }
    }, [gl, setCanvasLoaded])

    return null
}

export default function WorldScene() {

    const [currentScene, setCurrentScene] = useState<SceneType>('hallway')
    const [physicsReady, setPhysicsReady] = useState(false)

    const handleSceneChange = useCallback((newScene: SceneType) => {
        if (!physicsReady) return

        setPhysicsReady(false) // Reset physics for new scene
        setCurrentScene(newScene)

    }, [physicsReady])

    // Map door IDs to scene types
    const handleDoorEnter = useCallback((doorId: string) => {
        const doorToScene: Record<string, SceneType> = {
            'A': 'room-Q&A',
            'B': 'room-music-videos',
            'C': 'roomC',
            'D': 'roomD',
            'E': 'roomE',
            'F': 'roomF',
            'G': 'roomG',
            'H': 'roomH',
            'RoomA': 'hallway',
            'RoomB': 'hallway'
        }
        const targetScene = doorToScene[doorId]
        if (targetScene) {
            handleSceneChange(targetScene)
        }
    }, [handleSceneChange])

    const keyboardMap = [
        { name: "forward", keys: ["ArrowUp", "KeyW"] },
        { name: "backward", keys: ["ArrowDown", "KeyS"] },
        { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
        { name: "rightward", keys: ["ArrowRight", "KeyD"] },
        { name: "jump", keys: ["Space"] },
        { name: "run", keys: ["Shift"] },
        // Optional animation key map
        { name: "action1", keys: ["1"] },
        { name: "action2", keys: ["2"] },
        { name: "action3", keys: ["3"] },
        { name: "action4", keys: ["KeyF"] },
    ];

    return (
        <>
            {/* Fade overlay for scene transitions */}
            <div 
                className={`fixed inset-0 bg-black z-50 pointer-events-none transition-opacity duration-500 ${
                    !physicsReady ? 'opacity-100' : 'opacity-0'
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
                    gl.setClearColor(new Color(0, 0, 0))
                }}>
                <CanvasLoader />
                <Physics paused={!physicsReady}>
                    {/* Render current scene */}
                    {currentScene === 'hallway' && (
                        <>
                            <ambientLight intensity={0.3} />
                                
                            <Environment preset="apartment" environmentIntensity={0.7} background={false} environmentRotation={[0, - Math.PI / 2, 0]}/>
                            <Hallway 
                                onReady={() => setPhysicsReady(true)} 
                                onDoorEnter={handleDoorEnter}
                            />
                        </>
                    )}
                    
                    {currentScene === 'room-Q&A' && (
                        <>
                            <TargetedDirectionalLight position={[0, 4, 0]} target={[0, 0, 5.5]} intensity={0.5} />
                            
                            <ambientLight intensity={0.4} />
                            
                            <Environment preset="apartment" environmentIntensity={0.4} background={false}/>
                            <RoomQA
                                onReady={() => setPhysicsReady(true)}
                                onDoorEnter={handleDoorEnter} />
                        </>
                    )}

                    {currentScene === 'room-music-videos' && (
                        <>
                            <ambientLight intensity={0.4} />
                            
                            <Environment preset="apartment" environmentIntensity={0.4} background={false}/>
                            <RoomMusicVideos
                                onReady={() => setPhysicsReady(true)}
                                onDoorEnter={handleDoorEnter} />
                        </>
                    )}
                    
                    {physicsReady && (
                        <KeyboardControls map={keyboardMap}>
                            <Ecctrl
                                position={ROOM_SPAWN_POSITIONS[currentScene]}
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