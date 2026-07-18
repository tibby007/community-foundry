import type { CommunityProject, CommunityTemplate } from "@/domain/project-schema";

type TemplateSeed = {
  id: string;
  title: string;
  audience: string;
  pain: string;
  outcome: string;
  model: CommunityProject["offer"]["model"];
  price: number;
  modules: string[];
  categories: [string, string, string, string];
  channels: [string, string];
  direction: CommunityProject["brand"]["direction"];
  disclaimers?: string[];
};

const lesson = (moduleTitle: string, index: number) => ({
  id: `${moduleTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
  title: index === 1 ? `Understand ${moduleTitle}` : `Apply ${moduleTitle}`,
  objective: `Build practical confidence with ${moduleTitle.toLowerCase()}.`,
  summary: `A focused lesson that turns ${moduleTitle.toLowerCase()} into a repeatable member action.`,
  actionStep: `Complete the ${moduleTitle} action sprint.`,
  resource: `${moduleTitle} worksheet`,
});

const categoryDescriptions: Record<string, string> = {
  Start: "Onboarding, introductions, and the fastest path to a first win.",
  Strategy: "Questions and decisions that sharpen the member's plan.",
  Accountability: "Weekly commitments, progress, and constructive support.",
  Wins: "Results, milestones, lessons, and member recognition.",
};

const buildTemplate = (seed: TemplateSeed): CommunityTemplate => ({
  id: seed.id,
  foundation: {
    name: seed.title,
    alternatives: [`${seed.title} Collective`, `${seed.title} Lab`],
    promise: `Help members ${seed.outcome.toLowerCase()} with a clear plan and peer accountability.`,
    audience: seed.audience,
    pain: seed.pain,
    transformation: seed.outcome,
    differentiator: "A guided implementation community where every lesson creates a visible result.",
    personality: "Clear, encouraging, practical, and progress obsessed.",
    authority: "Led by a practitioner who teaches from lived and client experience.",
    membershipCriteria: `For ${seed.audience.toLowerCase()} who are ready to take consistent action and support peers.`,
    description: `${seed.title} gives ${seed.audience.toLowerCase()} the roadmap, support, and accountability to ${seed.outcome.toLowerCase()}.`,
    rules: ["Be useful before being promotional.", "Protect member privacy.", "Share progress and ask specific questions."],
  },
  offer: {
    model: seed.model,
    rationale: "Members need a structured path, recurring feedback, and accountability that free content cannot provide alone.",
    foundingOffer: `Founding access at $${seed.price} per month for the first 25 members.`,
    tiers: [{
      id: "founding-member",
      name: "Founding Member",
      monthlyPrice: seed.price,
      annualPrice: seed.price * 10,
      benefits: ["Complete starter classroom", "Live group implementation session", "Member accountability system"],
    }],
    bonuses: ["Founding-member kickoff workshop"],
    trialRecommendation: "Use a seven-day preview only when it includes an activation task and a clear conversion moment.",
    upsells: ["Private implementation intensive"],
    riskReversal: "Cancel anytime. Founding members keep their original rate while continuously enrolled.",
    revenueScenarios: { members25: seed.price * 25, members100: seed.price * 100, members500: seed.price * 500 },
    retentionHooks: ["Monthly implementation sprint", "Member milestone recognition"],
  },
  categories: seed.categories.map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    description: categoryDescriptions[["Start", "Strategy", "Accountability", "Wins"][index]],
    emoji: ["👋", "🎯", "🤝", "🏆"][index],
  })),
  tags: ["new-member", "question", "accountability", "win", "resource"],
  community: {
    startHere: "Read the welcome post, introduce yourself, choose one goal, and complete the first classroom action.",
    welcomePost: `Welcome to ${seed.title}. This is a working community built around progress, useful feedback, and visible member wins.`,
    introductionPrompt: "Tell us where you are now, the result you want in the next 90 days, and the experience you can share with another member.",
    weeklyPrompts: ["What is your one priority this week?", "What moved forward, what got stuck, and what will you change next?"],
    feedbackGuidance: "Ask a specific question, include relevant context, and say what kind of feedback would be useful.",
    resourceRules: "Share resources with a short explanation of who they help. No unsolicited promotion or affiliate links.",
    moderatorGuidelines: "Protect privacy, redirect vague asks, reward useful participation, and remove promotional spam quickly.",
    onboardingQuestions: ["What result would make this membership valuable in 90 days?", "What is your biggest current obstacle?", "How did you hear about this community?"],
  },
  classroom: {
    title: `${seed.title} Roadmap`,
    transformation: seed.outcome,
    unlockCadence: "One module each week, with immediate access for founding members.",
    completionReward: "Graduate badge and member spotlight.",
    modules: seed.modules.map((title, index) => ({
      id: `module-${index + 1}`,
      title,
      milestone: `Member completes ${title.toLowerCase()} and shares the result.`,
      lessons: [lesson(title, 1), lesson(title, 2)],
    })),
  },
  engagement: {
    firstDay: "Post an introduction and complete the community diagnostic.",
    firstWeek: "Share one clear goal and complete the first classroom action.",
    rituals: ["Monday commitments", "Friday wins and lessons"],
    challenge: "Complete the seven-day momentum sprint.",
    recognition: "Feature one member win in the weekly roundup.",
    founderCadence: "Three helpful posts, one live session, and two member check-ins each week.",
    calendar: Array.from({length:30},(_,index)=>`Day ${index+1}: ${index===0?"Welcome and orientation":index%7===0?"Weekly reset and commitment":index%5===0?"Member win spotlight":"Focused action prompt and peer check-in"}`),
    officeHours: "One weekly 45-minute implementation clinic with questions collected in advance.",
    spotlightFormat: "Member goal, action taken, measurable progress, lesson learned, and next move.",
    reengagementMessages: ["We saved your seat. What is the smallest next action we can help you complete?", "Your original goal is still here. Reply with the obstacle and we will point you to the right next step."],
    churnWarnings: ["No introduction or classroom action in the first seven days", "Two missed weekly commitments or 21 days without participation"],
  },
  promotion: {
    channels: seed.channels,
    channelRationale: `${seed.channels[0]} reaches the audience where expertise and proof can be demonstrated, while ${seed.channels[1]} adds borrowed trust.`,
    founderWorkload: "Plan for three focused content blocks and five direct relationship conversations each week during launch.",
    launchPlan: Array.from({length:30},(_,index)=>`Day ${index+1}: ${index<7?"Validate the message and recruit founding conversations":index<15?"Teach the problem and show the member journey":index<23?"Open founding enrollment and answer objections":"Use proof, referrals, and a clear closing deadline"}`),
    prelaunchSequence: ["Invite ten ideal members to a problem-validation conversation.", "Publish a useful diagnostic and collect replies.", "Host a short workshop that previews the community method."],
    foundingCampaign: `Invite the first 25 members to shape ${seed.title} and keep the $${seed.price} founding rate.`,
    leadMagnet: `The ${seed.title} Quick-Start Scorecard`,
    referralCampaign: "Invite one qualified peer and both members receive a bonus implementation clinic.",
    first25Plan: "Recruit warm audience members, strategic partners, and ten hand-selected beta members before public launch.",
    socialPosts: [
      `You do not need another pile of advice. You need a clear path to ${seed.outcome.toLowerCase()}. That is what we are building inside ${seed.title}.`,
      `What is the biggest thing standing between you and this result: ${seed.outcome.toLowerCase()}? I am using the answers to shape our founding-member experience.`,
      `Behind the scenes: ${seed.title} combines a step-by-step classroom, practical action sprints, and the kind of accountability that keeps good plans from collecting dust.`,
      `Founding members of ${seed.title} will help shape the community and lock in early access at $${seed.price}/month. Want the details?`,
      `Doors are open. If you are ready to ${seed.outcome.toLowerCase()}, join the first 25 members of ${seed.title}.`,
    ],
    emails: [
      `Subject: A clearer path to ${seed.outcome.toLowerCase()}\n\nI am building ${seed.title} for ${seed.audience.toLowerCase()}. It turns scattered information into a practical roadmap with support and accountability. Reply if you want founding-member details.`,
      `Subject: What founding members get\n\nFounding members receive the complete starter classroom, a live implementation session, and our member accountability system for $${seed.price}/month.`,
      `Subject: Founding doors are open\n\n${seed.title} is now accepting its first 25 members. If you are ready to ${seed.outcome.toLowerCase()}, this is your invitation to build alongside us.`,
    ],
    partnerships: [`Invite two trusted ${seed.audience.toLowerCase()}-adjacent experts to co-host a practical session.`],
    launchEvent: `A 45-minute ${seed.title} Quick-Start Workshop with a live diagnostic and founding-member invitation.`,
    risks: ["Launching to a cold audience without ten warm conversations first", "Promising broad access instead of a specific transformation"],
  },
  brand: {
    direction: seed.direction,
    palette: ["#17151F", "#7657FF", "#A6F1CE", "#FFFDF8"],
    typography: "Editorial serif headlines with a clean, high-legibility sans serif interface.",
    iconUrl: null,
    coverUrl: null,
    promotionUrl: null,
  },
  disclaimers: seed.disclaimers ?? [],
});

const seeds: TemplateSeed[] = [
  { id: "consulting-client-accelerator", title: "Consulting Client Accelerator", audience: "Experienced professionals and new consultants", pain: "They know their craft but lack a repeatable path to paying clients.", outcome: "Position an offer and land their first five consulting clients", model: "paid", price: 49, modules: ["Choose a Profitable Niche", "Package Your Offer", "Build Authority", "Start Conversations", "Close the Right Clients", "Deliver and Refer"], categories: ["Start Here", "Offer Strategy", "Client Accountability", "Client Wins"], channels: ["LinkedIn authority content", "Strategic referral partners"], direction: "premium" },
  { id: "creator-revenue-lab", title: "Creator Revenue Lab", audience: "Creators ready to turn attention into recurring revenue", pain: "Their content gets attention but income is inconsistent.", outcome: "Build a focused audience and launch a repeatable creator offer", model: "freemium", price: 39, modules: ["Audience Signal", "Content Engine", "Offer Design", "Launch", "Partnerships"], categories: ["Start Here", "Content Strategy", "Publishing Accountability", "Revenue Wins"], channels: ["Short-form content", "Creator collaborations"], direction: "bold" },
  { id: "ai-business-builder", title: "AI-Powered Business Builder", audience: "Entrepreneurs applying AI to real business workflows", pain: "They collect tools without shipping useful automations.", outcome: "Build and deploy one revenue-moving AI workflow", model: "paid", price: 59, modules: ["Use-Case Selection", "Workflow Mapping", "Prompt Systems", "Automation Build", "Quality Control"], categories: ["Start Here", "Build Strategy", "Build Accountability", "Automation Wins"], channels: ["LinkedIn tutorials", "Live build workshops"], direction: "energetic" },
  { id: "freelancer-growth-collective", title: "Freelancer Growth Collective", audience: "Freelancers who want better clients and calmer delivery", pain: "They underprice, chase leads, and rebuild their process for every client.", outcome: "Create a premium offer and a predictable freelance pipeline", model: "tiered", price: 29, modules: ["Positioning", "Pricing", "Proposals", "Pipeline", "Client Delivery"], categories: ["Start Here", "Business Strategy", "Pipeline Accountability", "Freelance Wins"], channels: ["Portfolio content", "Past-client referrals"], direction: "authority" },
  { id: "debt-freedom-accountability", title: "Debt Freedom and Money Accountability", audience: "Adults organizing spending and paying down consumer debt", pain: "They understand basic budgeting but struggle with consistency and shame.", outcome: "Build a sustainable money routine and measurable debt-paydown plan", model: "cohort", price: 35, modules: ["Money Snapshot", "Spending Plan", "Debt Sequence", "Weekly Routine", "Progress Review"], categories: ["Start Here", "Money Strategy", "Weekly Accountability", "Money Wins"], channels: ["Educational workshops", "Personal-finance newsletters"], direction: "warm", disclaimers: ["Educational information only. This community does not provide individualized financial, tax, legal, or investment advice."] },
  { id: "fitness-habit-accountability", title: "Fitness and Habit Accountability", audience: "Busy adults rebuilding consistent movement and nutrition habits", pain: "They repeatedly start ambitious plans that do not fit real life.", outcome: "Create a sustainable weekly movement and habit routine", model: "paid", price: 29, modules: ["Baseline", "Habit Design", "Movement Plan", "Food Environment", "Recovery"], categories: ["Start Here", "Habit Strategy", "Daily Accountability", "Progress Wins"], channels: ["Thirty-day challenges", "Wellness partnerships"], direction: "energetic", disclaimers: ["Educational community only. This is not medical advice, diagnosis, or treatment. Members should consult a qualified clinician about personal health needs."] },
  { id: "career-pivot-lab", title: "Career Pivot and Job Search Lab", audience: "Mid-career professionals changing roles or industries", pain: "Their experience is valuable but their story, network, and search strategy are unfocused.", outcome: "Position their experience and run a focused career-pivot campaign", model: "cohort", price: 49, modules: ["Career Thesis", "Transferable Value", "Resume Story", "Networking", "Interviews"], categories: ["Start Here", "Pivot Strategy", "Search Accountability", "Offer Wins"], channels: ["LinkedIn career content", "Professional associations"], direction: "authority" },
  { id: "real-estate-investor-launchpad", title: "Real Estate Investor Launchpad", audience: "New investors learning to evaluate and operate their first deal", pain: "They consume deal content but lack a disciplined analysis and acquisition process.", outcome: "Analyze opportunities and build a responsible first-deal pipeline", model: "paid", price: 79, modules: ["Investor Criteria", "Market Selection", "Deal Analysis", "Funding Paths", "Operations"], categories: ["Start Here", "Deal Strategy", "Pipeline Accountability", "Deal Wins"], channels: ["Local investor meetups", "Educational deal breakdowns"], direction: "premium", disclaimers: ["Educational information only. No investment, legal, tax, lending, or real-estate outcome is guaranteed."] },
  { id: "language-learning-club", title: "Language Learning Accountability Club", audience: "Language learners who need structure and real conversation practice", pain: "They use apps inconsistently and rarely practice speaking.", outcome: "Build a daily practice habit and hold confident weekly conversations", model: "freemium", price: 19, modules: ["Baseline", "Practice System", "Listening", "Speaking", "Conversation Sprint"], categories: ["Start Here", "Learning Strategy", "Practice Accountability", "Fluency Wins"], channels: ["Language-learning content", "Tutor partnerships"], direction: "warm" },
  { id: "productivity-focus-systems", title: "Productivity and Focus Systems", audience: "Entrepreneurs and professionals overwhelmed by competing priorities", pain: "Their tools are full but their most important work remains unfinished.", outcome: "Build a simple weekly operating system and protect focused work", model: "paid", price: 25, modules: ["Priority Audit", "Weekly System", "Focus Blocks", "Task Boundaries", "Review and Reset"], categories: ["Start Here", "System Strategy", "Focus Accountability", "Execution Wins"], channels: ["Productivity workshops", "Newsletter partnerships"], direction: "authority" },
];

export const COMMUNITY_TEMPLATES = seeds.map(buildTemplate);

export function createProjectFromTemplate(templateId: string, ownerInput: string): CommunityProject {
  const template = COMMUNITY_TEMPLATES.find((item) => item.id === templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  const now = new Date().toISOString();
  const cloned = structuredClone(template);
  const { id, ...content } = cloned;

  return {
    ...content,
    id: crypto.randomUUID(),
    templateId: id,
    createdAt: now,
    updatedAt: now,
    foundation: {
      ...content.foundation,
      audience: `${ownerInput}: ${content.foundation.audience}`,
    },
    citations: [],
    lockedPaths: [],
    history: [],
  };
}

export function createProjectFromScratch(ownerInput: string): CommunityProject {
  const project = createProjectFromTemplate("consulting-client-accelerator", ownerInput);
  return {
    ...project,
    id: `custom-${project.id}`,
    templateId: "custom",
    foundation: {
      ...project.foundation,
      name: "My Expert Community",
      alternatives: ["The Implementation Collective", "The Results Lab"],
      promise: "Turn hard-won expertise into a clear member transformation with a practical roadmap and accountability.",
      audience: ownerInput,
      pain: "The audience has useful information but lacks a structured path, feedback, and consistent action.",
      transformation: "Move from scattered effort to a repeatable, supported result",
      description: `A guided community for ${ownerInput.toLowerCase()} with practical education, peer support, and visible progress.`,
    },
  };
}
