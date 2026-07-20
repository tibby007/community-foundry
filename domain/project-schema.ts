import { z } from "zod";

export const PricingTierSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  monthlyPrice: z.number().nonnegative(),
  annualPrice: z.number().nonnegative(),
  benefits: z.array(z.string().min(1)).min(2),
});

export const CategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  emoji: z.string().min(1),
});

export const LessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  objective: z.string().min(1),
  summary: z.string().min(1),
  actionStep: z.string().min(1),
  resource: z.string().min(1),
  manuscript: z.string().default(""),
  keyPoints: z.array(z.string()).default([]),
  example: z.string().default(""),
  exercise: z.string().default(""),
  worksheet: z.string().default(""),
  quiz: z.array(z.object({ question: z.string(), answer: z.string() })).default([]),
  videoScript: z.string().default(""),
  imagePrompt: z.string().default(""),
  videoPrompt: z.string().default(""),
  imageUrl: z.string().nullable().default(null),
  videoId: z.string().nullable().default(null),
  videoStatus: z.enum(["idle", "queued", "in_progress", "completed", "failed", "script_ready"]).default("idle"),
});

export const ModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  milestone: z.string().min(1),
  lessons: z.array(LessonSchema).min(2),
});

export const ClassroomSchema = z.object({
  title: z.string().min(1),
  transformation: z.string().min(1),
  unlockCadence: z.string().min(1),
  completionReward: z.string().min(1),
  modules: z.array(ModuleSchema).min(4).max(8),
});

export const PromotionSchema = z.object({
  channels: z.array(z.string().min(1)).min(2),
  channelRationale: z.string().min(1),
  founderWorkload: z.string().min(1),
  launchPlan: z.array(z.string().min(1)).length(30),
  prelaunchSequence: z.array(z.string().min(1)).min(3),
  foundingCampaign: z.string().min(1),
  leadMagnet: z.string().min(1),
  referralCampaign: z.string().min(1),
  first25Plan: z.string().min(1),
  socialPosts: z.array(z.string()).default([]),
  emails: z.array(z.string()).default([]),
  partnerships: z.array(z.string().min(1)).min(1),
  launchEvent: z.string().min(1),
  risks: z.array(z.string().min(1)).min(1),
});

export const EngagementSchema = z.object({
  firstDay: z.string().min(1),
  firstWeek: z.string().min(1),
  rituals: z.array(z.string().min(1)).min(2),
  challenge: z.string().min(1),
  recognition: z.string().min(1),
  founderCadence: z.string().min(1),
  calendar: z.array(z.string().min(1)).length(30),
  officeHours: z.string().min(1),
  spotlightFormat: z.string().min(1),
  reengagementMessages: z.array(z.string().min(1)).min(2),
  churnWarnings: z.array(z.string().min(1)).min(2),
});

export const BrandSchema = z.object({
  direction: z.enum(["authority", "energetic", "premium", "warm", "bold"]),
  palette: z.array(z.string()).min(3),
  typography: z.string().min(1),
  iconUrl: z.string().nullable(),
  coverUrl: z.string().nullable(),
  promotionUrl: z.string().nullable(),
});

export const LaunchDimensionSchema = z.object({
  score: z.number().min(0).max(100),
  evidence: z.string().min(1),
  confidence: z.number().min(0).max(1),
  action: z.string().min(1),
});

export const SourceCitationSchema = z.object({
  title: z.string().min(1),
  url: z.url(),
  accessedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const CommunityProjectSchema = z.object({
  id: z.string().min(1),
  templateId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  foundation: z.object({
    name: z.string().min(1),
    alternatives: z.array(z.string().min(1)).min(2),
    promise: z.string().min(1),
    audience: z.string().min(1),
    pain: z.string().min(1),
    transformation: z.string().min(1),
    differentiator: z.string().min(1),
    personality: z.string().min(1),
    authority: z.string().min(1),
    membershipCriteria: z.string().min(1),
    description: z.string().min(1),
    rules: z.array(z.string()).min(3),
  }),
  offer: z.object({
    model: z.enum(["free", "freemium", "paid", "cohort", "tiered"]),
    rationale: z.string().min(1),
    foundingOffer: z.string().min(1),
    tiers: z.array(PricingTierSchema).min(1),
    bonuses: z.array(z.string()).min(1),
    trialRecommendation: z.string().min(1),
    upsells: z.array(z.string().min(1)).min(1),
    riskReversal: z.string().min(1),
    revenueScenarios: z.object({ members25: z.number().nonnegative(), members100: z.number().nonnegative(), members500: z.number().nonnegative() }),
    retentionHooks: z.array(z.string()).min(2),
  }),
  categories: z.array(CategorySchema).min(4),
  tags: z.array(z.string().min(1)).min(4),
  community: z.object({
    startHere: z.string().min(1),
    welcomePost: z.string().min(1),
    introductionPrompt: z.string().min(1),
    weeklyPrompts: z.array(z.string().min(1)).min(2),
    feedbackGuidance: z.string().min(1),
    resourceRules: z.string().min(1),
    moderatorGuidelines: z.string().min(1),
    onboardingQuestions: z.array(z.string().min(1)).min(2),
  }),
  classroom: ClassroomSchema,
  engagement: EngagementSchema,
  promotion: PromotionSchema,
  brand: BrandSchema,
  disclaimers: z.array(z.string()),
  citations: z.array(SourceCitationSchema),
  lockedPaths: z.array(z.string()),
  history: z.array(z.object({
    id: z.string(),
    acceptedAt: z.string().datetime(),
    section: z.string(),
    before: z.record(z.string(), z.unknown()),
    after: z.record(z.string(), z.unknown()),
  })),
});

export type CommunityProject = z.infer<typeof CommunityProjectSchema>;
export type Classroom = z.infer<typeof ClassroomSchema>;
export type Engagement = z.infer<typeof EngagementSchema>;
export type Promotion = z.infer<typeof PromotionSchema>;
export type Category = z.infer<typeof CategorySchema>;

export type CommunityTemplate = Omit<
  CommunityProject,
  "id" | "templateId" | "createdAt" | "updatedAt" | "lockedPaths" | "history" | "citations"
> & { id: string };
