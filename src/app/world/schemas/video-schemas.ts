import { z } from "zod";

/**
 * Schema for video response.
 * 
 * @property {string} status - The status of the video response. Can be 'success' or 'error'.
 * @property {string} url - The url for the generated video/blob.
 */
export const VideoResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  url: z.string().min(1),
});

export type VideoResponse = z.infer<typeof VideoResponseSchema>;
