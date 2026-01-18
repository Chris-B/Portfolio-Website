'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * Header navigation items.
 * Routes
 * - Home
 * - World
 */
const navItems = [
  { name: "Home", path: "/" },
  { name: "World", path: "/world" },
]

/**
 * Header Component. Used as the header for the website.
 * Contains title and navigation items.
 * 
 * @returns Header Component
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* No header on home page */
  if (pathname != '/world') return null

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/90 backdrop-blur-md border-b border-foreground/10"
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-lg opacity-0 group-hover:opacity-75 blur transition-opacity duration-300" />
              <div className="relative flex items-center justify-center w-8 h-8 bg-background border border-foreground/20 rounded-lg group-hover:border-primary/50 transition-colors">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Chris Barclay
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="relative group px-4 py-2"
              >
                {/* Hover background */}
                <div className={`absolute inset-0 rounded-lg transition-all duration-300 ${
                  pathname === item.path
                    ? "bg-linear-to-r from-primary/20 to-secondary/20 border border-primary/50"
                    : "bg-transparent group-hover:bg-foreground/5 border border-transparent group-hover:border-foreground/10"
                }`} />
                
                {/* Active indicator */}
                {pathname === item.path && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-linear-to-r from-primary to-secondary rounded-full" />
                )}
                
                <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                  pathname === item.path
                    ? "text-primary"
                    : "text-foreground/70 group-hover:text-white"
                }`}>
                  {item.name}
                </span>
              </Link>
            ))}
            
          </div>
        </div>
      </div>
    </nav>
  )
}