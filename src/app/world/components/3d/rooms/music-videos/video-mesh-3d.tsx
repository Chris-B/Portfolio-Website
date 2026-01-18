'use client'

import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { AudioListener, Audio, AudioAnalyser, VideoTexture, AudioLoader, PlaneGeometry, ShaderMaterial, Mesh, TextureLoader } from "three";
import { useMusicVideoStore } from "@/app/world/stores/music-videos-store";
import { useShallow } from "zustand/shallow";
import VideoMeshShader from "./shaders/VideoMeshShader";

function loadVideo(videoSrc: string, posterSrc?: string): HTMLVideoElement {
    const video = document.createElement("video");
    video.autoplay = false;
    video.muted = true; // Video is muted - audio comes from separate Three.js Audio
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.setAttribute('webkit-playsinline', 'true'); // iOS Safari
    if (posterSrc) video.poster = posterSrc;
    video.src = videoSrc;
    video.load();
    return video;
}

function loadAudioAsync(audioSrc: string): Promise<AudioBuffer> {
    return new Promise((resolve, reject) => {
        const loader = new AudioLoader();
        loader.load(
            audioSrc,
            (buffer) => resolve(buffer),
            undefined,
            (err) => reject(err)
        );
    });
}

function createAudioFromBuffer(audioBuffer: AudioBuffer): { audio: Audio, analyser: AudioAnalyser } {
    const audioListener = new AudioListener();
    const audio = new Audio(audioListener);
    audio.setBuffer(audioBuffer);
    audio.setLoop(true);
    audio.autoplay = false;
    audio.setVolume(0.5);
    
    const analyser = new AudioAnalyser(audio, 2048);
    
    return { audio, analyser };
}

type VideoMesh3DProps = {
    id: string;
    videoSrc: string;
    posterSrc?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number];
    subdivisions?: number;
}

