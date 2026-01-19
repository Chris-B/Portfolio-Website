import { z } from "zod";

/**
 * Schema for mouth cues.
 * 
 * @property {number} start - The start time of the mouth cue.
 * @property {number} end - The end time of the mouth cue.
 * @property {string} value - The value of the mouth cue.
 */
export const MouthCueSchema = z.object({
  start: z.number(),
  end: z.number(),
  value: z.string(),
});

/**
 * Schema for lip sync data.
 * 
 * @property {MouthCueSchema[]} mouthCues - The mouth cues of the lip sync data.
 */
export const LipSyncDataSchema = z.object({
  mouthCues: z.array(MouthCueSchema),
});

/**
 * Schema for ask response.
 * 
 * @property {string} status - The status of the ask response. Can be 'success' or 'error'.
 * @property {string} text - The text of the ask response. Contains the response text if success, error message if error.
 * @property {string} audio_url - The url for the generated audio. Only present if success.
 * @property {LipSyncDataSchema} lip_sync_data - The generated lip sync data. Only present if success.
 */
export const AskResponseSchema = z.object({
  status: z.enum(['success', 'error']),
  text: z.string(),
  audio_url: z.string().optional(),
  lip_sync_data: LipSyncDataSchema.optional(),
});

export type AskResponse = z.infer<typeof AskResponseSchema>;

/**
 * Schema for ask request.
 * 
 * @property {string} question - The question that was asked.
 */
export const AskRequestSchema = z.object({
  question: z.string(),
});

export type AskRequest = z.infer<typeof AskRequestSchema>;