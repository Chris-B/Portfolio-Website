'use client'

import {
    createRef,
    Suspense,
    useEffect,
    useRef,
    useState,
  } from "react";

  import { Canvas, useFrame, useThree } from "@react-three/fiber";

  import { OrbitControls } from "@react-three/drei";
  import { VideoComponent } from "~/app/video/components/video-component";

import { useVideoStore } from "~/app/video/stores/video-store"

  export function Scene() {

    const { videoSrc } = useVideoStore((state) => state)

      const { camera } = useThree();
      useEffect(()=>{
          camera.position.z = -650;
      });
      const [orbitEnabled,setOrbitEnabled] = useState(false);
      const  [firstTime, setFirstTime] = useState(true);
      const loadingRef = createRef();

      useFrame(()=>{
          if(firstTime && loadingRef.current === null){
              setFirstTime(false);
              setOrbitEnabled(true);
          }
      })

      const orbitRef = useRef(null)

      return(
          <>
            <ambientLight args={[0x443333, 0.5]} />
            { videoSrc ? (
              <Suspense>
                <VideoComponent/>
              </Suspense>
            ) : null }
            {/* <Picture /> */}
            <OrbitControls ref={orbitRef} enabled={orbitEnabled} enablePan={false} autoRotateSpeed={1.6} />
          </>
      );
  }

  export default function VideoScene() {
      return (
          <>
              <Canvas className="canvas" style={{backgroundColor:'#000000', position:'absolute', width:'100%', height:'100vh'}} camera={{far:20000}}>
                <Scene/>
              </Canvas>
          </>
      )
  }