import { getOpenAIClient } from "@/lib/ai/client";
import { VideoCreateRequestSchema } from "@/lib/ai/video-contract";

export async function POST(request: Request) {
  const parsed = VideoCreateRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid video request" }, { status: 400 });
  if (!process.env.OPENAI_API_KEY || process.env.DEMO_FALLBACK === "true") {
    return Response.json({ id: null, status: "script_ready", provider: "fallback", message: "Video production pack ready. Connect supported video access to render the clip." });
  }
  try {
    const video = await getOpenAIClient().videos.create({ model: process.env.OPENAI_VIDEO_MODEL ?? "sora-2", prompt: parsed.data.prompt, seconds: parsed.data.seconds, size: "1280x720" }, { timeout: 20_000 });
    return Response.json({ id: video.id, status: video.status, progress: video.progress, provider: "openai" });
  } catch {
    return Response.json({ id: null, status: "script_ready", provider: "fallback", message: "The lesson and video script are ready. Video rendering is unavailable for this account." });
  }
}
