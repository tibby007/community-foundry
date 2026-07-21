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
  brandDirection: z.enum(["authority", "energetic", "premium", "warm", "bold"]).optional(),
  palette: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).length(4).optional(),
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
  const focus = request.lessonTitle;
  const audience = request.audience;
  const brandDirection = request.brandDirection ?? "authority";
  const palette = request.palette ?? ["#11263D", "#2E5B88", "#D29B45", "#F4F1EA"];
  const lessonStage = /\b(meet|welcome)\b/i.test(focus) ? {
    situation: `Review the purpose of ${request.communityName}, the community norms, the classroom path, and the places where members can ask for support. Notice which parts of the community will help you make progress with ${topic}.`,
    success: `A successful start means other members understand who you are, what brought you here, the experience you already have, and the first ${topic.toLowerCase()} goal you want help completing.`,
    process: `Write a useful introduction, find the discussion category and classroom module connected to your goal, then respond to one member whose interests overlap with yours. This creates a real starting relationship instead of a silent profile.`,
    review: `Check that your introduction gives enough context for members to support you and includes one clear goal. Save the community guidelines and decide when you will return for your first check-in.`,
    exercise: `Post an introduction that shares your connection to ${topic}, one relevant experience, your first goal, and the kind of support you would value. Then welcome one member and respond to something specific they shared.`,
    worksheet: `WELCOME WORKSHEET: ${focus}\n1. Why did I join?\n2. What experience do I bring?\n3. What is my first goal?\n4. Where should I ask questions?\n5. What support would help?\n6. Which member will I welcome today?`,
    keyPoints: [`A useful introduction gives members enough context to offer relevant support.`, `One specific goal makes it easier to choose the right classroom lesson and discussion category.`, `Welcoming another member turns orientation into immediate participation.`],
  } : /\bgoal\b/i.test(focus) ? {
    situation: `Look at what you want to accomplish with ${topic}, what matters most right now, and how much time and attention you can realistically give it. Separate a meaningful result from a vague wish.`,
    success: `A strong goal is specific enough to guide action, realistic for your current season, and visible enough that you and the community can recognize progress.`,
    process: `Write the desired result, choose a 30-day milestone, identify why it matters, and name the first action. Check that the goal belongs to you and is not based only on what other members are doing.`,
    review: `Read the goal aloud. If the next action is unclear or success cannot be observed, make the language more specific before you share it.`,
    exercise: `Write one 30-day ${topic.toLowerCase()} goal with a visible result, a realistic deadline, a reason it matters, and one action you can complete this week. Share it for accountability.`,
    worksheet: `GOAL WORKSHEET: ${focus}\n1. What do I want to accomplish?\n2. Why now?\n3. What will progress look like?\n4. What can I finish in 30 days?\n5. What is the first action?\n6. When will I check in?`,
    keyPoints: [`Choose one goal that matters now instead of carrying several competing priorities.`, `Describe progress in a way that can be seen, counted, completed, or clearly explained.`, `Pair the goal with an immediate action and a community check-in date.`],
  } : /\b(plan|step-by-step)\b/i.test(focus) ? {
    situation: `Start with the chosen ${topic.toLowerCase()} result, deadline, current starting point, and any decisions that must be made before work begins.`,
    success: `A useful plan shows the sequence of work, required resources, decision points, timeline, checkpoints, and the evidence that will mark completion.`,
    process: `Work backward from the intended result. Break the project into stages, put the steps in order, estimate what each stage requires, and schedule the first action. Add checkpoints where you can review progress before moving forward.`,
    review: `Look for missing steps, unrealistic timing, hidden dependencies, and tasks that are too large to start. Revise the plan until the next action is obvious.`,
    exercise: `Create a step-by-step plan for ${focus.toLowerCase()} with an ordered sequence, timeline, required resources, two progress checkpoints, and one first action scheduled on your calendar.`,
    worksheet: `PLANNING WORKSHEET: ${focus}\n1. What is the finished result?\n2. What are the major stages?\n3. What sequence should the steps follow?\n4. Which resources are required?\n5. Where are the checkpoints?\n6. What happens first, and when?`,
    keyPoints: [`Plan backward from the finished result so every step has a reason to exist.`, `Use checkpoints to catch problems before they affect the entire project.`, `A plan becomes useful when the first action has a clear time and place.`],
  } : {
    situation: `Describe your current conditions, the space or setting you are working in, the resources available, your experience level, and any constraints that could affect the result.`,
    success: `Decide what a successful outcome for ${focus.toLowerCase()} would look like. Make it observable and choose the most important criteria before you begin.`,
    process: `Gather what you need and put the steps in an order you can follow. Work one step at a time, pause at important decisions, and record what you notice.`,
    review: `Compare the result with your success criteria, note what worked, identify what needs attention, and choose one focused improvement.`,
    exercise: `Complete a real pass through ${focus.toLowerCase()}. Record your starting conditions, intended result, required resources, ordered steps, observations, and one adjustment. Share the result with enough context for another member to give useful feedback.`,
    worksheet: `WORKSHEET: ${focus}\n1. What are the current conditions and constraints?\n2. What result will show meaningful progress?\n3. Which resources, materials, or information are needed?\n4. What steps will you follow, in order?\n5. What did you observe while completing the work?\n6. What is the next decision or improvement?`,
    keyPoints: [`Start ${focus.toLowerCase()} with an honest review of conditions, resources, experience, and constraints.`, `Define an observable result and follow a clear sequence instead of relying on vague intentions.`, `Use direct observation and focused community feedback to choose the next improvement.`],
  };
  const manuscript = [
    `Welcome to ${focus}, part of ${request.communityName}. This lesson is for ${audience}. By the end, you will have a clear decision, plan, or completed action connected to ${topic}, plus something useful to share with the community.`,
    `Begin with the larger member transformation: ${request.transformation}. For this lesson, focus specifically on ${focus.toLowerCase()}. ${lessonStage.situation}`,
    lessonStage.success,
    lessonStage.process,
    lessonStage.review,
    `Finish by sharing one concrete result from ${focus.toLowerCase()}. Include enough context for useful feedback and ask one specific question. The purpose of this lesson is to leave with practical progress you can see, explain, and improve.`,
  ].join("\n\n");

  return LessonContentSchema.parse({
    objective: `Complete ${focus.toLowerCase()} with a clear plan, observable result, and next step that moves ${audience} toward the member transformation.`,
    manuscript,
    keyPoints: lessonStage.keyPoints,
    example: `A member from ${audience} begins ${focus.toLowerCase()} by reviewing their current conditions, available space, time, materials, and experience. They choose a realistic result, follow the steps, document what happens, and share one focused question instead of asking for general opinions.`,
    exercise: lessonStage.exercise,
    worksheet: lessonStage.worksheet,
    quiz: [
      { question: `What should you review before starting ${focus.toLowerCase()}?`, answer: "The current conditions, available resources, experience level, and constraints." },
      { question: "Why should the intended result be observable?", answer: "So progress can be evaluated using evidence instead of guesswork." },
      { question: "What makes a community feedback request useful?", answer: "Enough context plus one specific question about the work." },
    ],
    actionStep: `Complete the next real action for ${focus.toLowerCase()}, document what you observed, and share one specific feedback question with the community.`,
    videoScript: `Welcome to ${focus}. This lesson helps ${audience} make practical progress with ${topic}. ${lessonStage.situation} ${lessonStage.success} ${lessonStage.process} Use the worksheet to capture your choices, actions, and next step. Finish by sharing one concrete result and one focused question with the community.`,
    imagePrompt: `A polished editorial educational diagram for ${request.lessonTitle} in ${request.communityName}, showing a clear path from problem to plan to build to test to result, ${brandDirection} visual direction using ${palette.join(", ")}, landscape, no logos, minimal readable text.`,
    videoPrompt: `A polished cinematic educational intro for ${request.lessonTitle}, visually showing ${topic} moving from an unclear idea to a mapped plan, a working build, a test, and a confident result, ${brandDirection} visual direction using ${palette.join(", ")}, diverse adult learners, landscape, synced ambient audio, no logos, no on-screen text.`,
  });
}

