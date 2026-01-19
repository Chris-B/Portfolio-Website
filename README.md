# Chris Barclay – Immersive 3D Portfolio
 
 An experimental portfolio site built with **Next.js** and an interactive **React Three Fiber** world.
 
 ## Live Demo
 
 https://chrisbarclay.dev
 
 ## What This Is
 
 This repo contains my personal portfolio website. The main focus is an immersive, game-like 3D “world” where visitors can:
 
 - Explore rooms (hallway → rooms)
 - Chat with a virtual avatar (Q&A room)
 - Watch reactive 3D music-video screens (music video room)
 
 It’s intentionally a hybrid experience:
 
 - **2D UI** for navigation, overlays, and controls
 - **3D world** for the interactive portfolio “experience”
 
 ## Features
 
 - **Next.js App Router** application
 - **3D World** built with React Three Fiber + drei
 - **Physics / Collisions** via `@react-three/rapier`
 - **Character controller** via `ecctrl`
 - **Room-based navigation** using custom door sensors + spawn points
 - **Avatar Q&A**:
   - Client chat UI
   - `/api/ask` route proxies requests to an external backend (configured via env var)
 - **3D Music Video Room**:
   - Multiple video “screens” in-world
   - Shader-driven mesh effects
   - Custom state per screen using Zustand store instances
 - **Touch-friendly overlays** (movement controls, room-specific UI)
 - **TanStack Query** for client data fetching/mutations
 
 ## Tech Stack
 
 - **Framework**: Next.js (App Router)
 - **Language**: TypeScript
 - **UI**: Tailwind CSS + shadcn/ui (Radix primitives)
 - **3D**: three.js + @react-three/fiber + @react-three/drei
 - **Physics**: @react-three/rapier
 - **State**: Zustand
 - **Data fetching**: @tanstack/react-query
 - **Runtime validation**: zod
 
 ## Project Structure (high level)
 
 ```text
 src/
   app/
     page.tsx                # Landing page
     world/
       page.tsx              # World entry (CanvasProvider + Suspense)
       components/
         3d/
           world-scene.tsx   # R3F Canvas + environment + room switching
           rooms/
             hallway/
             q&a/
             music-videos/
         overlay/            # UI overlays for the world
       stores/               # Zustand stores (avatar, music-videos, overlay)
       api/                  # Client hooks for API routes (TanStack Query)
       schemas/              # zod schemas
   components/               # Site header/footer + UI components
 public/
   world/                    # GLB/HDR assets, rooms, videos, posters
 ```
 
 ## How The 3D World Works
 
 - **Entry**: `src/app/world/page.tsx`
   - Wraps the world in `CanvasProvider` and `Suspense`
 - **Core scene**: `src/app/world/components/3d/world-scene.tsx`
   - Creates the R3F `<Canvas>`
   - Sets the environment HDR (`/public/world/skybox/night-sky.hdr`)
   - Runs Rapier physics and a character controller
   - Switches “rooms” by updating `currentScene` and `currentSpawnPosition`
 - **Rooms**:
   - `Hallway` creates door sensors that map to scenes via `DoorToScene`
   - Each room calls `onReady()` once physics colliders are detected
 - **Asset loading**:
   - `useCompressedGLTF()` configures a shared `KTX2Loader` for GLB assets
   - Many models are cloned and their materials cloned to avoid shared-material side effects
 
 ## State Management
 
 - **Overlay UI**: `src/app/world/stores/overlay-store.ts`
 - **Avatar Q&A**: `src/app/world/stores/avatar-store.ts`
 - **Music Videos**: `src/app/world/stores/music-videos-store.ts`
   - Uses a registry of store instances keyed by video id (e.g. `Left`, `Middle`, `Right`)
 
 ## API Routes
 
 This app proxies requests to an upstream backend.
 
 - **POST `/api/ask`**
   - Used by the Q&A room
   - Fetches audio and lip sync data from an external API
 - **GET `/api/video`**
   - Streaming passthrough endpoint for videos
 
 Client hooks live in:
 
 - `src/app/world/api/use-ask.ts`
 - `src/app/world/api/use-video.ts`
 
 ## Deployment
 
 This is a standard Next.js App Router project and is deployed on Vercel.
 
 ## Troubleshooting
 
 - **Black screen on load**
   - The world waits on physics colliders to initialize. Check browser console for collider timeout warnings.
 - **Video playback issues on mobile**
   - Mobile browsers can be strict about autoplay/audio. This project uses user gestures and `playsInline` to improve compatibility.
 
 ## Contact
 
 - Website: https://chrisbarclay.dev
 - GitHub: https://github.com/Chris-B
 - LinkedIn: https://www.linkedin.com/in/chris-barclay/
 - Email: chris@chrisbarclay.dev