'use client'

import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { DoorSensorProps } from '@/app/world/types/world-types'


/**
 * DoorSensor component for detecting when a player enters a door.
 * 
 * @param position: [number, number, number]
 * @param size?: [number, number, number]
 * @param onEnter: () => void
 * @param onExit: () => void
 * @param name?: string
 * @returns DoorSensor component
 */
export function DoorSensor({ 
  position, 
  size = [1, 2, 0.5], 
  onEnter, 
  onExit,
  name = 'door'
}: DoorSensorProps) {
  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider
        args={size}
        position={position}
        sensor
        onIntersectionEnter={() => {
          onEnter?.()
        }}
        onIntersectionExit={() => {
          onExit?.()
        }}
      />
    </RigidBody>
  )
}
