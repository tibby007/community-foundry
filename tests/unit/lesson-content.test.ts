import { describe, expect, it } from "vitest";
import { buildFallbackLessonContent, LessonContentRequestSchema } from "@/lib/ai/lesson-content";
import { VideoCreateRequestSchema } from "@/lib/ai/video-contract";

describe("lesson production", () => {
  it("builds a complete, topic-specific lesson production pack", () => {
    const request = LessonContentRequestSchema.parse({
      communityName: "AI Agent Builder Lab",
      audience: "women over 50",
      transformation: "Build and launch a practical AI agent",
      moduleTitle: "AI Agent Fundamentals",
      lessonTitle: "Understand AI Agent Fundamentals",
    });
    const content = buildFallbackLessonContent(request);

    expect(content.manuscript.length).toBeGreaterThan(700);
    expect(content.keyPoints).toHaveLength(3);
    expect(content.exercise).toMatch(/AI Agent/i);
    expect(content.quiz).toHaveLength(3);
    expect(content.videoScript).toMatch(/women over 50/i);
    expect(content.imagePrompt).toMatch(/AI Agent Fundamentals/i);
    expect(content.videoPrompt).toMatch(/AI Agent Fundamentals/i);
  });

  it("accepts an explicit short video generation request", () => {
    expect(VideoCreateRequestSchema.safeParse({ prompt: "A polished lesson intro about AI agent fundamentals", seconds: "8" }).success).toBe(true);
    expect(VideoCreateRequestSchema.safeParse({ prompt: "short", seconds: "60" }).success).toBe(false);
  });
});
