export type MarketSignal={id:string;templateId:string;label:string;strength:"high"|"medium";summary:string;sourceTitle:string;sourceUrl:string;accessedAt:string};
const categorySource="https://www.redditmaster.com/top-subreddits";
const seeds=[
  ["consulting-client-accelerator","Consulting and entrepreneurship","Recurring questions about positioning, offers, and first clients indicate persistent implementation demand.","https://www.reddit.com/r/consulting/"],
  ["creator-revenue-lab","Creator monetization","Creators repeatedly seek recurring revenue beyond sponsorships, creating a clear membership education opportunity.","https://www.reddit.com/r/creators/"],
  ["ai-business-builder","Applied AI","High tool interest combines with a visible gap between collecting AI tools and implementing useful workflows.","https://www.reddit.com/r/ArtificialInteligence/"],
  ["freelancer-growth-collective","Freelance operations","Pricing, client acquisition, contracts, and delivery create repeatable peer-learning conversations.","https://www.reddit.com/r/freelance/"],
  ["debt-freedom-accountability","Personal finance","Large finance communities show durable demand for budgeting systems, debt organization, and accountability.","https://www.reddit.com/r/personalfinance/"],
  ["fitness-habit-accountability","Fitness consistency","Fitness communities sustain high engagement around routines, progress, setbacks, and accountability.","https://www.reddit.com/r/fitness/"],
  ["career-pivot-lab","Career transition","Resume positioning, interviews, networking, and career changes produce recurring high-urgency questions.","https://www.reddit.com/r/careerguidance/"],
  ["real-estate-investor-launchpad","Real estate investing","Deal analysis, financing, and first-property decisions create high-value education and peer review demand.","https://www.reddit.com/r/realestateinvesting/"],
  ["language-learning-club","Language practice","Learners actively seek practice partners, study systems, milestones, and conversation accountability.","https://www.reddit.com/r/languagelearning/"],
  ["productivity-focus-systems","Productivity systems","Large productivity communities repeatedly discuss focus methods, planning systems, and consistent execution.","https://www.reddit.com/r/productivity/"],
] as const;
export const MARKET_SIGNALS:MarketSignal[]=seeds.flatMap(([templateId,label,summary,communityUrl],index)=>[
  {id:`${templateId}-demand`,templateId,label:`${label} demand`,strength:"high",summary,sourceTitle:"Top subreddits by industry and category",sourceUrl:categorySource,accessedAt:"2026-07-18"},
  {id:`${templateId}-community`,templateId,label:"Peer interaction fit",strength:index===2?"medium":"high",summary:"The subject benefits from questions, progress sharing, feedback, and repeated practice, signals that support an ongoing community rather than a one-time download.",sourceTitle:`Relevant ${label.toLowerCase()} community`,sourceUrl:communityUrl,accessedAt:"2026-07-18"},
]);
export function getSignalsForTemplate(templateId:string){return MARKET_SIGNALS.filter(signal=>signal.templateId===templateId)}
