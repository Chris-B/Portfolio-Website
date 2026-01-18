import { z } from "zod";

export const MouthCueSchema = z.object({
  start: z.number(),
  end: z.number(),
  value: z.string(),
});

export const LipSyncDataSchema = z.object({
  mouthCues: z.array(MouthCueSchema),
});

export const AskResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  text: z.string(),
  audio_url: z.string().optional(),
  lip_sync_data: LipSyncDataSchema.optional(),
});

export type AskResponse = z.infer<typeof AskResponseSchema>;

export const AskRequestSchema = z.object({
  question: z.string(),
});

export type AskRequest = z.infer<typeof AskRequestSchema>;