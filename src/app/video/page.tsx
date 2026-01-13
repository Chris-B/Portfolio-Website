import VideoScene from "~/app/video/components/video-scene";
import VideoControls from "~/app/video/components/video-controls";

export default function Home() {

  return (
    <div className="h-full w-full">
      <VideoControls />
      <div className="relative h-full w-full">
        <div className="absolute inset-0 z-0">
          <VideoScene />
        </div>
      </div>
    </div>
  );
}