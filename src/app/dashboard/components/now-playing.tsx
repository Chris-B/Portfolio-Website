'use client'

import React, { useState } from "react";
import { Music } from 'lucide-react'
import { Progress } from "~/components/ui/progress"
import { api } from "~/trpc/react";
import { useCanvas } from "~/context/canvas-context";
import { Button } from "~/components/ui/button"

export default function NowPlayingCard() {
  const { isCanvasLoaded } = useCanvas()
  const song = api.spotify.getListening.useQuery(undefined, { refetchInterval: 2000 }).data
  const [isOpen, setIsOpen] = useState(false)

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isCanvasLoaded || !song?.item) {
    return null
  }

  return (
    <div className="fixed left-2 top-[15%] z-10 md:scale-100 scale-90">
      <Button
        className="md:hidden mb-2 bg-black/30 border border-purple-500 text-white hover:bg-black/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Spotify</span>
      </Button>
      <div
        className={`backdrop-blur-md w-36 md:w-40 mx-auto p-2 bg-black/30 border border-purple-500 rounded-lg shadow-lg text-white transition-all duration-300 ease-in-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}
          md:opacity-100 md:translate-y-0 md:pointer-events-auto`}
      >
        <div className="flex items-center mb-2">
          <Music className="w-3 h-3 mr-1 text-cyan-400" />
          <h2 className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            Now Playing
          </h2>
        </div>
        <div className="flex flex-col items-center mb-2">
          <img
            src={song.item.album.images[0].url}
            alt={`${song.item.album.name} cover`}
            className="w-20 h-20 md:w-24 md:h-24 rounded-md mb-2 border border-purple-500"
          />
          <div className="text-center w-full">
            <h3 className="text-[11px] md:text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 truncate">
              {song.item.name}
            </h3>
            <p className="text-[9px] md:text-[10px] text-gray-300 truncate">
              {song.item.artists.map((_artist) => _artist.name).join(", ")}
            </p>
            <p className="text-[9px] md:text-[10px] text-gray-400 truncate">{song.item.album.name}</p>
          </div>
        </div>
        <div className="mb-1">
          <Progress
            value={(song.progress_ms / song.item.duration_ms) * 100}
            className="h-1 bg-gray-700"
          />
        </div>
        <div className="flex justify-between text-[9px] md:text-[10px] text-gray-400">
          <span>{formatTime(song.progress_ms / 1000)}</span>
          <span>{formatTime(song.item.duration_ms / 1000)}</span>
        </div>
      </div>
    </div>
  );
}