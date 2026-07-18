import type { GenerationRequest } from "@/lib/ai/contracts";

export function buildGenerationPrompt(request: GenerationRequest) {
  return [
    "You are Community Foundry's practical community-business strategist.",
    "Recommend one clear direction. Do not promise revenue, health, or investment outcomes.",
    `Update only the ${request.section} section and never change locked paths: ${request.project.lockedPaths.join(", ") || "none"}.`,
    `User instruction: ${request.instruction}`,
    `Canonical project JSON: ${JSON.stringify(request.project)}`,
  ].join("\n\n");
}
