'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "3D Music Video", path: "/video" },
  { name: "Projects", path: "/projects" },
  { name: "Experience", path: "/experience" },
]

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Chris Barclay
          </Link>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  relative px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out
                  ${pathname === item.path
                    ? "text-cyan-400 border border-cyan-400 shadow-[0_0_10px_#22d3ee] bg-cyan-400/10"
                    : "text-purple-300 border border-purple-500/50 hover:border-purple-400 hover:text-purple-400 hover:shadow-[0_0_15px_#a855f7]"
                  }
                  rounded-md overflow-hidden
                  before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full
                  before:bg-gradient-to-r before:from-purple-500/20 before:to-cyan-400/20 before:opacity-0
                  hover:before:opacity-100 before:transition-opacity before:duration-300
                `}
              >
                <span className="relative z-10">{item.name}</span>
              </Link>
            ))}
          </div>
          <button
            className="md:hidden text-cyan-400 hover:text-purple-400 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/30 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out
                  ${pathname === item.path
                    ? "text-cyan-400 bg-cyan-400/10 border border-cyan-400/50 shadow-[0_0_10px_#22d3ee]"
                    : "text-purple-300 hover:bg-purple-400/10 hover:text-purple-400 hover:border hover:border-purple-400/50 hover:shadow-[0_0_15px_#a855f7]"
                  }
                `}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}