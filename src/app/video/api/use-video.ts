import { useQuery } from "@tanstack/react-query";
import { VideoResponseSchema } from "~/app/video/schemas/video-schemas";

export function useVideoQuery(url: string) {
  return useQuery({
    queryKey: ["video", url],
    enabled: false,
    queryFn: async ({ queryKey }) => {
      const [, videoUrl] = queryKey as ["video", string];
      if (!videoUrl) {
        throw new Error("No video URL provided.");
      }

      const apiUrl = `/api/video?url=${encodeURIComponent(videoUrl)}`;
      const res = await fetch(apiUrl, { method: "GET" });

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.text ?? `Request failed: ${res.status}`);
      }

      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);

      return VideoResponseSchema.parse({ status: "success", url: objectUrl });
    },
  });
}