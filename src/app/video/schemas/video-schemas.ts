import { z } from "zod";

export const VideoResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  url: z.string().min(1),
  text: z.string().optional(),
  debug: z.unknown().optional(),
});

export type VideoResponse = z.infer<typeof VideoResponseSchema>;
