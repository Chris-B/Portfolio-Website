import { Text, RoundedBox, Center } from '@react-three/drei'

/**
 * DoorSign component for displaying a door sign.
 * 
 * @param text: string
 * @param position: [number, number, number]
 * @param scale: [number, number, number]
 * @param rotation: [number, number, number]
 * @returns DoorSign component
 */
export default function DoorSign({ text = "OFFICE", position, scale, rotation }: { text: string, position: [number, number, number], scale: [number, number, number], rotation: [number, number, number] }) {

    const width = 2.4
    const height = 0.6

    return (
        <group position={position} scale={scale} rotation={rotation}>
            {/* Main plate */}
            <RoundedBox args={[width, height, 0.08]} radius={0.03} smoothness={4}>
                <meshStandardMaterial
                    color="#090224"
                    metalness={0.9}
                    roughness={0.2}
                />
            </RoundedBox>
            {/* Beveled border */}
            <RoundedBox args={[width - 0.1, height - 0.1, 0.1]} radius={0.02} smoothness={4} position={[0, 0, 0.01]}>
                <meshStandardMaterial
                    color="#080007"
                    metalness={0.95}
                    roughness={0.15}
                />
            </RoundedBox>
            {/* Engraved text area */}
            <RoundedBox args={[width - 0.25, height - 0.2, 0.02]} radius={0.01} smoothness={4} position={[0, 0, 0.055]}>
                <meshStandardMaterial
                    color="#0b0166"
                    metalness={0.8}
                    roughness={0.3}
                />
            </RoundedBox>
            {/* Text */}
            <Center position={[0.5, 0.5, 0.08]}>
                <Text
                    fontSize={0.25}
                    fontWeight="bold"
                    color="#c4bb8d"
                    anchorX="center"
                    anchorY="middle"
                    letterSpacing={0.05}
                >
                    {text}
                </Text>
            </Center>
            {/* Corner screws */}
            {[[-1, 1], [1, 1], [-1, -1], [1, -1] as const].map(([x, y], i) => (
                <mesh key={i} position={[x * (width / 2 - 0.12), y * (height / 2 - 0.1), 0.06]}>
                    <cylinderGeometry args={[0.035, 0.035, 0.03, 16]} />
                    <meshStandardMaterial color="#c4bdab" metalness={0.95} roughness={0.1} />
                </mesh>
            ))}
        </group>
    )
}