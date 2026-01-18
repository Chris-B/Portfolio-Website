"use client";

import { Button } from "@/components/ui/button"
import { ArrowLeft, Ghost } from "lucide-react"
import Link from "next/link"

/**
 * 404 Component. Used when a page is not found.
 * 
 * @returns 404 Component
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Ghost icon */}
        <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-full mb-8">
          <Ghost className="w-16 h-16 text-secondary" />
        </div>

        {/* 404 text */}
        <h1 className="text-8xl md:text-9xl font-bold tracking-tighter mb-4">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
            404
          </span>
        </h1>

        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
          Lost in the Void
        </h2>

        <p className="text-foreground/60 text-center max-w-md mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist in this world. 
        </p>

        {/* Decorative line */}
        <div className="w-24 h-1 bg-linear-to-r from-primary to-secondary rounded-full mb-8" />

        {/* Back button */}
        <Link href="/">
          <Button
            size="lg"
            className="bg-foreground/5 border border-foreground/20 hover:bg-foreground/10 text-foreground font-semibold px-8 py-6 rounded-xl transition-all duration-300 hover:border-primary/50 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  )
}