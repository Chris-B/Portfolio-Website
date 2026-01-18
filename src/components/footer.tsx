"use client"

import { Cpu, Database, Linkedin, Github, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/chris-barclay/",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://github.com/Chris-B",
      icon: Github,
      label: "GitHub",
    },
    {
      href: "mailto:chris@chrisbarclay.dev",
      icon: Mail,
      label: "Email",
    },
  ]

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50">
      {/* Top gradient line */}
      <div className="h-px bg-linear-to-r from-transparent via-primary to-transparent" />
      
      <div className="bg-background/80 backdrop-blur-md border-t border-foreground/5">
        <div className="container mx-auto px-4 py-0">
          <div className="flex justify-between items-center">
            {/* Left - Animated CPU */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Cpu className="w-6 h-6 text-primary" />
                <div className="absolute inset-0 animate-ping">
                  <Cpu className="w-6 h-6 text-primary/30" />
                </div>
              </div>
              <span className="hidden sm:block text-xs text-foreground/40 font-mono">
                {process.env.NEXT_PUBLIC_APP_VERSION}
              </span>
            </div>

            {/* Center - Social Links */}
            <div className="flex items-center gap-1">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="group relative p-2 rounded-lg transition-all duration-300 hover:bg-foreground/5"
                >
                  <link.icon className="w-5 h-5 text-foreground/60 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                  
                  {/* Tooltip */}
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground/10 backdrop-blur-sm rounded text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    {link.label}
                  </span>
                  
                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
                  
                  <span className="sr-only">{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Right - Company Branding */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-sm font-semibold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                Data Dynamics LLC
              </span>
              <div className="relative">
                <Database className="w-6 h-6 text-secondary" />
                <div className="absolute inset-0 animate-pulse">
                  <Database className="w-6 h-6 text-secondary/50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
