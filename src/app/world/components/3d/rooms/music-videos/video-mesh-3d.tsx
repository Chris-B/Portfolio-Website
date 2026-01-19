'use client'

import { useEffect, useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { AudioListener, Audio, AudioAnalyser, VideoTexture, AudioLoader, PlaneGeometry, ShaderMaterial, Mesh, TextureLoader } from "three";
import { getMusicVideoStoreInstance, useMusicVideoStore } from "@/app/world/stores/music-videos-store";
import { useShallow } from "zustand/shallow";
import VideoMeshShader from "./shaders/VideoMeshShader";

/**
 * Load video element from source URL
 * Configured to work on all browsers including mobile.
 * 
 * @param videoSrc - Video source URL
 * @param posterSrc - Optional poster image source URL
 * @returns HTMLVideoElement
 */
function loadVideo(videoSrc: string, posterSrc?: string): HTMLVideoElement {
    const video = document.createElement("video");
    video.autoplay = false;
    video.muted = true;
    video.playsInline = true;
    video.loop = true;
    video.preload = "auto";
    video.crossOrigin = "anonymous";
    video.setAttribute('webkit-playsinline', 'true');
    if (posterSrc) video.poster = posterSrc;
    video.src = videoSrc;
    video.load();
    return video;
}

/**
 * Load audio buffer from source URL using three.js AudioLoader.
 * 
 * @param audioSrc - Audio source URL
 * @returns Promise<AudioBuffer>
 */
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

/**
 * Setup three.js audio and analyser from audio buffer.
 * 
 * @param audioBuffer - Audio buffer
 * @returns { audio: Audio, analyser: AudioAnalyser }
 */
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

/**
 * Props for VideoMesh3D component.
 */
type VideoMesh3DProps = {
    id: string;
    videoSrc: string;
    posterSrc?: string;
    position: [number, number, number];
    rotation: [number, number, number];
    scale: [number, number];
    subdivisions?: number;
}

/**
 * VideoMesh3D component.
 * The workhorse of the 3D music video room.
 * Handles the configuration and management of the video and audio elements, textures, and shader material.
 * 
 * @param id - The id of the video used for accessing the zustand store
 * @param videoSrc - The source url for the video
 * @param posterSrc - The source url for the poster image
 * @param position - The position of the video mesh
 * @param rotation - The rotation of the video mesh
 * @param scale - The scale of the video mesh
 * @param subdivisions - The number of subdivisions for the video mesh
 * @returns The VideoMesh3D component
 */
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

    /* Zustand store values for the managed video mesh. Accessed shallowly by id. */
    const [videoElement, videoLoaded, audioLoaded, audio, depthEffect, currentTime, isPlaying, volume, readyForControl] = useMusicVideoStore(id, useShallow((state) => [state.videoElement, state.videoLoaded, state.audioLoaded, state.audio, state.depthEffect, state.currentTime, state.isPlaying, state.volume, state.readyForControl]));
    const [setLoaded, setAudioLoaded, setVideoElement, setAudio, setCurrentTime, setReadyForControl, setIsPlaying] = useMusicVideoStore(id, useShallow((state) => [state.setLoaded, state.setAudioLoaded, state.setVideoElement, state.setAudio, state.setCurrentTime, state.setReadyForControl, state.setIsPlaying]));

    const lastCurrentTimeRef = useRef(currentTime);

    /* Load video on mount and set video element in zustand store. */
    useEffect(() => {
        if (!videoLoaded) {
            const video = loadVideo(videoSrc, posterSrc);
            if (video) {
                setVideoElement(video);
                setLoaded(true);
            }
        }
    }, [videoSrc, posterSrc, videoLoaded, setVideoElement, setLoaded]);

    /* Load audio asynchronously on mount(separate from video to avoid blocking) */
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

    /* Frequency ranges for audio analyser */
    const frequencyRange = {
        bass: [20, 140],
        lowMid: [140, 400],
        mid: [400, 2600],
        highMid: [2600, 5200],
        treble: [5200, 14000],
    };

    const analyserRef = useRef<AudioAnalyser | null>(null);
    const videoTextureRef = useRef<VideoTexture | null>(null);

    /* Load poster texture if available */
    const posterTexture = useMemo(() => {
        if (!posterSrc) return null;
        const loader = new TextureLoader();
        return loader.load(posterSrc);
    }, [posterSrc]);

    /* Create shader material and initial video texture. Texture is set to poster if available to lessen load time, otherwise video. */
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

    /* Update material depth effect when value in store changes */
    useEffect(() => {
        if (material) {
            material.uniforms.displacementScale!.value = depthEffect;
        }
    }, [material, depthEffect]);

    /* Store refs for cleanup */
    const audioRef = useRef(audio);
    const videoElementRef = useRef(videoElement);
    const posterTextureRefForCleanup = useRef(posterTexture);

    useEffect(() => { audioRef.current = audio; }, [audio]);
    useEffect(() => { videoElementRef.current = videoElement; }, [videoElement]);
    useEffect(() => { posterTextureRefForCleanup.current = posterTexture; }, [posterTexture]);

    /* Cleanup resources on unmount to avoid memory leaks */
    useEffect(() => {
        return () => {
            if (videoTextureRef.current) {
                videoTextureRef.current.dispose();
                videoTextureRef.current = null;
            }
            if (posterTextureRefForCleanup.current) {
                posterTextureRefForCleanup.current.dispose();
            }
            if (geometryRef.current) {
                geometryRef.current.dispose();
                geometryRef.current = null;
            }
            if (materialRef.current) {
                materialRef.current.dispose();
                materialRef.current = null;
            }
            if (audioRef.current) {
                if (audioRef.current.isPlaying) audioRef.current.stop();
                audioRef.current.disconnect();
            }
            if (videoElementRef.current) {
                videoElementRef.current.pause();
                videoElementRef.current.src = '';
                videoElementRef.current.load();
            }
            analyserRef.current = null;
        };
    }, []);

    /* Handle user seeking via slider. Only seek if currentTime changed from video controls (user dragging slider). */
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

    /**
    * Logic for handling video and audio playback. 
    * Hook is primarilytriggered by isPlaying state from zustand store. 
    * Fallback handling to ensure video and audio do not become stale.
    */
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
                                .catch(() => { });
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

    /* Pause on device rotation to prevent desync */
    useEffect(() => {
        if (!isPlaying) return;
        const pause = () => setIsPlaying(false);
        window.addEventListener('orientationchange', pause);
        return () => window.removeEventListener('orientationchange', pause);
    }, [isPlaying, setIsPlaying]);

    /* Update audio volume when value in store changes */
    useEffect(() => {
        if (!audio) return;
        audio.setVolume(volume);
    }, [audio, volume]);

    /* Update shader uniforms and update currentTime in the store for live UI updates */
    useFrame(({ clock }) => {
        if (!meshRef.current) return;

        const mat = meshRef.current.material as ShaderMaterial;
        mat.uniforms.iTime!.value = clock.elapsedTime;

        if (videoTextureRef.current && videoElement && !videoElement.paused) {
            videoTextureRef.current.needsUpdate = true;
        }

        if (analyserRef.current) {
            const data = analyserRef.current.getFrequencyData();
            mat.uniforms.bass!.value = getFrequencyRangeValue(frequencyRange.bass, data);
            mat.uniforms.mid!.value = getFrequencyRangeValue(frequencyRange.mid, data);
            mat.uniforms.treble!.value = getFrequencyRangeValue(frequencyRange.treble, data);
        }

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

/**
 * Helper function to calculate the average frequency value for a given range.
 * @param frequencyRange [low, high]
 * @param frequencyData 
 * @returns number - The average frequency value for the given range.
 */
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
