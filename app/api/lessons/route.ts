import { generateLessonContent, LessonContentRequestSchema } from "@/lib/ai/lesson-content";

export async function POST(request: Request) {
  const parsed = LessonContentRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid lesson request" }, { status: 400 });
  return Response.json(await generateLessonContent(parsed.data));
}
