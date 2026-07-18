import { GenerationRequestSchema } from "@/lib/ai/contracts";
import { generateWithFallback } from "@/lib/ai/provider";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = GenerationRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid generation request", issues: parsed.error.issues }, { status: 400 });
  }

  try {
    return Response.json(await generateWithFallback(parsed.data));
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Generation failed" }, { status: 422 });
  }
}
