import { useMutation } from "@tanstack/react-query";
import { AskRequestSchema, AskResponseSchema } from "@/app/world/schemas/ask-schemas";

export function useAskMutation() {
  return useMutation({
    mutationKey: ["ask"],
    mutationFn: async (question: string) => {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(AskRequestSchema.parse({ question })),
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(json?.text ?? `Request failed: ${res.status}`);
      }
      return AskResponseSchema.parse(json);
    },
  });
}