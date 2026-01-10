import { Cpu, Database, Linkedin, Github, Mail } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm text-white py-1 z-10">
      <div className="container mx-auto px-2">
        <div className="flex justify-between items-center relative">
          <div className="w-1/3">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500/40 animate-pulse" />
          </div>
          <div className="flex items-center space-x-4 z-10">
            <Link href="https://www.linkedin.com/in/chris-barclay/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
              <Linkedin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="https://github.com/Chris-B" target="_blank" rel="noopener noreferrer" className="hover:text-purple-500 transition-colors">
              <Github className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href="mailto:chris@chrisbarclay.dev" className="hover:text-cyan-400 transition-colors">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
          <div className="w-1/3 flex justify-end items-center z-10">
            <h2 className="hidden sm:inline-block text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 animate-pulse mr-2">
              Data Dynamics LLC
            </h2>
            <Database className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400/40 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-cyan-400/5 pointer-events-none"></div>
    </footer>
  )
}