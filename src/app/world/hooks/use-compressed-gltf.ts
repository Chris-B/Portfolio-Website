'use client'

import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { KTX2Loader } from 'three-stdlib'
import { useRef } from 'react'
import { WebGLRenderer } from 'three'

// Singleton KTX2Loader instance
let ktx2Loader: KTX2Loader | null = null

function getKTX2Loader(gl: WebGLRenderer): KTX2Loader {
    if (!ktx2Loader) {
        ktx2Loader = new KTX2Loader()
        ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.168.0/examples/jsm/libs/basis/')
        ktx2Loader.detectSupport(gl)
    }
    return ktx2Loader
}

/**
 * Custom hook for loading GLB files with KTX2 texture support.
 * Use this instead of useGLTF when your GLB has KTX2 compressed textures.
 */
export function useCompressedGLTF(url: string) {
    const { gl } = useThree()
    const loaderRef = useRef<KTX2Loader | null>(null)
    
    // Get or create the KTX2 loader
    if (!loaderRef.current) {
        loaderRef.current = getKTX2Loader(gl)
    }
    
    // Load GLTF with KTX2 support via extendLoader callback
    const gltf = useGLTF(url, true, true, (loader) => {
        loader.setKTX2Loader(loaderRef.current!)
    })
    
    return gltf
}

// Preload function for compressed GLTFs
export function preloadCompressedGLTF(url: string) {
    // Note: preload can't use KTX2 loader since we don't have gl context
    // The actual load with KTX2 will happen when the component mounts
    useGLTF.preload(url, true, true, (loader) => {
        
    })
}
