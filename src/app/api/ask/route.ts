import { NextResponse } from "next/server";
import { AskRequestSchema } from "../../dashboard/schemas/ask-schemas";

export async function POST(req: Request) {
  try {
    const base = process.env.API_ENDPOINT;
    if (!base) {
      return NextResponse.json(
        { status: "error", text: "API_ENDPOINT is not configured." },
        { status: 500 }
      );
    }

    const endpoint = "ask"

    const payload = AskRequestSchema.parse(await req.json());
    const url = `${base}/${endpoint}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => "");
      console.error("Ask upstream error:", { url, status: res.status, errorText });
      return NextResponse.json(
        {
          status: "error",
          text: `Upstream ask request failed (${res.status}).`,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ status: "success", ...await res.json() })

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const cause =
      error instanceof Error && "cause" in error && error.cause
        ? String(error.cause)
        : undefined;

    console.error("Ask API error:", { message, cause });
    return NextResponse.json(
      {
        status: "error",
        text: "Ask request failed.",
        debug: { message, cause },
      },
      { status: 502 }
    );
  }
}
