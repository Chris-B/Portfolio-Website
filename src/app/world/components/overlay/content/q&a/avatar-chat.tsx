'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { useAvatarStore } from "@/app/world/stores/avatar-store"
import { useShallow } from 'zustand/shallow'
import { useAskMutation } from '@/app/world/api/use-ask'
import type { AskResponse } from '@/app/world/schemas/ask-schemas'
import { SuggestedQuestions } from '@/app/world/tables/world-tables'

/**
 * The avatar chat component for the Q&A room.
 * Calls the Ask API query endpoint to get responses from the avatar.
 * Features:
 * - Send messages to the avatar
 * - Receive responses from the avatar
 * - Suggested questions
 * - Stored state in zustand
 * 
 * @returns The avatar chat component.
 */
export default function AvatarChat({ref}: {ref: React.RefObject<HTMLDivElement | null>}) {
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const audioUnlockedRef = useRef(false)

  const [inputText, setInputText] = useState('')

  const [messages, setResponse, ensureAudio, addMessage] = useAvatarStore(useShallow((state) => [state.messages, state.setResponse, state.ensureAudio, state.addMessage]))

  const askMutation = useAskMutation()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const unlockAudio = () => {
    if (audioUnlockedRef.current) return

    const audio = ensureAudio()
    if (!audio) return

    try {
      audio.src = 'data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAACcQCA'
      audio.volume = 0
      audio.load()
      audio
        .play()
        .then(() => {
          audio.pause()
          audio.src = ""
          audio.load()
          audioUnlockedRef.current = true
        })
        .catch(() => {
        })
    } catch {
    }
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    unlockAudio()

    addMessage({ role: 'user', content: trimmed })
    setIsLoading(true)
    setInputText("")

    try {
      const response: AskResponse = await askMutation.mutateAsync(trimmed)

      if (response.status === 'error') {
        throw new Error(response.text)
      }

      setResponse(response)

      const assistantText = response.text?.trim() || "Sorry, I couldn't generate a response."
      addMessage({ role: 'assistant', content: assistantText })

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const cause =
          error instanceof Error && "cause" in error && error.cause
            ? String(error.cause)
            : undefined;
    
        console.error("Ask API error:", { message, cause });
        addMessage({ role: 'assistant', content: "Sorry — something went wrong while fetching the response." })
      } finally {
      setIsLoading(false)
    }
  }

  return (
    <div ref={ref} className="z-50 w-[92vw] transform md:w-[520px] pointer-events-auto">
      <div className="rounded-lg border border-primary/30 bg-background/80 p-3 text-foreground backdrop-blur-md">
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1 border-b border-foreground/30">
          {messages.length === 0 ? (
            <div className="text-sm text-foreground/70">
              Ask me anything about my experience, projects, or what I’m building.
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={
                  m.role === 'user'
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-primary/20 px-3 py-2 text-sm border border-foreground/40"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl bg-secondary/20 px-3 py-2 text-sm border border-foreground/40"
                }
              >
                {m.content}
              </div>
            ))
          )}
          {isLoading ? (
            <div className="mr-auto flex w-fit max-w-[85%] items-center gap-2 rounded-2xl bg-secondary/20 px-3 py-2 text-sm text-foreground/80 border border-foreground/40">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {SuggestedQuestions.map((q) => (
            <Button
              key={q}
              type="button"
              variant="secondary"
              className="h-7 rounded-full bg-foreground/5 px-3 text-xs text-foreground/80 hover:bg-foreground/10 border border-foreground/40"
              onClick={() => {
                void sendMessage(q)
              }}
              disabled={isLoading}
            >
              {q}
            </Button>
          ))}
        </div>

        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            void sendMessage(inputText)
          }}
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything…"
            disabled={isLoading}
            className="h-10 flex-1 border-primary/30 focus-visible:shadow-[0_0_10px_#22d3ee] focus-visible:border focus-visible:border-primary/60 focus-visible:ring-0 bg-background/30 text-foreground placeholder:text-foreground/50"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="h-10 bg-primary text-foreground hover:bg-primary/80"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}