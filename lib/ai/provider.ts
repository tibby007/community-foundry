import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAIClient } from "@/lib/ai/client";
import { GenerationResponseSchema, type GenerationRequest, type GenerationResponse } from "@/lib/ai/contracts";
import { buildGenerationPrompt } from "@/lib/ai/prompts";

export interface GenerationProvider {
  generate(request: GenerationRequest): Promise<GenerationResponse>;
}

export async function settleWithin<T>(promise: Promise<T>, milliseconds: number): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error("AI generation timed out")), milliseconds);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export const fallbackProvider: GenerationProvider = {
  async generate(request) {
    const { project } = request;
    const changesBySection: Partial<Record<GenerationRequest["section"], Array<{ path: string; value: string }>>> = {
      foundation: [
        { path: "foundation.promise", value: `${project.foundation.promise.replace(/[.]$/, "")} Members complete their first visible milestone within 30 days.` },
        { path: "foundation.differentiator", value: `${project.foundation.differentiator.replace(/[.]$/, "")} Every member leaves each stage with something built, tested, or published.` },
      ],
      offer: [
        { path: "offer.rationale", value: `Members pay for a faster path to ${project.foundation.transformation.toLowerCase()}, direct feedback, and accountability that free information cannot provide.` },
        { path: "offer.foundingOffer", value: `Invite the first 25 members into ${project.foundation.name} at the founding rate, with a kickoff build session and locked-in pricing.` },
      ],
      community: [
        { path: "community.startHere", value: `Welcome to ${project.foundation.name}. Introduce yourself, choose one 30-day outcome, and complete the first classroom action.` },
        { path: "community.introductionPrompt", value: `What do you want to complete in the next 30 days, what is blocking you now, and what experience can you share with another member?` },
      ],
      classroom: [
        { path: "classroom.title", value: `${project.foundation.name} Implementation Roadmap` },
        { path: "classroom.transformation", value: `${project.foundation.transformation}. Each module ends with a concrete member deliverable.` },
      ],
      engagement: [
        { path: "engagement.firstDay", value: `Post an introduction, choose one 30-day build goal, and complete the first quick-win action.` },
        { path: "engagement.challenge", value: `Complete the seven-day build momentum sprint and share a working result with the community.` },
      ],
      promotion: [
        { path: "promotion.leadMagnet", value: `The ${project.foundation.name} 30-Day Quick-Start Planner` },
        { path: "promotion.referralCampaign", value: `Invite one qualified peer. When they join, both members receive a bonus group implementation clinic.` },
      ],
    };
    return GenerationResponseSchema.parse({
      proposal: {
        id: `fallback-${request.section}`,
        section: request.section,
        changes: changesBySection[request.section] ?? [],
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
    }, { timeout: 7_000 });
    if (!response.output_parsed) throw new Error("The model returned no structured proposal.");
    return GenerationResponseSchema.parse({ ...response.output_parsed, meta: { provider: "openai" } });
  },
};

export async function generateWithFallback(request: GenerationRequest) {
  if (process.env.DEMO_FALLBACK === "true" || !process.env.OPENAI_API_KEY) return fallbackProvider.generate(request);
  try {
    return await settleWithin(openAIProvider.generate(request), 8_000);
  } catch {
    return fallbackProvider.generate(request);
  }
}