export async function generateLessonContent(request: LessonContentRequest) {
  if (!process.env.OPENAI_API_KEY || process.env.DEMO_FALLBACK === "true") return { content: buildFallbackLessonContent(request), provider: "fallback" as const };
  try {
    const response = await settleWithin(getOpenAIClient().responses.parse({
      model: process.env.OPENAI_MODEL ?? "gpt-5.6-sol",
      input: `Create a complete, practical lesson production pack. Avoid generic filler. Audience: ${request.audience}. Community: ${request.communityName}. Transformation: ${request.transformation}. Module: ${request.moduleTitle}. Lesson: ${request.lessonTitle}. Brand direction: ${request.brandDirection ?? "authority"}. Required brand palette: ${(request.palette ?? ["#11263D", "#2E5B88", "#D29B45", "#F4F1EA"]).join(", ")}. The manuscript must be ready to teach, the video script ready to narrate, and both media prompts must explicitly preserve this brand direction and palette without substituting colors.`,
      text: { format: zodTextFormat(LessonContentSchema, "lesson_production_pack") },
    }, { timeout: 12_000 }), 13_000);
    if (!response.output_parsed) throw new Error("No structured lesson returned");
    return { content: LessonContentSchema.parse(response.output_parsed), provider: "openai" as const };
  } catch {
    return { content: buildFallbackLessonContent(request), provider: "fallback" as const };
  }
}
