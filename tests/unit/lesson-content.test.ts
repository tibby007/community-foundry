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

  it("uses the community brand in lesson media prompts without purple leakage", () => {
    const content = buildFallbackLessonContent(LessonContentRequestSchema.parse({
      communityName: "Beautiful Gardens Creator Lab",
      audience: "women over 40",
      transformation: "Create a beautiful garden",
      moduleTitle: "Garden Foundations",
      lessonTitle: "Plan Your First Garden Bed",
      brandDirection: "warm",
      palette: ["#2F3B2E", "#A65232", "#D8A65A", "#FAF3E7"],
    }));
    expect(content.imagePrompt).toContain("#A65232");
    expect(content.videoPrompt).toMatch(/warm/i);
    expect(`${content.imagePrompt} ${content.videoPrompt}`).not.toMatch(/violet|purple|7657FF/i);
  });

  it("writes the actual lesson instead of a generic business-build script", () => {
    const content = buildFallbackLessonContent(LessonContentRequestSchema.parse({
      communityName: "Gardening Club",
      audience: "gardening club members",
      transformation: "Grow skills, complete garden projects, and share progress together",
      moduleTitle: "Gardening Essentials",
      lessonTitle: "Choose the Right Place for Your First Garden Project",
      brandDirection: "warm",
      palette: ["#2F3B2E", "#A65232", "#D8A65A", "#FAF3E7"],
    }));
    const lessonText = `${content.objective} ${content.manuscript} ${content.example} ${content.exercise} ${content.worksheet}`;

    expect(lessonText).toMatch(/first garden project/i);
    expect(lessonText).toMatch(/conditions|space|resources|constraints/i);
    expect(lessonText).not.toMatch(/person, problem, input|tools or features|smallest working version|use-case/i);
  });

  it("changes the teaching approach to match each lesson stage", () => {
    const base = {
      communityName: "Gardening Club",
      audience: "gardening club members",
      transformation: "Complete garden projects and share progress together",
      brandDirection: "warm" as const,
      palette: ["#2F3B2E", "#A65232", "#D8A65A", "#FAF3E7"],
    };
    const welcome = buildFallbackLessonContent(LessonContentRequestSchema.parse({ ...base, moduleTitle: "Welcome to the Gardening Community", lessonTitle: "Meet the Gardening Community" }));
    const plan = buildFallbackLessonContent(LessonContentRequestSchema.parse({ ...base, moduleTitle: "Plan Your First Gardening Project", lessonTitle: "Create Your Step-by-Step Gardening Plan" }));

    expect(`${welcome.manuscript} ${welcome.exercise} ${welcome.worksheet}`).toMatch(/introduction|community norms|support/i);
    expect(`${welcome.exercise} ${welcome.worksheet}`).not.toMatch(/conditions|resources|materials|space/i);
    expect(`${plan.manuscript} ${plan.exercise} ${plan.worksheet}`).toMatch(/sequence|timeline|checkpoint|step/i);
  });
});
