import { Vector3 } from "three"

/**
 * Canvas context type.
 * 
 * @property {boolean} isCanvasLoaded - Whether the canvas is loaded.
 * @property {function} setCanvasLoaded - Function to set the canvas loaded state.
 */
export type CanvasContextType = {
  isCanvasLoaded: boolean
  setCanvasLoaded: (loaded: boolean) => void
}

/**
 * Interface containing the properties for setting up Door Sensors.
 * 
 * @property {[number, number, number]} position - The position of the door sensor.
 * @property {[number, number, number]} size - The size of the door sensor.
 * @property {function} onEnter - Function to be called when the door sensor is entered.
 * @property {function} onExit - Function to be called when the door sensor is exited. Not implemented.
 * @property {string} name - The name of the door sensor.
 */
export interface DoorSensorProps {
  position: [number, number, number]
  size?: [number, number, number]
  onEnter?: () => void
  onExit?: () => void
  name?: string
}

/**
 * Interface containing the properties for setting up a scene.
 * 
 * @property {function} onReady - Function to be called when the scene is ready.
 * @property {function} onDoorEnter - Function to be called when a door is entered.
 */
export interface SceneProps {
  onReady?: () => void
  onDoorEnter?: (doorId: string, spawnPosition: [number, number, number]) => void
}

/**
 * Interface containing the properties for setting up the overlay.
 * 
 * @property {SceneType} currentScene - The current scene.
 */
export interface OverlayProps {
  currentScene: SceneType
}

/**
 * Interface containing the properties for setting up specific room overlays.
 * 
 * @property {boolean} isTouchDevice - Whether the device is a touch device.
 */
export interface RoomOverlayProps {
  isTouchDevice: boolean
}

/**
 * Type for the different scenes.
 */
export type SceneType = 'hallway' | 'room-Q&A' | 'room-music-videos' | 'roomC' | 'roomD' | 'roomE' | 'roomF' | 'roomG' | 'roomH'

/**
 * Door properties.
 * 
 * @property {string} id - The ID of the door.
 * @property {string} name - The name of the door.
 * @property {Vector3} position - The position of the door.
 * @property {number} rotation - The rotation of the door.
 * @property {Vector3} doorSignPosition - The position of the door sign.
 */
export type DoorProps = {
  id: string, 
  name: string,
  position: Vector3
  rotation: number,
  doorSignPosition: Vector3
}

/**
 * Chat message properties.
 * Used for the avatar chat feature.
 * 
 * @property {'user' | 'assistant'} role - The role of the message.
 * @property {string} content - The content of the message.
 */
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Keyboard map properties.
 * Used for the keyboard controls feature.
 * 
 * @property {string} name - The name of the action.
 * @property {string[]} keys - The keys that trigger the action.
 */
export type KeyboardMap = {
  name: string;
  keys: string[];
}

/**
 * @type {Object} LipSyncJSON
 * @property {Array<{ start: number; end: number; value: string }>} mouthCues
 */
export type LipSyncJSON = {
  mouthCues: Array<{ start: number; end: number; value: string }>
}