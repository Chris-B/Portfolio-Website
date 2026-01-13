'use client'

/* Author of shaders: espisepi */
/* Code based in: https://tympanus.net/codrops/2019/09/06/how-to-create-a-webcam-audio-visualizer-with-three-js/ */
import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { useFrame, useLoader, useThree } from "@react-three/fiber";

import { useVideoStore } from "~/app/video/stores/video-store";

import VideoShader0 from "~/app/video/components/shaders/VideoShader0";
import VideoShader1 from "~/app/video/components/shaders/VideoShader1";

function loadVideo(videoSrc: string) {
    const video = document.createElement("video");
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = videoSrc;
    video.load();
    return video
}

function loadAudio(audioBuffer: AudioBuffer) {

    if(audioBuffer){
        const audioListener = new THREE.AudioListener();
        const audioTemp = new THREE.Audio(audioListener);
        audioTemp.setBuffer(audioBuffer);
        audioTemp.setLoop(true);
        audioTemp.autoplay = false;
        audioTemp.setVolume(0);
        return audioTemp
    }

    return null

}

export const VideoComponent = () => {
    const configuration = `
          r = bass + 0.5;
          g = bass;
          b = bass;
          color.r = bass;
          color.g = mid;
          color.b = mid
          distance = 1;
          density = 1;
      `;

    const { videoLoaded, audioLoaded, setLoaded, setAudioLoaded, setIsPlaying, videoElement, setVideoElement, audio, setAudio, videoSrc } = useVideoStore((state) => state)


    useEffect(() => {
        setLoaded(false)
        setAudioLoaded(false)
        setIsPlaying(false)
        console.log("Reset Video and Audio")
    }, [videoSrc]);

    const audioBuffer = useLoader(THREE.AudioLoader, videoSrc!)

    useEffect(() => {
        if(!audioLoaded) {
            const tempAudio = loadAudio(audioBuffer)
            if (tempAudio) {
                setAudio(tempAudio)
            }
            console.log("Loading Audio")
        }
        if(!videoLoaded) {
            setVideoElement(loadVideo(videoSrc!));
            console.log("Loading Video")
        }
    }, [videoSrc]);

    useFrame(() => {
        if (!audioLoaded && audio) {
            console.log("Audio Ready")
            setAudioLoaded(true)
        }
    });

    useFrame(() => {
        if (videoElement?.readyState == 4 && !videoLoaded) {
            console.log("Video Ready")
            console.log(videoElement)
            setLoaded(true)
        }
    });


    return audio ? <VideoPointsShader audio={audio} video={videoElement} configuration={configuration} /> : null
    
}

type Shader = {
    uniforms: {
        iTime: { value: number },
        iResolution: { value: THREE.Vector3 },

        bass: { value: number },
        mid: { value: number },
        treble: { value: number },

        iChannel0: { value: THREE.Texture },
      },
      vertexShader: string,
      fragmentShader: string
}

type VideoShaderProps = {
    audio: THREE.Audio,
    video: HTMLVideoElement | null,
    shaderType?: string,
    configuration: string,
    position?: [number,number,number],
    rotation?: [number,number,number],
    scale?: [number,number,number],
    colorInput?: THREE.Vector3
}

/** Arguments explanation:
 * audio: THREE.audio
 * video: HTML Video Element
 * configuration: Shader Configuration String
 */
export const VideoPointsShader = ({ audio, video, shaderType='VideoShader0', configuration, position=[0,0,0], rotation=[Math.PI, Math.PI, 0], scale=[1,1,1], colorInput = new THREE.Vector3(0,0,0) }: VideoShaderProps) => {
    configuration = configuration || `
                                                r = bass + 0.5;
                                                g = treble;
                                                b = mid;
                                                color.r = bass;
                                                color.g = mid;
                                                color.b = mid
                                                distance = 2;
                                            `;

    const fftSize = 2048;
    const frequencyRange = {
        bass: [20, 140],
        lowMid: [140, 400],
        mid: [400, 2600],
        highMid: [2600, 5200],
        treble: [5200, 14000],
    };

    const { audioLoaded } = useVideoStore((state) => state)

    const [analyser, setAnalyser] = useState<THREE.AudioAnalyser>();

    useEffect(()=>{
        if(audio){
            console.log("Set Audio Analyser")
            setAnalyser(new THREE.AudioAnalyser(audio, fftSize));
        }
    },[audioLoaded]);

    const {scene} = useThree();

    const [particles, setParticles] = useState<THREE.Points | null>(null);

    useEffect(()=>{
        return () => {
            if(particles) {
                scene.remove(particles);
            }
        }
    },[particles])

    useFrame(({clock})=>{

        if( !particles && video && video.readyState === 4 ){
            console.log('setting particles')
            const res = createParticles(video, shaderType);
            res.position.set(...position);
            res.rotation.set(...rotation);
            res.scale.set(...scale);
            scene.add(res);
            setParticles(res);
        }

        let data, bass, mid, treble;
        if(analyser){
            data = analyser.getFrequencyData();
            bass = getFrequencyRangeValue(frequencyRange.bass, data);
            mid = getFrequencyRangeValue(frequencyRange.mid, data);
            treble = getFrequencyRangeValue(frequencyRange.treble, data);
        }
        if(particles){
            const material = particles.material as THREE.ShaderMaterial;
            material.uniforms.iTime!.value = clock.elapsedTime;
            material.uniforms.bass!.value = bass;
            material.uniforms.mid!.value = mid;
            material.uniforms.treble!.value = treble;
            material.uniforms.colorInput!.value = colorInput;
        }

    });

    return null;
};

function createParticles(video: HTMLVideoElement, shaderType: string){

    const imageData = getImageData(video);
    const textureVideo = new THREE.VideoTexture(video);

    let shaderMaterial;
    if(shaderType==='videoshader1'){
        shaderMaterial = VideoShader1(textureVideo);
    }else{
        shaderMaterial = VideoShader0(textureVideo);
    }
    const material = shaderMaterial;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const uvs = [];
    for (let y = 0, height = imageData.height; y < height; y += 1) {
        for (let x = 0, width = imageData.width; x < width; x += 1) {
            const vertex = new THREE.Vector3(
                x - imageData.width / 2,
                -y + imageData.height / 2,
                0
            );
            positions.push( vertex.x, vertex.y, vertex.z );
            uvs.push( x / imageData.width, y / imageData.height );
        }
    }
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );

    return new THREE.Points(geometry, material);
}

function getImageData(video: HTMLVideoElement) {
    const canvas = document.createElement('CANVAS') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d')!
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);

    ctx.drawImage(video, 0, 0);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function getFrequencyRangeValue (_frequencyRange: number[], frequencyData: Uint8Array) {
    const data = frequencyData;
    const nyquist = 48000 / 2;
    const lowIndex = Math.round(_frequencyRange[0]! / nyquist * data.length);
    const highIndex = Math.round(_frequencyRange[1]! / nyquist * data.length);
    let total = 0;
    let numFrequencies = 0;

    for (let i = lowIndex; i <= highIndex; i++) {
        total += data[i]!;
        numFrequencies += 1;
    }

    return total / numFrequencies / 255;
}

