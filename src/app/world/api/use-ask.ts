import { useMutation } from "@tanstack/react-query";
import { AskRequestSchema, AskResponseSchema } from "@/app/world/schemas/ask-schemas";

/**
 * TanStack React Query mutation hook for avatar Q&A ask api endpoint.
 * 
 * @returns AskResponseSchema 
 * {
 *  status: z.enum(['success', 'error']),
 *  text: z.string(),
 *  audio_url: z.string().optional(),
 *  lip_sync_data: LipSyncDataSchema.optional()
 * }
 */
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