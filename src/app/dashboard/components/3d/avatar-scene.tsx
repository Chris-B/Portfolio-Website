'use client'

import { useMemo, useRef, useEffect } from "react";
import { PerspectiveCamera, Environment } from "@react-three/drei";
import { ChrisAvatar } from '~/app/dashboard/components/3d/avatar-component'
import { Office } from '~/app/dashboard/components/3d/office-component'

import { useCanvas } from '~/context/canvas-context'

import { Canvas, useThree } from '@react-three/fiber'

import * as Three from 'three'

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

export default function SceneCanvas() {

  const cameraProps = useMemo(
    () => ({
      makeDefault: true,
      zoom: 1,
      near: 1,
      far: 2000,
      position: [0, 0.2, 1] as [number, number, number],
      rotation: [-0.15, 0, 0] as [number, number, number],
    }),
    [],
  );

  const officeProps = useMemo(() => ({
    scale: [0.9, 0.9, 0.9] as [number, number, number],
    rotation: [0, -Math.PI / 2, 0] as [number, number, number],
    position: [0, -1, 0] as [number, number, number],
  }), [])

  return (
      <Canvas onCreated={({ gl }) => {
        gl.setClearColor(new Three.Color(0, 0, 0))
      }}>
        <CanvasLoader />
        <ChrisAvatar position={[0, -0.99, -1] as [number, number, number]} />
        <Office {...officeProps} />
        <PerspectiveCamera {...cameraProps} />
        <Environment preset="apartment" environmentIntensity={0.5}/>
      </Canvas>
  )
}