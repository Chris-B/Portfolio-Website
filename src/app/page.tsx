"use client";

import { Button } from "@/components/ui/button"
import { AlertTriangle, MessageCircle, Box, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

/**
 * Home Component. Used as the landing page.
 * Describes the project and its features.
 * 
 * @returns Home Component
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-size-[64px_64px]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        {/* Header */}
        <header className="text-center mb-4">
          <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
            Welcome to the portfolio of
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4">
            <span className="text-foreground">Chris</span>{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              Barclay
            </span>
          </h1>
          <div className="w-24 h-1 bg-linaer-to-r from-primary to-secondary mx-auto rounded-full" />
        </header>

        {/* Main content card */}
        <div className="max-w-2xl w-full">
          <div className="bg-foreground/5 backdrop-blur-sm border border-foreground/10 rounded-2xl p-8 md:p-10">
            {/* Tags */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-full text-primary text-[9px] md:text-[11px] font-mono uppercase tracking-wider">
                Experimental
              </span>
              <span className="px-3 py-1 bg-secondary/10 border border-secondary/30 rounded-full text-secondary text-[9px] md:text-[11px] font-mono uppercase tracking-wider">
                React Three Fiber
              </span>
            </div>

            {/* Description */}
            <p className="text-sm md:text-lg text-foreground/80 leading-relaxed mb-8">
              This website is an experimental experience built with React Three Fiber,
              pushing the boundaries of what&apos;s possible in the browser.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Virtual Avatar</h3>
                  <p className="text-foreground/60 text-sm">
                    Chat with and interview a virtual version of myself. Ask questions
                    and learn about my work, skills, and experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Box className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Immersive 3D Experiences</h3>
                  <p className="text-foreground/60 text-sm">
                    Explore interactive 3D environments and discover unique ways
                    to engage with my portfolio content.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Evolving Experience</h3>
                  <p className="text-foreground/60 text-sm">
                    New features and experiences will be added over time.
                    Check back to see what&apos;s new.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-lg mb-6">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-yellow-500/90 text-sm">
                <span className="font-semibold">Performance Notice:</span> This experience
                uses advanced 3D graphics and may not operate smoothly on older devices
                or browsers.
              </p>
            </div>

            {/* CTA Button */}
            <Link href="/world" className="block">
              <Button
                size="lg"
                className="w-full bg-linear-to-r from-primary to-secondary hover:from-primary/80 hover:to-secondary/80 text-foreground font-semibold py-6 text-lg rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] group"
              >
                Enter the World
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}