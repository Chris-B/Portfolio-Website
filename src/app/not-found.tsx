"use client";

import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { FC } from "react"

const GridLine: FC<{ className: string }> = ({ className }) => (
  <div className={className}></div>
)

export default function NotFound() {
  const verticalLines = Array.from({ length: 6 }, (_, i) => (
    <GridLine key={`v-${i}`} className="h-full w-px bg-cyan-500/20" />
  ))

  const horizontalLines = Array.from({ length: 6 }, (_, i) => (
    <GridLine key={`h-${i}`} className="w-full h-px bg-cyan-500/20" />
  ))

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
      {/* Cyberpunk-inspired background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid lines */}
      <div className="absolute inset-0 z-10 grid grid-cols-6 gap-2 opacity-20">
        {verticalLines}
        {horizontalLines}
      </div>

      {/* 404 content */}
      <div className="z-20 text-center relative">
        <AlertTriangle className="w-24 h-24 text-yellow-500 mx-auto mb-6 animate-pulse" />
        <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 animate-pulse">
          404
        </h1>
        <h2 className="text-3xl font-bold mb-6 text-gray-300">Page Not Found</h2>
        <p className="text-xl text-gray-400 mb-8">The pathway you&apos;re seeking doesn&apos;t exist.</p>
        <Link href="/">
          <button className="group">
            <span className="sr-only">Return to Home</span>
            {'RETURN'.split('').map((letter, index) => (
              <span
                key={index}
                className="inline-block text-3xl font-bold transition-all duration-300 ease-in-out hover:text-cyan-400 group-hover:animate-float"
                style={{
                  textShadow: `
                    1px 1px 0 #8B5CF6,
                    2px 2px 0 #7C3AED,
                    3px 3px 0 #6D28D9,
                    4px 4px 0 #5B21B6,
                    5px 5px 0 #4C1D95,
                    6px 6px 10px rgba(0, 0, 0, 0.5)
                  `,
                  animation: `float 2s ease-in-out infinite ${index * 0.1}s`,
                  color: '#E5E7EB',
                }}
              >
                {letter}
              </span>
            ))}
          </button>
        </Link>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </main>
  )
}