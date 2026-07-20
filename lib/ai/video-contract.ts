import { z } from "zod";

export const VideoCreateRequestSchema = z.object({
  prompt: z.string().min(20).max(2000),
  seconds: z.enum(["4", "8", "12"]).default("8"),
});

export type VideoCreateRequest = z.infer<typeof VideoCreateRequestSchema>;
