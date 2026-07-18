import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "@/lib/ai/client";
import { GenerationResponseSchema, type GenerationRequest, type GenerationResponse } from "@/lib/ai/contracts";
import { buildGenerationPrompt } from "@/lib/ai/prompts";

export interface GenerationProvider {
  generate(request: GenerationRequest): Promise<GenerationResponse>;
}

export const fallbackProvider: GenerationProvider = {
  async generate(request) {
    const foundationChanges = [
      { path: "foundation.name", value: "The Second Act Consulting Lab" },
      { path: "foundation.promise", value: "Turn your corporate experience into a focused consulting offer and land your first five clients." },
    ];
    return GenerationResponseSchema.parse({
      proposal: {
        id: `fallback-${request.section}`,
        section: request.section,
        changes: request.section === "foundation" ? foundationChanges : [],
      },
      explanation: "This recommendation makes the outcome specific, measurable, and easier for a prospective member to understand.",
      confidence: 0.9,
      warnings: [],
      affectedScoreDimensions: ["transformationClarity", "audienceSpecificity"],
      meta: { provider: "fallback" },
    });
  },
};

export const openAIProvider: GenerationProvider = {
  async generate(request) {
    const response = await getOpenAIClient().responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-5.4",
      input: buildGenerationPrompt(request),
      text: { format: zodTextFormat(GenerationResponseSchema, "community_proposal") },
    }, { timeout: 20_000 });
    if (!response.output_parsed) throw new Error("The model returned no structured proposal.");
    return GenerationResponseSchema.parse({ ...response.output_parsed, meta: { provider: "openai" } });
  },
};

export async function generateWithFallback(request: GenerationRequest) {
  if (process.env.DEMO_FALLBACK === "true" || !process.env.OPENAI_API_KEY) return fallbackProvider.generate(request);
  try {
    return await openAIProvider.generate(request);
  } catch {
    return fallbackProvider.generate(request);
  }
}
