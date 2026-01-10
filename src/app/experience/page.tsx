'use client'

import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card"

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
}

const experiences: Experience[] = [
  {
    id: 1,
    title: "Data Solutions & Event Planning",
    company: "Ethos Veterinary Health - Community Team",
    period: "2021 - Present",
    description: [
      "Design and create project management solutions within Smartsheet",
      "Workspaces for data management including advanced spreadsheets, reports, and dashboards",
      "Data Entry, Advanced Formulas, Cross-Sheet References, Pivot Tables, Calendar App",
      "Program and retreat registrations using Cvent/Smartsheet",
      "Rooming lists, hotel communications, attendee assistance",
    ]
  },
  {
    id: 2,
    title: "Freelance Developer",
    company: "Data Dynamics LLC",
    period: "2015 - Present",
    description: [
      "Various small scale projects ranging from games to web development",
    ]
  },
]

function ExperienceCard({ experience }: { experience: Experience }) {
  return (
    <Card className="w-full bg-black/80 text-white border border-purple-500 hover:border-cyan-400 transition-colors">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
          {experience.title}
        </CardTitle>
        <CardDescription className="text-gray-300">
          {experience.company} | {experience.period}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc list-inside text-gray-300">
          {experience.description.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function ExperiencePage() {

  return (
    <div className="min-h-screen bg-black text-white  pt-20 pb-20 px-5">
      <h1 className="text-4xl font-bold mb-8 text-center text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">
        Experience
      </h1>

      <div className="space-y-8">
        {experiences.map(experience => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </div>
    </div>
  )
}