export function VideoMesh3D({ 
    id, 
    videoSrc,
    posterSrc,
    position, 
    rotation, 
    scale,
    subdivisions = 128
}: VideoMesh3DProps) {
    const meshRef = useRef<Mesh>(null);
    const geometryRef = useRef<PlaneGeometry | null>(null);
    const materialRef = useRef<ShaderMaterial | null>(null);
    
    const [videoElement, videoLoaded, audioLoaded, audio, depthEffect, currentTime, isPlaying, volume, readyForControl] = useMusicVideoStore(id, useShallow((state) => [state.videoElement, state.videoLoaded, state.audioLoaded, state.audio, state.depthEffect, state.currentTime, state.isPlaying, state.volume, state.readyForControl]));
    const [setLoaded, setAudioLoaded, setVideoElement, setAudio, setCurrentTime, setReadyForControl] = useMusicVideoStore(id, useShallow((state) => [state.setLoaded, state.setAudioLoaded, state.setVideoElement, state.setAudio, state.setCurrentTime, state.setReadyForControl]));

    const lastCurrentTimeRef = useRef(currentTime);

    // Load video and create audio from it
    useEffect(() => {
        if (!videoLoaded) {
            const video = loadVideo(videoSrc, posterSrc);
            if (video) {
                setVideoElement(video);
                setLoaded(true);
            }
        }
    }, [videoSrc, posterSrc, videoLoaded, setVideoElement, setLoaded]);

    // Load audio asynchronously (separate from video to avoid blocking)
    useEffect(() => {
        if (!audioLoaded) {
            loadAudioAsync(videoSrc)
                .then((buffer) => {
                    const result = createAudioFromBuffer(buffer);
                    setAudio(result.audio);
                    analyserRef.current = result.analyser;
                    setAudioLoaded(true);
                })
                .catch((err) => {
                    console.warn('Failed to load audio:', err);
                });
        }
    }, [videoSrc, audioLoaded, setAudio, setAudioLoaded]);

    const frequencyRange = {
        bass: [20, 140],
        lowMid: [140, 400],
        mid: [400, 2600],
        highMid: [2600, 5200],
        treble: [5200, 14000],
    };

    const analyserRef = useRef<AudioAnalyser | null>(null);
    const videoTextureRef = useRef<VideoTexture | null>(null);

    // Load poster texture
    const posterTexture = useMemo(() => {
        if (!posterSrc) return null;
        const loader = new TextureLoader();
        return loader.load(posterSrc);
    }, [posterSrc]);

    // Create shader material (create VideoTexture lazily to avoid GPU spikes when multiple screens mount)
    const { geometry, material } = useMemo(() => {
        if (!videoElement) return { geometry: null, material: null };
        const geo = new PlaneGeometry(scale[0], scale[1], subdivisions, Math.floor(subdivisions * (scale[1] / scale[0])));
        geometryRef.current = geo;
        // Use poster texture initially if available. If there's no poster, fall back to a VideoTexture.
        const initialTexture: any = posterTexture ?? (() => {
            const videoTexture = new VideoTexture(videoElement);
            videoTextureRef.current = videoTexture;
            return videoTexture;
        })();
        const mat = VideoMeshShader(initialTexture);
        materialRef.current = mat;
        return { geometry: geo, material: mat };
    }, [videoElement, scale, subdivisions, posterTexture]);

    // Update depth effect without recreating material
    useEffect(() => {
        if (material) {
            material.uniforms.displacementScale!.value = depthEffect;
        }
    }, [material, depthEffect]);

    // Store refs for cleanup (so cleanup only runs on unmount, not on every state change)
    const audioRef = useRef(audio);
    const videoElementRef = useRef(videoElement);
    const posterTextureRefForCleanup = useRef(posterTexture);
    
    useEffect(() => { audioRef.current = audio; }, [audio]);
    useEffect(() => { videoElementRef.current = videoElement; }, [videoElement]);
    useEffect(() => { posterTextureRefForCleanup.current = posterTexture; }, [posterTexture]);

    // Cleanup resources on unmount only (empty deps array)
    useEffect(() => {
        return () => {
            // Dispose video texture
            if (videoTextureRef.current) {
                videoTextureRef.current.dispose();
                videoTextureRef.current = null;
            }
            // Dispose poster texture
            if (posterTextureRefForCleanup.current) {
                posterTextureRefForCleanup.current.dispose();
            }
            // Dispose geometry
            if (geometryRef.current) {
                geometryRef.current.dispose();
                geometryRef.current = null;
            }
            // Dispose material
            if (materialRef.current) {
                materialRef.current.dispose();
                materialRef.current = null;
            }
            // Stop and disconnect audio
            if (audioRef.current) {
                if (audioRef.current.isPlaying) audioRef.current.stop();
                audioRef.current.disconnect();
            }
            // Pause and cleanup video element
            if (videoElementRef.current) {
                videoElementRef.current.pause();
                videoElementRef.current.src = '';
                videoElementRef.current.load();
            }
            // Clear analyser
            analyserRef.current = null;
        };
    }, []);


    // Handle user seeking via slider
    useEffect(() => {
        if (!videoElement) return;
        // Only seek if currentTime changed from external source (user dragging slider)
        if (Math.abs(currentTime - lastCurrentTimeRef.current) > 1) {
            videoElement.currentTime = currentTime;
            // Also sync audio position
            if (audio) {
                const wasPlaying = audio.isPlaying;
                if (wasPlaying) audio.stop();
                audio.offset = currentTime;
                if (wasPlaying) audio.play();
            }
        }
        lastCurrentTimeRef.current = currentTime;
    }, [currentTime, videoElement, audio]);

    // Handle play/pause - sync video and audio playback
    useEffect(() => {
        if (!videoElement || !audio) {
            return;
        }

        if (!readyForControl) {
            setReadyForControl(true);
        }

        const videoPlaying = !videoElement.paused && !videoElement.ended;
        if (isPlaying && !videoPlaying) {
            // Always reload video on mobile Safari to ensure fresh data
            const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            const needsReload = videoElement.readyState < 2 || (isSafari && videoElement.readyState < 4);
            
            const ensureVideoTexture = () => {
                if (!videoTextureRef.current) {
                    videoTextureRef.current = new VideoTexture(videoElement);
                }
                if (material && videoTextureRef.current) {
                    material.uniforms.iChannel0!.value = videoTextureRef.current;
                }
            };

            const playVideo = () => {
                // Ensure video src is set (Safari can lose it)
                if (!videoElement.src || videoElement.src === '') {
                    console.warn('Video src was lost, this should not happen');
                    return;
                }
                
                videoElement.play()
                    .then(() => {
                        // Switch from poster to video texture when playing
                        ensureVideoTexture();
                        // Sync and play audio
                        if (audio.isPlaying) audio.stop();
                        audio.offset = videoElement.currentTime;
                        audio.play();
                    })
                    .catch((err) => {
                        console.warn('Video play failed:', err);
                        // Retry with fresh load
                        videoElement.load();
                        videoElement.addEventListener('canplaythrough', () => {
                            videoElement.play()
                                .then(() => {
                                    ensureVideoTexture();
                                    if (audio.isPlaying) audio.stop();
                                    audio.offset = videoElement.currentTime;
                                    audio.play();
                                })
                                .catch(() => {});
                        }, { once: true });
                    });
            };

            if (needsReload) {
                // Video data may be stale, reload it
                videoElement.load();
                videoElement.addEventListener('canplaythrough', playVideo, { once: true });
            } else {
                playVideo();
            }
        } else if (!isPlaying && videoPlaying) {
            videoElement.pause();
            if (audio.isPlaying) audio.stop();
        }
    }, [isPlaying, videoElement, audio, material]);

    useEffect(() => {
        if (!audio) return;
        audio.setVolume(volume);
    }, [audio, volume]);

    // Update shader uniforms and sync currentTime to store
    useFrame(({ clock }) => {
        if (!meshRef.current) return;
        
        const mat = meshRef.current.material as ShaderMaterial;
        mat.uniforms.iTime!.value = clock.elapsedTime;

        // Force video texture to update each frame (critical for Safari)
        if (videoTextureRef.current && videoElement && !videoElement.paused) {
            videoTextureRef.current.needsUpdate = true;
        }

        if (analyserRef.current) {
            const data = analyserRef.current.getFrequencyData();
            mat.uniforms.bass!.value = getFrequencyRangeValue(frequencyRange.bass, data);
            mat.uniforms.mid!.value = getFrequencyRangeValue(frequencyRange.mid, data);
            mat.uniforms.treble!.value = getFrequencyRangeValue(frequencyRange.treble, data);
        }

        // Sync video currentTime to store for UI updates
        if (videoElement && Math.abs(videoElement.currentTime - lastCurrentTimeRef.current) > 0.5) {
            lastCurrentTimeRef.current = videoElement.currentTime;
            setCurrentTime(videoElement.currentTime);
        }
    });

    if (!geometry || !material) return null;

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            geometry={geometry}
            material={material}
        />
    );
}

function getFrequencyRangeValue(frequencyRange: number[], frequencyData: Uint8Array) {
    const nyquist = 48000 / 2;
    const lowIndex = Math.round(frequencyRange[0]! / nyquist * frequencyData.length);
    const highIndex = Math.round(frequencyRange[1]! / nyquist * frequencyData.length);
    let total = 0;
    let numFrequencies = 0;

    for (let i = lowIndex; i <= highIndex; i++) {
        total += frequencyData[i]!;
        numFrequencies += 1;
    }

    return total / numFrequencies / 255;
}
