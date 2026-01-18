'use client'

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"

const navItems = [
  { name: "Home", path: "/" },
  { name: "World", path: "/world" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  if (pathname === '/') return null

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/75 border-cyan-500/30 border backdrop-blur-xs">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-3xl font-bold text-transparent bg-clip-text bg-cyan-500 animate-pulse mr-2">
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
                    ? "text-cyan-500 border border-cyan-500 shadow-[0_0_10px_#22d3ee] bg-cyan-500/10"
                    : "text-cyan-500 border border-cyan-500/50 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_#22d3ee]"
                  }
                  rounded-md overflow-hidden
                  before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full
                  before:bg-cyan-500/10 before:opacity-0
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
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`
                  block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ease-in-out
                  ${pathname === item.path
                    ? "text-cyan-500 border border-cyan-500 shadow-[0_0_10px_#22d3ee] bg-cyan-500/10"
                    : "text-cyan-500 border border-cyan-500/20 hover:border-cyan-400 hover:text-cyan-400 hover:shadow-[0_0_15px_#22d3ee]"
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