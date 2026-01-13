import { Suspense } from "react";
import Loading from "~/app/loading";

import { CanvasProvider } from '~/context/canvas-context'
import WorldScene from "./components/3d/world-scene";

export default async function World() {

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