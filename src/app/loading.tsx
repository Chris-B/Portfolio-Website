'use client'

import { Loader2 } from "lucide-react"

const GridLine: React.FC<{ className: string }> = ({ className }) => (
  <div className={className}></div>
)

export default function Loading() {
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

      {/* Loading content */}
      <div className="z-20 text-center relative">
        <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500 animate-pulse">
          Initializing...
        </h2>
        <Loader2 className="w-16 h-16 animate-spin text-cyan-500 mx-auto" />
        <p className="mt-4 text-lg text-gray-300">Accessing the cybernet...</p>
      </div>

      {/* Keyframe animations */}
      <style jsx>{`
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