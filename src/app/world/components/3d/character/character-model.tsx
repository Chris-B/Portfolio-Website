import { useMemo } from 'react'
import { Mesh } from 'three'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'

/**
 * CharacterModel component for displaying the user's character model within the scene.
 * 
 * @returns CharacterModel primitivecomponent
 */
export default function CharacterModel() {
  const { scene } = useCompressedGLTF('/world/Airplane-Compressed.glb')
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
  
  return (
    <primitive 
      object={clonedScene} 
      scale={0.003} 
      rotation={[0, Math.PI / 2, 0]}
      position={[0, 0, 0]}
    />
  )
}