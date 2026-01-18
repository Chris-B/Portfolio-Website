'use client'

import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { DoorSensorProps } from '@/app/world/types/world-types'

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
