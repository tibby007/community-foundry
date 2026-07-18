import { z } from "zod";
import { CommunityProjectSchema } from "@/domain/project-schema";

export const GenerationSectionSchema = z.enum([
  "foundation", "offer", "community", "classroom", "engagement", "promotion", "assessment",
]);

export const GenerationRequestSchema = z.object({
  project: CommunityProjectSchema,
  section: GenerationSectionSchema,
  instruction: z.string().min(3).max(500),
});

export const GenerationResponseSchema = z.object({
  proposal: z.object({
    id: z.string().min(1),
    section: GenerationSectionSchema,
    changes: z.array(z.object({
      path: z.string().min(1),
      value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
    })),
  }),
  explanation: z.string().min(1),
  confidence: z.number().min(0).max(1),
  warnings: z.array(z.string()),
  affectedScoreDimensions: z.array(z.string()),
  meta: z.object({ provider: z.enum(["openai", "fallback"]) }),
});

export type GenerationRequest = z.infer<typeof GenerationRequestSchema>;
export type GenerationResponse = z.infer<typeof GenerationResponseSchema>;
