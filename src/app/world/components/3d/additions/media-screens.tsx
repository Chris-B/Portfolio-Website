import { useTexture, useVideoTexture } from '@react-three/drei'
import { VideoMesh3D } from '@/app/world/components/3d/rooms/music-videos/video-mesh-3d'

export function VideoScreen({ url, position, rotation, scale }: { url: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number] }) {
    const texture = useVideoTexture(url, { loop: true, muted: true, start: true })
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={scale} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

export function ImageScreen({ url, position, rotation, scale }: { url: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number] }) {
    const texture = useTexture(url)
    return (
        <mesh position={position} rotation={rotation}>
            <planeGeometry args={scale} />
            <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
    )
}

export function VideoScreenMesh3D({ id, url, poster, position, rotation, scale, displacementScale = 0.4 }: { id: string, url: string, poster?: string, position: [number, number, number], rotation: [number, number, number], scale: [number, number], displacementScale?: number }) {
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