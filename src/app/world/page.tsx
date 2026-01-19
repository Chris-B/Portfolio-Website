import { Suspense } from "react";
import Loading from "@/app/loading";

import { CanvasProvider } from '@/app/world/hooks/canvas-context'
import WorldScene from "@/app/world/components/3d/world-scene";

/**
 * World Page
 * Displays the 3D world scene with all rooms and objects.
 * Suspends until the world scene is ready.
 * 
 * @returns World Page with 3D world scene.
 */
export default async function WorldPage() {

    return (
        <CanvasProvider>
            <Suspense fallback={<Loading />}>
                <div className="relative h-full w-full">
                    <div className="absolute inset-0 z-0">
                        <WorldScene />
                    </div>
                </div>
            </Suspense>
        </CanvasProvider>
    );
}