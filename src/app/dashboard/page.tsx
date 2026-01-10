import AvatarControls from "~/app/dashboard/components/avatar-controls";

import { Suspense } from "react";
import Loading from "~/app/loading";
import SceneCanvas from "~/app/dashboard/components/avatar-scene";

import NowPlayingCard from "~/app/dashboard/components/now-playing";

import { HydrateClient } from "~/trpc/server";

import { CanvasProvider } from '~/context/canvas-context'

export default async function Home() {

  return (
      <HydrateClient>
          <CanvasProvider>
            <Suspense fallback={<Loading/>}>
                <NowPlayingCard/>
                <AvatarControls/>
                <div className="relative h-full w-full">
                    <div className="absolute inset-0 z-0">
                        <SceneCanvas/>
                    </div>
                </div>
            </Suspense>
          </CanvasProvider>
      </HydrateClient>
  );
}