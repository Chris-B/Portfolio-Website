import { DoorProps, SceneType, KeyboardMap } from "@/app/world/types/world-types";
import { Vector3 } from "three";

/**
 * Keyboard Map Configuration for drei's KeyboardControls
 * 
 * @type {KeyboardMap[]}
 */
export const KeyboardControlsMap: KeyboardMap[] = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    // Optional animation key map
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "action4", keys: ["KeyF"] },
]

/**
 * Door to Scene Mapping. 
 * Used to determine which scene to load when a door is entered.
 * 
 * @type {Record<string, SceneType>}
 */
export const DoorToScene: Record<string, SceneType> = {
    'A': 'room-Q&A',
    'B': 'room-music-videos',
    'C': 'roomC',
    'D': 'roomD',
    'E': 'roomE',
    'F': 'roomF',
    'G': 'roomG',
    'H': 'roomH',
    'RoomA': 'hallway',
    'RoomB': 'hallway'
}

/**
 * Array of doors in the hallway. Used to create door sensors and door signs.
 * 
 * @type {DoorProps[]}
 */
export const HallwayDoors: DoorProps[] = [
    { id: 'A', name: 'Chris Q&A', position: new Vector3(2, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(2, 2.632, -1.895) },
    { id: 'B', name: '3D Fun Zone', position: new Vector3(10, 1.2, 2), rotation: Math.PI, doorSignPosition: new Vector3(10, 2.632, 1.895) },
    { id: 'C', name: 'Coming Soon', position: new Vector3(18, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(18, 2.632, -1.895) },
    { id: 'D', name: 'Coming Soon', position: new Vector3(26, 1.2, 2), rotation: Math.PI, doorSignPosition: new Vector3(26, 2.632, 1.895) },
    { id: 'E', name: 'Coming Soon', position: new Vector3(34, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(34, 2.632, -1.895) },
    { id: 'F', name: 'Coming Soon', position: new Vector3(42, 1.2, 2), rotation: Math.PI, doorSignPosition: new Vector3(42, 2.632, 1.895) },
    { id: 'G', name: 'Coming Soon', position: new Vector3(50, 1.2, -2), rotation: 0, doorSignPosition: new Vector3(50, 2.632, -1.895) },
    { id: 'H', name: 'Coming Soon', position: new Vector3(60, 1.2, 0), rotation: - Math.PI / 2, doorSignPosition: new Vector3(60, 2.632, 0) },
]

/**
 * Q&A Room Door Configuration
 * 
 * @type {DoorProps}
 */
export const QAndARoomDoor: DoorProps = {id: 'RoomA', name: 'Exit', position: new Vector3(0, 1.2, -6), rotation: 0, doorSignPosition: new Vector3(0, 2.632, -5.885)}

/**
 * Music Video Room Door Configuration
 * 
 * @type {DoorProps}
 */
export const MusicVideoRoomDoor: DoorProps = {id: 'RoomB', name: 'Exit', position: new Vector3(0, 1.2, -6), rotation: 0, doorSignPosition: new Vector3(0, 2.632, -5.885)}

/**
 * Viseme mapping for lip sync.
 * @type {Record<string, string>}
 */
export const AvatarVisemeTargets: Record<string, string> = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_aa",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
}

/**
 * Action names for the avatar.
 * @type {string[]}
 */
export const AvatarActionNames: string[] = [
    'SittingIdle', 
    'SitToStand', 
    'StandingIdleNew', 
    'StandToSit', 
    'avaturn_animation', 
    'SillyDancing'
] as const

/**
 * Suggested questions for the avatar.
 * @type {string[]}
 */
export const SuggestedQuestions: string[] = [
    "What kind of software do you build?",
    "What are your thoughts on golfing?",
] as const