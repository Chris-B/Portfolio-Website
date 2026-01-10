import { createTRPCRouter, publicProcedure } from '~/server/api/trpc';
import { z } from 'zod';

export const videoRouter = createTRPCRouter({
  getVideoStream: publicProcedure
    .input(z.object({ url: z.string().url() }))
    .query(({ input }) => {
      const { url } = input;
      return { videoUrl: `${process.env.VIDEO_API_ENDPOINT}?url=${encodeURIComponent(url)}` };
    }),
});