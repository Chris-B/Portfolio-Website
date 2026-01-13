'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Loader2, Send } from "lucide-react"
import { useAvatarStore } from "~/app/dashboard/stores/avatar-store"

import { useCanvas } from '~/context/canvas-context'
import { useAskMutation } from '~/app/dashboard/api/use-ask'
import type { AskResponse } from '~/app/dashboard/schemas/ask-schemas'

export default function AvatarControls() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const [inputText, setInputText] = useState('')

  const { isCanvasLoaded } = useCanvas()

  const { setResponse } = useAvatarStore((state) => state)

  const askMutation = useAskMutation()

  const suggestedQuestions = useMemo(
    () => [
      "What kind of software do you build?",
      "What tech stack do you use most?",
      "What is your current job?",
      "What are your thoughts on golfing?",
    ],
    []
  )

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    setMessages((prev) => [...prev, { role: 'user', content: trimmed }])
    setIsLoading(true)
    setInputText("")

    try {
      const response: AskResponse = await askMutation.mutateAsync(trimmed)

      if (response.status === 'error') {
        throw new Error(response.text)
      }

      setResponse(response)

      const assistantText = response.text?.trim() || "Sorry, I couldn't generate a response."
      setMessages((prev) => [...prev, { role: 'assistant', content: assistantText }])

    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const cause =
          error instanceof Error && "cause" in error && error.cause
            ? String(error.cause)
            : undefined;
    
        console.error("Ask API error:", { message, cause });
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: "Sorry — something went wrong while fetching the response." },
        ])
      } finally {
      setIsLoading(false)
    }
  }

  if (!isCanvasLoaded) {
    return null
  }

  return (
    <div className="fixed left-1/2 bottom-[5%] z-50 w-[92vw] -translate-x-1/2 transform md:w-[520px]">
      <div className="rounded-lg border border-purple-500/30 bg-black/40 p-3 text-white backdrop-blur-md">
        <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="text-sm text-white/70">
              Ask me anything about my experience, projects, or what I’m building.
            </div>
          ) : (
            messages.map((m, idx) => (
              <div
                key={`${m.role}-${idx}`}
                className={
                  m.role === 'user'
                    ? "ml-auto w-fit max-w-[85%] rounded-2xl bg-cyan-600/20 px-3 py-2 text-sm"
                    : "mr-auto w-fit max-w-[85%] rounded-2xl bg-purple-600/20 px-3 py-2 text-sm"
                }
              >
                {m.content}
              </div>
            ))
          )}
          {isLoading ? (
            <div className="mr-auto flex w-fit max-w-[85%] items-center gap-2 rounded-2xl bg-purple-600/20 px-3 py-2 text-sm text-white/80">
              <Loader2 className="h-4 w-4 animate-spin" />
              Thinking…
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <Button
              key={q}
              type="button"
              variant="secondary"
              className="h-7 rounded-full bg-white/5 px-3 text-xs text-white/80 hover:bg-white/10"
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
            className="h-10 flex-1 border-purple-500/30 bg-black/30 text-white placeholder:text-white/50"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="h-10 bg-cyan-600 text-white hover:bg-cyan-700"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}