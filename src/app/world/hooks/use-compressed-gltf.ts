'use client'

import { useGLTF } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { KTX2Loader } from 'three-stdlib'
import { useRef } from 'react'
import { WebGLRenderer } from 'three'

/* Singleton KTX2Loader instance */
let ktx2Loader: KTX2Loader | null = null

/**
 * Returns a KTX2Loader instance.
 * If the instance doesn't exist, it creates one and configures it.
 */
function getKTX2Loader(gl: WebGLRenderer): KTX2Loader {
    if (!ktx2Loader) {
        ktx2Loader = new KTX2Loader()
        ktx2Loader.setTranscoderPath('https://unpkg.com/three@0.168.0/examples/jsm/libs/basis/')
        ktx2Loader.detectSupport(gl)
    }
    return ktx2Loader
}

/**
 * Hook for loading GLB files with KTX2 texture support.
 * 
 * @param {string} url - The URL of the GLB file to load.
 * @returns The loaded GLTF result.
 */
export function useCompressedGLTF(url: string) {
    const { gl } = useThree()
    const loaderRef = useRef<KTX2Loader | null>(null)
    
    if (!loaderRef.current) {
        loaderRef.current = getKTX2Loader(gl)
    }
    
    const gltf = useGLTF(url, true, true, (loader) => {
        loader.setKTX2Loader(loaderRef.current!)
    })
    
    return gltf
}
