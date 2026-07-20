import { getOpenAIClient } from "@/lib/ai/client";

export async function GET(_: Request, context: { params: Promise<{ videoId: string }> }) {
  const { videoId } = await context.params;
  if (!/^[A-Za-z0-9_-]+$/.test(videoId) || !process.env.OPENAI_API_KEY) return Response.json({ error: "Video not available" }, { status: 404 });
  try {
    const content = await getOpenAIClient().videos.downloadContent(videoId);
    return new Response(await content.arrayBuffer(), { headers: { "Content-Type": "video/mp4", "Content-Disposition": `attachment; filename="lesson-${videoId}.mp4"` } });
  } catch { return Response.json({ error: "Video not ready" }, { status: 409 }); }
}
