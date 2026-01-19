'use client'

import { Texture, ShaderMaterial, DoubleSide } from 'three';

/**
 * Creates a displacement shader material for a 3D video mesh.
 * Used in the 3D music video room.
 * 
 * The shader renders the video through a custom material that adds time-based 
 * and audio-reactive distortion and uses the video’s luminance as a displacement 
 * map to create a 3D depth effect on the screen surface.
 * 
 * @param texture - The video texture to be used in the shader.
 * @returns A shader material for the video mesh.
 */
export default function VideoMeshShader(texture: Texture) {
    return new ShaderMaterial({
        side: DoubleSide,
        uniforms: {
            iTime: { value: 0 },
            bass: { value: 0.0 },
            mid: { value: 0.0 },
            treble: { value: 0.0 },
            iChannel0: { value: texture },
            displacementScale: { value: 0.3 }
        },
        vertexShader: `
            varying vec2 vUv;
            varying float vDisplacement;

            uniform float iTime;
            uniform sampler2D iChannel0;
            uniform float bass;
            uniform float mid;
            uniform float treble;
            uniform float displacementScale;

            void main() {
                vUv = uv;

                vec4 textureVideo = texture2D(iChannel0, uv);
                float gray = dot(textureVideo.rgb, vec3(0.299, 0.587, 0.114));
                
                // Edge detection - sample neighbors
                float texelX = 1.0 / 1920.0;
                float texelY = 1.0 / 1080.0;
                float grayL = dot(texture2D(iChannel0, uv + vec2(-texelX, 0.0)).rgb, vec3(0.333));
                float grayR = dot(texture2D(iChannel0, uv + vec2(texelX, 0.0)).rgb, vec3(0.333));
                float grayU = dot(texture2D(iChannel0, uv + vec2(0.0, -texelY)).rgb, vec3(0.333));
                float grayD = dot(texture2D(iChannel0, uv + vec2(0.0, texelY)).rgb, vec3(0.333));
                float edge = abs(grayL - grayR) + abs(grayU - grayD);
                
                // Audio intensity from frequency bands
                float audioIntensity = bass * 0.7 + mid * 0.2 + treble * 0.1;
                
                // Depth based on distance from mid-gray (0.5)
                // Both bright AND dark pop forward, mid-tones stay back
                // But bright pops MORE than dark
                float contrast = abs(gray - 0.5) * 2.0;
                float brightBias = gray * 0.5; // Extra push for bright areas
                float depthFactor = contrast + brightBias;
                
                // Base displacement always present (even without audio)
                float baseDisplacement = depthFactor * 0.15 + edge * 0.25;
                
                // Audio-reactive displacement
                float audioDisplacement = depthFactor * audioIntensity * 1.2 + edge * audioIntensity * 1.5;
                
                // Combine with scale
                float displacement = (baseDisplacement + audioDisplacement) * displacementScale;
                
                // Add subtle time variation
                displacement += sin(iTime * 2.0 + gray * 6.28) * audioIntensity * 0.03;
                
                // Displace along normal (Z axis for a plane)
                vec3 pos = position;
                pos.z += displacement;
                
                vDisplacement = displacement;

                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            varying float vDisplacement;

            uniform sampler2D iChannel0;
            uniform float bass;

            void main() {
                vec4 textureVideo = texture2D(iChannel0, vUv);
                vec3 color = textureVideo.rgb;
                
                // Subtle brightness boost on displaced areas
                float boost = 1.0 + vDisplacement * 0.5;
                color *= min(boost, 1.2);
                
                gl_FragColor = vec4(color, 1.0);
            }
        `
    });
}
