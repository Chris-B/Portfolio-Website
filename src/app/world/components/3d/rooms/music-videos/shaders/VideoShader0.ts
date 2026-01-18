'use client'

// https://github.com/r21nomi/webcam-audio-visualizer/blob/master/src/index2.js

import { Texture, ShaderMaterial, Vector3 } from 'three';

export default function VideoShader0(texture: Texture){
    return new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
        iTime: { value: 0 },
        iResolution:  { value: new Vector3(1, 1, 1) },

        bass: { value: 0.0 },
        mid: { value: 0.0 },
        treble: { value: 0.0 },

        colorInput: { value: new Vector3(0,0,0) },

        iChannel0: { value: texture }
    },
    vertexShader: `

    varying vec2 vUv;
    varying float vDepth;

    uniform float iTime;
    uniform sampler2D iChannel0;

    uniform float bass;
    uniform float mid;
    uniform float treble;


        void main() {
            vUv = uv;

            vec4 textureVideo = texture2D( iChannel0, vec2( vUv.x, vUv.y) );
            float gray = (textureVideo.r + textureVideo.g + textureVideo.b) / 3.0;
            vec3 pos = position;
            
            // Combine frequency bands
            float audioIntensity = bass * 0.7 + mid * 0.2 + treble * 0.1;
            
            // Invert: dark areas protrude, bright areas stay back
            // This creates a more natural depth map effect
            float invertedGray = 1.0 - gray;
            
            // Z displacement - darker = more depth
            float maxDepth = 250.0;
            pos.z = -invertedGray * invertedGray * audioIntensity * maxDepth;
            
            // Subtle noise for variation
            float noise = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
            pos.z -= noise * audioIntensity * 15.0;

            // Pass depth to fragment shader
            vDepth = pos.z;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );
            
            // Point size - use larger base so particles overlap and fill gaps at distance
            // Clamp minimum size so effect is visible from far away
            float baseSize = 25.0;
            float calculatedSize = baseSize / gl_Position.w;
            gl_PointSize = max(calculatedSize, 1.5);

        }
    `,
    fragmentShader: `
    #include <common>

    varying vec2 vUv;
    varying float vDepth;

    uniform vec3 iResolution;
    uniform float iTime;

    uniform float bass;
    uniform float mid;
    uniform float treble;
    uniform sampler2D iChannel0;

    uniform vec3 colorInput;

    void main() {
        vec4 textureVideo = texture2D( iChannel0, vec2( vUv.x, vUv.y) );
        vec3 color = textureVideo.rgb;
        
        // Subtle depth-based brightness - protruding particles slightly brighter
        float depthBoost = 1.0 + abs(vDepth) * 0.0005;
        color *= min(depthBoost, 1.3);
        
        // Square points for pixel-art look (no round shape)
        gl_FragColor = vec4(color, 1.0);
    }
    `
    });
}