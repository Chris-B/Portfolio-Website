import { useHelper } from "@react-three/drei"
import { useEffect, useRef } from "react"
import { DirectionalLight, DirectionalLightHelper } from "three"

/**
 * Targeted Directional Light Component
 * 
 * @param position - The position of the light
 * @param intensity - The intensity of the light
 * @param target - The target position of the light
 * @param debug - Whether to show the light helper
 * @returns 
 */
export function TargetedDirectionalLight({ position, intensity, target = [0, 0, 0], debug = false }: { 
    position: [number, number, number], 
    intensity: number,
    target?: [number, number, number],
    debug?: boolean
}) {
    const lightRef = useRef<DirectionalLight>(null!)
    if (debug) {
        useHelper(lightRef, DirectionalLightHelper, 2, 'yellow')
    }
    
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