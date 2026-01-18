"use client";

/**
 * Loading Component. Used during suspense fallback.
 * 
 * @returns Loading Component
 */
export default function Loading() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Loading spinner */}
        <div className="relative mb-8">
          {/* Outer ring */}
          <div className="w-24 h-24 rounded-full border-2 border-foreground/10" />
          
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-transparent border-t-primary border-r-secondary animate-spin" />
          
          {/* Inner pulse */}
          <div className="absolute inset-4 rounded-full bg-linear-to-br from-primary/20 to-secondary/20 animate-pulse" />
        </div>

        {/* Loading text */}
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Initializing Experience
        </h2>

        <p className="text-foreground/50 text-sm font-mono tracking-wider mb-8">
          Loading assets...
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-foreground/10 rounded-full overflow-hidden">
          <div className="h-full w-full bg-linear-to-r from-primary to-secondary rounded-full animate-loading-bar" />
        </div>

        {/* Status text */}
        <p className="mt-8 text-foreground/30 text-xs font-mono">
          RENDERING 3D ENVIRONMENT
        </p>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </main>
  )
}