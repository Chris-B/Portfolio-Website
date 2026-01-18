import { Vector3 } from "three"

export interface DoorSensorProps {
  position: [number, number, number]
  size?: [number, number, number]
  onEnter?: () => void
  onExit?: () => void
  name?: string
}

export interface MapProps {
  onReady?: () => void
  onDoorEnter?: (doorId: string, spawnPosition: [number, number, number]) => void
}

export interface OverlayProps {
  currentScene: SceneType
}

export type SceneType = 'hallway' | 'room-Q&A' | 'room-music-videos' | 'roomC' | 'roomD' | 'roomE' | 'roomF' | 'roomG' | 'roomH'

export type DoorProps = {
  id: string, 
  name: string,
  position: Vector3
  rotation: number,
  doorSignPosition: Vector3
}

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
}