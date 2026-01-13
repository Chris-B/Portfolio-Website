'use client'

import { useMemo, useEffect } from "react";
import { PerspectiveCamera, Environment, PointerLockControls, OrbitControls } from "@react-three/drei";
import { WorldObject } from './world-object'

import * as THREE from 'three'

import { useCanvas } from '~/context/canvas-context'

import { Canvas, useThree } from '@react-three/fiber'

function CanvasLoader() {
    const { gl } = useThree()
    const { setCanvasLoaded } = useCanvas()

    useEffect(() => {
        const handleContextLost = (event: Event) => {
            if (event instanceof WebGLContextEvent) {
                event.preventDefault()
                console.log('WebGL context lost. Trying to restore...')
                setCanvasLoaded(false)
            }
        }

        const handleContextRestored = () => {
            console.log('WebGL context restored.')
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

    const cameraPosition = useMemo(() => [-2.75, 1.75, 0] as [number, number, number], [])
    const cameraRotation = useMemo(() => [0, -1.6, 0] as [number, number, number], [])

    return (
        <Canvas onCreated={({ gl }) => {
            gl.setClearColor(new THREE.Color(0, 0, 0))
        }}>
            <CanvasLoader />
            {/* <ChrisAvatar position={[0, -0.99, -1] as [number, number, number]} /> */}
            {/* <Office {...officeProps} /> */}
            {/* <OrbitControls
                enableZoom={true}
                enablePan={true}
                minPolarAngle={Math.PI / 2}
                maxPolarAngle={Math.PI / 2}
            /> */}
            <PerspectiveCamera
                makeDefault
                zoom={1}
                near={0.1}
                far={100}
                position={cameraPosition}
                rotation={cameraRotation}
            />
            <PointerLockControls />
            <WorldObject />
            <Environment preset="apartment" environmentIntensity={0.5} />
        </Canvas>
    )
}