import { NextResponse } from "next/server";

/**
 * Handles GET requests to the /api/video endpoint.
 * Used for future video streamiing in the 3D music video room.
 * 
 * @param req - The request object containing the URL query parameter.
 * @returns A NextResponse object containing the JSON response {status, VideoResponseSchema} from the upstream video endpoint.
 */
export async function GET(req: Request) {
  try {
    const base = process.env.API_ENDPOINT;
    if (!base) {
      return NextResponse.json(
        { status: "error", text: "API_ENDPOINT is not configured." },
        { status: 500 }
      );
    }

    const endpoint = "video/stream"

    const { searchParams } = new URL(req.url);
    const payload = searchParams.get("url") as string;
    const url = `${base}/${endpoint}?url=${encodeURIComponent(payload)}`;

    const range = req.headers.get("range") ?? undefined;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "text/plain",
        ...(range ? { Range: range } : {}),
      },
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("Video upstream error:", { url, status: res.status, errorText });
      return NextResponse.json(
        {
          status: "error",
          text: `Upstream video request failed (${res.status}).`,
        },
        { status: 502 }
      );
    }

    if (!res.body) {
      return NextResponse.json(
        {
          status: "error",
          text: "Upstream video response had no body.",
        },
        { status: 502 }
      );
    }

    // Pass-through streaming response and key headers for browser playback/seeking.
    const headers = new Headers();
    const passthroughHeaders = [
      "content-type",
      "content-length",
      "accept-ranges",
      "content-range",
      "etag",
      "last-modified",
      "cache-control",
    ];
    for (const h of passthroughHeaders) {
      const v = res.headers.get(h);
      if (v) headers.set(h, v);
    }
    if (!headers.get("content-type")) {
      headers.set("content-type", "video/mp4");
    }

    return new Response(res.body, {
      status: res.status,
      headers,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cause =
      error instanceof Error && "cause" in error && error.cause
        ? String(error.cause)
        : undefined;

    console.error("Video API error:", { message, cause });
    return NextResponse.json(
      {
        status: "error",
        text: "Video request failed.",
        debug: { message, cause },
      },
      { status: 502 }
    );
  }
}
