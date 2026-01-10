'use client'

import React, { useState } from 'react'
import { Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from "~/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card"

interface Project {
  id: number;
  name: string;
  description: string;
  github: string;
  live: string;
  writeup: string;
  technologies: string[];
}

const projects: Project[] = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "My personal website showcasing my software engineering skills",
    github: "https://github.com/Chris-B/Portfolio-Website",
    live: "https://chrisbarclay.dev",
    writeup: "This project was an exploration into creating immersive web experiences using React Three Fiber.\nThe goal was to showcase my portfolio in a unique, cyberpunk-themed 3D environment.\nI faced challenges in creating intuitive user interactions within a 3D space. To overcome this, I designed a hybrid 2D/3D UI for better usability.\nThe projects and experience pages are standard 2D web UI.",
    technologies: ["Next.JS", "TypeScript", "Tailwind CSS", "ShadCN", "Three.js", "React Three Fiber", "tRPC", "Zustand"]
  },
  {
    id: 2,
    name: "AutoRune",
    description: "AutoRune is an OldSchool RuneScape automation platform developed mostly in Kotlin",
    github: "https://github.com/AutoRune-OSRS",
    live: "",
    writeup: "The client is the 'brain' of the whole platform. Responsible for running instances of the injected gamepacks as well as user created scripts and relaying the status of them. The client also communicates from the remote dashboard.\n\nThe dashboard is a web app designed to communicate remotely with the AutoRune client. It creates a socket connection and can send commands and monitor the status of the client and the individual instances.\n\nThe management repository contains all of the modules that only the developers and maintainers would ever have knowledge of. It contains everything needed to update AutoRune after an OSRS revision change including hooks, api generation, injected gamepack creation, and the ability to add mixins.\n\nThe utilities repository contains tilities and helpers used across multiple AutoRune modules. Contains things such as ASM extensions, file system utilities, and client specific resources.\n\nThe scripting api exposes everything needed to create osrs scripts to the platform users. It is a simplification and extension of the actual osrs api which is generated from the hooks and mixins.",
    technologies: ["Java", "Kotlin", "React", "Redux", "Thunk"]
  },
  {
    id: 3,
    name: "Farmer John AI",
    description: "FarmerBot is an AI agent designed to assist in farm maintenance by efficiently planting and harvesting crops, allowing Farmer John to enjoy more leisure time.",
    github: "https://github.com/Chris-B/Farmer-John",
    live: "https://chris-b.github.io/",
    writeup: "The project aims to develop an AI agent, FarmerBot, to assist Farmer John with farm maintenance by efficiently planting and harvesting crops, targeting a state value of over 700. Utilizing a Dueling Double Deep Q Network for pathfinding and a simple neural network for decision-making, FarmerBot learns through experience replay and a reward system that encourages optimal navigation and planting choices. Evaluation metrics include pathfinding success rates, decision-making accuracy (with 95% success in top predictions), and productivity measures like path optimality and state value. Results show that the best-performing agent exceeded the target state value, demonstrating effective navigation and decision-making, thereby allowing Farmer John to enjoy more leisure time while FarmerBot supports his farm for years to come.",
    technologies: ["Python", "Malmo", "Neural Networks",]
  },
  {
    id: 4,
    name: "Virtual Memory System",
    description: "A virtual memory system (VM) utilizing segmentation and paging.",
    github: "https://github.com/Chris-B/Virtual-Memory-System",
    live: "",
    writeup: "TThis project implements a virtual memory system (VM) using segmentation and paging. The system manages the necessary segment and page tables in a simulated main memory. It accepts virtual addresses and translates them into physical addresses according to the current contents of the segment and page tables. The system also utilizes a translation look-aside buffer (TLB) to make the translation process more efficient.",
    technologies: ["Java",]
  },
]

function ProjectCard({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="w-full bg-black/80 text-white border border-purple-500 hover:border-cyan-400 transition-colors">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
          {project.name}
        </CardTitle>
        <CardDescription className="text-md text-gray-300">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2">Technologies Used:</h4>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-purple-800 text-white text-sm rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
          <h4 className="text-lg font-semibold mb-2">Project Details:</h4>
          <p className="text-gray-300 whitespace-pre-wrap">{project.writeup}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700
                       text-white border border-transparent transition-all duration-300 ease-in-out
                       hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] focus:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
            asChild
          >
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </a>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700
                       text-white border border-transparent transition-all duration-300 ease-in-out
                       hover:shadow-[0_0_15px_rgba(139,92,246,0.5)] focus:shadow-[0_0_20px_rgba(139,92,246,0.7)]"
            asChild
          >
            <a href={project.live} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Live Demo
            </a>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-cyan-400 hover:text-purple-400 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4 mr-2" />
              Less Info
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4 mr-2" />
              More Info
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function Home() {

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20 px-5">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
        Projects
      </h1>
      <div className="space-y-8">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}