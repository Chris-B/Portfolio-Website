import { useTexture, useVideoTexture } from '@react-three/drei'
import { VideoMesh3D } from '@/app/world/components/3d/rooms/music-videos/video-mesh-3d'

/**
 * VideoScreen component for displaying a 2D video within the scene.
 * 
 * @param url: string
 * @param position: [number, number, number]
 * @param rotation: [number, number, number]
 * @param scale: [number, number]
 * @returns VideoScreen component
 */
export function VideoScreen({ url, position, rotation, scale }: { url: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number] }) {
    const texture = useVideoTexture(url, { loop: true, muted: true, start: true })
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={scale} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

/**
 * ImageScreen component for displaying a 2D image within the scene.
 * 
 * @param url: string
 * @param position: [number, number, number]
 * @param rotation: [number, number, number]
 * @param scale: [number, number]
 * @returns ImageScreen component
 */
export function ImageScreen({ url, position, rotation, scale }: { url: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number] }) {
    const texture = useTexture(url)
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={scale} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

/**
 * VideoScreenMesh3D component for displaying a video texture with a reactive displacement shader within the scene.
 * 
 * @param id: string
 * @param url: string
 * @param poster: string
 * @param position: [number, number, number]
 * @param rotation: [number, number, number]
 * @param scale: [number, number]
 * @returns VideoScreenMesh3D component
 */
export function VideoScreenMesh3D({ id, url, poster, position, rotation, scale }: { id: string, url: string, poster?: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number] }) {
    return (
        <VideoMesh3D 
            id={id} 
            videoSrc={url}
            posterSrc={poster}
            position={position} 
            rotation={rotation} 
            scale={scale}
        />
    )
}