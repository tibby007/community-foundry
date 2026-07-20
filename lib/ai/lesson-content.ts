import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";
import { getOpenAIClient } from "@/lib/ai/client";
import { settleWithin } from "@/lib/ai/provider";

export const LessonContentRequestSchema = z.object({
  communityName: z.string().min(2).max(160),
  audience: z.string().min(2).max(300),
  transformation: z.string().min(4).max(500),
  moduleTitle: z.string().min(2).max(160),
  lessonTitle: z.string().min(2).max(160),
});

export const LessonContentSchema = z.object({
  objective: z.string().min(20),
  manuscript: z.string().min(500),
  keyPoints: z.array(z.string().min(10)).length(3),
  example: z.string().min(80),
  exercise: z.string().min(80),
  worksheet: z.string().min(80),
  quiz: z.array(z.object({ question: z.string().min(10), answer: z.string().min(2) })).length(3),
  actionStep: z.string().min(30),
  videoScript: z.string().min(250),
  imagePrompt: z.string().min(30),
  videoPrompt: z.string().min(30),
});

export type LessonContentRequest = z.infer<typeof LessonContentRequestSchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;

export function buildFallbackLessonContent(request: LessonContentRequest): LessonContent {
  const topic = request.moduleTitle;
  const audience = request.audience;
  const manuscript = [
    `Welcome to ${request.lessonTitle}, part of ${request.communityName}. This lesson is designed for ${audience}. By the end, you will understand the purpose of ${topic}, recognize the decisions that matter most, and complete a practical first version you can improve.`,
    `Start with the outcome. ${request.transformation}. Do not begin with tools or features. Write down the person, problem, input, action, and finished result. This keeps the work focused on a useful transformation instead of an impressive but unnecessary build.`,
    `Next, map the simplest path from the current problem to the desired result. Identify what must happen, what information is required, where a human should review the work, and how success will be measured. Keep the first version small enough to test today.`,
    `Now build the smallest working example. Use one realistic scenario, follow the process from beginning to end, and record what worked, what failed, and what confused you. A useful first version teaches more than a perfect plan that never gets tested.`,
    `Finally, improve the result using evidence. Ask whether the output is accurate, understandable, safe, and valuable to the intended person. Make one improvement at a time, test again, and share the result with the community for focused feedback.`,
    `Your goal is progress you can demonstrate. Complete the exercise, use the worksheet to document your decisions, and post your result. The community can help you strengthen the next version once there is something concrete to review.`,
  ].join("\n\n");

  return LessonContentSchema.parse({
    objective: `Create and evaluate a practical first version of ${topic} that moves ${audience} toward the promised transformation.`,
    manuscript,
    keyPoints: [`Lead with the member outcome before choosing tools for ${topic}.`, `Build the smallest version that can be tested with a realistic example.`, `Use evidence and peer feedback to improve one decision at a time.`],
    example: `Imagine one member from ${audience} working through ${topic}. They choose one real situation, define the desired result, build a small first version, and test it before adding complexity. Their evidence becomes the basis for the next improvement.`,
    exercise: `Choose one real situation related to ${topic}. Write the intended user, current problem, desired result, required inputs, main action, and success measure. Build or outline the smallest working version, then test it once and record the result.`,
    worksheet: `WORKSHEET\n1. Who is this for?\n2. What problem are they experiencing?\n3. What result should ${topic} produce?\n4. What inputs are required?\n5. Where is human review needed?\n6. What will count as a successful first test?`,
    quiz: [
      { question: `What should be defined before selecting tools for ${topic}?`, answer: "The member outcome and measurable result." },
      { question: "Why should the first version stay small?", answer: "So it can be tested quickly with a realistic example." },
      { question: "What should guide the next improvement?", answer: "Evidence from testing and focused feedback." },
    ],
    actionStep: `Complete one realistic test of ${topic}, document the output, and share one specific question with the community.`,
    videoScript: `Welcome to ${request.lessonTitle}. In this lesson, we are going to make ${topic} practical for ${audience}. First, define the exact result you want to create. Next, map the simplest path from the current problem to that result. Then build a small first version and test it with one realistic example. Do not chase perfection. Your first version exists to teach you what to improve. Review the result for accuracy, clarity, safety, and usefulness. Complete the worksheet, run your test, and share what happened with the community. Your next move is simple: create something concrete enough to evaluate and improve.`,
    imagePrompt: `A polished editorial educational diagram for ${request.lessonTitle} in ${request.communityName}, showing a clear path from problem to plan to build to test to result, premium ivory, deep charcoal, electric violet, and mint palette, landscape, no logos, minimal readable text.`,
    videoPrompt: `A polished cinematic educational intro for ${request.lessonTitle}, visually showing ${topic} moving from an unclear idea to a mapped plan, a working build, a test, and a confident result, premium modern technology aesthetic, diverse adult learners, landscape, synced ambient audio, no logos, no on-screen text.`,
  });
}

export async function generateLessonContent(request: LessonContentRequest) {
  if (!process.env.OPENAI_API_KEY || process.env.DEMO_FALLBACK === "true") return { content: buildFallbackLessonContent(request), provider: "fallback" as const };
  try {
    const response = await settleWithin(getOpenAIClient().responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-sol",
      input: `Create a complete, practical lesson production pack. Avoid generic filler. Audience: ${request.audience}. Community: ${request.communityName}. Transformation: ${request.transformation}. Module: ${request.moduleTitle}. Lesson: ${request.lessonTitle}. The manuscript must be ready to teach, the video script ready to narrate, and the media prompts visually specific.`,
      text: { format: zodTextFormat(LessonContentSchema, "lesson_production_pack") },
    }, { timeout: 12_000 }), 13_000);
    if (!response.output_parsed) throw new Error("No structured lesson returned");
    return { content: LessonContentSchema.parse(response.output_parsed), provider: "openai" as const };
  } catch {
    return { content: buildFallbackLessonContent(request), provider: "fallback" as const };
  }
}
