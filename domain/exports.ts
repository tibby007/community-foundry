import {CommunityProjectSchema,type CommunityProject} from "@/domain/project-schema";
import {calculateLaunchScore,INITIAL_SCORE_VALUES} from "@/domain/scoring";
const clean=(value:string)=>value.replace(/[\u0000-\u001f]/g," ").trim();
const csv=(rows:string[][])=>rows.map(row=>row.map(value=>`"${clean(value).replace(/"/g,'""')}"`).join(",")).join("\n");
export function toMarkdown(project:CommunityProject){const score=calculateLaunchScore(INITIAL_SCORE_VALUES);return `# ${clean(project.foundation.name)} Launch Blueprint

## Foundation

**Promise:** ${clean(project.foundation.promise)}

**Audience:** ${clean(project.foundation.audience)}

**Transformation:** ${clean(project.foundation.transformation)}

**Membership criteria:** ${clean(project.foundation.membershipCriteria)}

## Offer

**Model:** ${project.offer.model}

**Founding offer:** ${clean(project.offer.foundingOffer)}

**Why this model:** ${clean(project.offer.rationale)}

${project.offer.tiers.map(tier=>`- ${tier.name}: $${tier.monthlyPrice}/month`).join("\n")}

Arithmetic illustrations, not forecasts: 25 members = $${project.offer.revenueScenarios.members25}/month, 100 = $${project.offer.revenueScenarios.members100}/month, 500 = $${project.offer.revenueScenarios.members500}/month.

## Community

${project.categories.map(category=>`- ${category.emoji} **${category.name}:** ${category.description}`).join("\n")}

**Start here:** ${project.community.startHere}

**Welcome post:** ${project.community.welcomePost}

**Tags:** ${project.tags.join(", ")}

## Classroom

${project.classroom.modules.map((module,index)=>`${index+1}. **${module.title}**: ${module.milestone}\n${module.lessons.map(lesson=>`   - ${lesson.title}: ${lesson.actionStep}`).join("\n")}`).join("\n")}

## Engagement

- First day: ${project.engagement.firstDay}
- First week: ${project.engagement.firstWeek}
- Rituals: ${project.engagement.rituals.join(", ")}
- Challenge: ${project.engagement.challenge}
- Office hours: ${project.engagement.officeHours}
- Re-engagement: ${project.engagement.reengagementMessages.join(" | ")}

## Promotion

- Channels: ${project.promotion.channels.join(", ")}
- Lead magnet: ${project.promotion.leadMagnet}
- Referral campaign: ${project.promotion.referralCampaign}
- First 25 members: ${project.promotion.first25Plan}

### 30-Day Launch Plan

${project.promotion.launchPlan.map((item,index)=>`${index+1}. ${item}`).join("\n")}

### Social Posts

${project.promotion.socialPosts.map((item,index)=>`**Post ${index+1}:** ${item}`).join("\n\n")}

### Launch Emails

${project.promotion.emails.map((item,index)=>`**Email ${index+1}:**\n${item}`).join("\n\n")}

## Launch Score

${score.total}/100, ${score.band}.

${project.disclaimers.length?`## Disclaimers\n\n${project.disclaimers.map(item=>`- ${item}`).join("\n")}`:""}
`}
export function campaignToMarkdown(project:CommunityProject){return `# ${clean(project.foundation.name)} Campaign Pack

## 30-Day Launch Plan

${project.promotion.launchPlan.map((item,index)=>`${index+1}. ${item}`).join("\n")}

## Five Social Posts

${project.promotion.socialPosts.map((item,index)=>`### Post ${index+1}\n\n${item}`).join("\n\n")}

## Three Launch Emails

${project.promotion.emails.map((item,index)=>`### Email ${index+1}\n\n${item}`).join("\n\n")}

## Referral Campaign

${project.promotion.referralCampaign}
`}
export function toJson(project:CommunityProject){return JSON.stringify(CommunityProjectSchema.parse(project),null,2)}
export function classroomToCsv(project:CommunityProject){return csv([["Module","Lesson","Objective","Action Step","Resource"],...project.classroom.modules.flatMap(module=>module.lessons.map(lesson=>[module.title,lesson.title,lesson.objective,lesson.actionStep,lesson.resource]))])}
export function communityToCsv(project:CommunityProject){return csv([["Category","Emoji","Description","Tags"],...project.categories.map(category=>[category.name,category.emoji,category.description,project.tags.join(" | ")])])}
