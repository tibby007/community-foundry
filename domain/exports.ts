import {CommunityProjectSchema,type CommunityProject} from "@/domain/project-schema";
import {calculateLaunchScore,INITIAL_SCORE_VALUES} from "@/domain/scoring";
const clean=(value:string)=>value.replace(/[\u0000-\u001f]/g," ").trim();
const csv=(rows:string[][])=>rows.map(row=>row.map(value=>`"${clean(value).replace(/"/g,'""')}"`).join(",")).join("\n");
export function toMarkdown(project:CommunityProject){const score=calculateLaunchScore(INITIAL_SCORE_VALUES);return `# ${clean(project.foundation.name)} Launch Blueprint

## Foundation

**Promise:** ${clean(project.foundation.promise)}

**Audience:** ${clean(project.foundation.audience)}

**Transformation:** ${clean(project.foundation.transformation)}

## Offer

**Model:** ${project.offer.model}

**Founding offer:** ${clean(project.offer.foundingOffer)}

${project.offer.tiers.map(tier=>`- ${tier.name}: $${tier.monthlyPrice}/month`).join("\n")}

## Community

${project.categories.map(category=>`- ${category.emoji} **${category.name}:** ${category.description}`).join("\n")}

## Classroom

${project.classroom.modules.map((module,index)=>`${index+1}. **${module.title}**: ${module.milestone}\n${module.lessons.map(lesson=>`   - ${lesson.title}: ${lesson.actionStep}`).join("\n")}`).join("\n")}

## Engagement

- First day: ${project.engagement.firstDay}
- First week: ${project.engagement.firstWeek}
- Rituals: ${project.engagement.rituals.join(", ")}
- Challenge: ${project.engagement.challenge}

## Promotion

- Channels: ${project.promotion.channels.join(", ")}
- Lead magnet: ${project.promotion.leadMagnet}
- Referral campaign: ${project.promotion.referralCampaign}
- First 25 members: ${project.promotion.first25Plan}

## Launch Score

${score.total}/100, ${score.band}.

${project.disclaimers.length?`## Disclaimers\n\n${project.disclaimers.map(item=>`- ${item}`).join("\n")}`:""}
`}
export function toJson(project:CommunityProject){return JSON.stringify(CommunityProjectSchema.parse(project),null,2)}
export function classroomToCsv(project:CommunityProject){return csv([["Module","Lesson","Objective","Action Step","Resource"],...project.classroom.modules.flatMap(module=>module.lessons.map(lesson=>[module.title,lesson.title,lesson.objective,lesson.actionStep,lesson.resource]))])}
export function communityToCsv(project:CommunityProject){return csv([["Category","Emoji","Description","Tags"],...project.categories.map(category=>[category.name,category.emoji,category.description,project.tags.join(" | ")])])}
