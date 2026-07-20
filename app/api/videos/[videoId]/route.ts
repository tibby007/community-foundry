import { getOpenAIClient } from "@/lib/ai/client";

export async function GET(_: Request, context: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await context.params;
  if (!/^[A-Za-z0-9_-]+$/.test(videoId) || !process.env.OPENAI_API_KEY) return Response.json({ error: "Video not available" }, { status: 404 });
  try { return Response.json(await getOpenAIClient().videos.retrieve(videoId)); }
  catch { return Response.json({ error: "Video not available" }, { status: 404 }); }
}
