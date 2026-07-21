import type { CommunityProject } from "@/domain/project-schema";

type CourseModules = CommunityProject["classroom"]["modules"];

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function courseLesson(title: string, objective: string, actionStep: string, index: number) {
  return {
    id: `${slug(title)}-${index}`,
    title,
    objective,
    summary: `${objective} This lesson ends with a concrete result members can share for feedback.`,
    actionStep,
    resource: `${title} worksheet`,
    manuscript: "",
    keyPoints: [],
    example: "",
    exercise: "",
    worksheet: "",
    quiz: [],
    videoScript: "",
    imagePrompt: "",
    videoPrompt: "",
    imageUrl: null,
    videoId: null,
    videoStatus: "idle" as const,
  };
}

export function inferCourseTopic(project: CommunityProject) {
  const cleaned = project.foundation.name
    .replace(/\b(community|club|collective|roadmap|accelerator|builder|results|creator|learning|mastery|development|transformation|growth|sales|discovery|success|writing|lab)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned || project.foundation.name;
}

export function buildTopicAwareModules(topic: string): CourseModules {
  const modulePlans = [
    {
      title: `Welcome to the ${topic} Community`,
      milestone: `Introduce yourself, choose one ${topic.toLowerCase()} goal, and share where you are starting.`,
      lessons: [
        [`Meet the ${topic} Community`, `Understand how the community works and identify the support you need.`, `Post your introduction and name one area where you want support.`],
        [`Choose Your First ${topic} Goal`, `Turn your interest in ${topic.toLowerCase()} into one clear and achievable member goal.`, `Write and share one specific ${topic.toLowerCase()} goal for the next 30 days.`],
      ],
    },
    {
      title: `${topic} Essentials`,
      milestone: `Complete an honest starting-point review and prepare the resources needed for ${topic.toLowerCase()}.`,
      lessons: [
        [`Assess Your ${topic} Starting Point`, `Review your current conditions, experience, resources, and constraints before choosing what to do next.`, `Complete the starting-point checklist and share the most important finding.`],
        [`Prepare for a Successful ${topic} Project`, `Choose the materials, support, time, and setup needed for a realistic ${topic.toLowerCase()} project.`, `Create a preparation list for your first project.`],
      ],
    },
    {
      title: `Plan Your First ${topic} Project`,
      milestone: `Leave with a realistic ${topic.toLowerCase()} project plan, timeline, and definition of success.`,
      lessons: [
        [`Choose a ${topic} Project That Fits`, `Select a useful project that matches your goal, current conditions, available time, and experience.`, `Choose one project and explain why it fits your situation.`],
        [`Create Your Step-by-Step ${topic} Plan`, `Break the project into clear steps, decisions, resources, and checkpoints.`, `Finish your project plan and schedule the first step.`],
      ],
    },
    {
      title: `${topic} Practice and Problem Solving`,
      milestone: `Complete the core process, document progress, and solve one real problem without losing momentum.`,
      lessons: [
        [`Complete the Core ${topic} Process`, `Work through the essential process carefully and document what happens at each stage.`, `Complete the next project stage and post a progress update.`],
        [`Solve Common ${topic} Problems`, `Notice warning signs, diagnose what is getting in the way, and choose a practical correction.`, `Use the problem-solving checklist on one current obstacle.`],
      ],
    },
    {
      title: `${topic} Feedback and Improvement`,
      milestone: `Use focused feedback and direct observation to make one visible improvement.`,
      lessons: [
        [`Share Your ${topic} Progress for Feedback`, `Show enough context for members to understand your work and give useful feedback.`, `Post your progress with one specific feedback question.`],
        [`Improve Your ${topic} Result`, `Evaluate what worked, choose one priority, and make a focused improvement.`, `Make one improvement and document the before-and-after result.`],
      ],
    },
    {
      title: `${topic} Showcase and Next Steps`,
      milestone: `Present the finished project, capture the lessons learned, and choose the next goal.`,
      lessons: [
        [`Prepare Your ${topic} Showcase`, `Tell the story of your goal, process, decisions, result, and lessons learned.`, `Create and publish your member showcase.`],
        [`Choose Your Next ${topic} Goal`, `Use what you learned to choose a meaningful next project and support another member.`, `Share your next goal and give useful feedback to one member.`],
      ],
    },
  ];

  return modulePlans.map((module, moduleIndex) => ({
    id: `module-${moduleIndex + 1}`,
    title: module.title,
    milestone: module.milestone,
    lessons: module.lessons.map(([title, objective, actionStep], lessonIndex) => courseLesson(title, objective, actionStep, lessonIndex + 1)),
  }));
}
