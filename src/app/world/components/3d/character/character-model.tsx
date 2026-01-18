import { useMemo } from 'react'
import { Mesh } from 'three'
import { useCompressedGLTF } from '@/app/world/hooks/use-compressed-gltf'

export default function CharacterModel() {
  const { scene } = useCompressedGLTF('/world/Character-Compressed.glb')
  
  // Clone scene to prevent reuse issues on mobile Safari
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    // Clone materials to prevent shared material issues
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
      scale={0.34} 
      position={[0, -0.5, 0]}
    />
  )
}