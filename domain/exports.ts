import {CommunityProjectSchema,type CommunityProject} from "@/domain/project-schema";
import {calculateLaunchScore,INITIAL_SCORE_VALUES} from "@/domain/scoring";
const clean=(value:string)=>value.replace(/[\u0000-\u001f]/g," ").trim();
const csv=(rows:string[][])=>rows.map(row=>row.map(value=>`"${clean(value).replace(/"/g,'""')}"`).join(",")).join("\n");
function setupInstructions(project:CommunityProject){return `## Start here: Set up your Skool group

This package is designed to work with **Skool Hobby**. You do not need Zapier or a Skool API connection to use it. Keep Community Foundry open in one tab and your Skool group open in another.

### Use the downloads in this order

1. **Start here: Skool setup guide:** Follow the checklist below from top to bottom.
2. **Launch blueprint:** Keep this open as your master reference for the offer, member journey, engagement plan, and launch decisions.
3. **Community setup CSV:** Use it as a reference while manually creating categories and tags in the Skool Community tab. It is not a Skool import file.
4. **Classroom CSV:** Use it as a reference while manually creating courses, modules, and lesson pages in the Skool Classroom tab. It is not a Skool import file.
5. **Lesson packs:** Return to the Community Foundry Classroom, open each Lesson Studio, and download the complete lesson manuscript to paste into the matching Skool lesson page.
6. **Brand images:** Return to Brand Studio to download the icon, cover, and launch graphic individually.
7. **Campaign pack:** Use the posts, emails, referral campaign, and 30-day calendar to promote the group after setup.
8. **Project data JSON:** Keep this as a Community Foundry backup. Do not upload it to Skool.

### 1. Create the group foundation in Group Settings

- Group name: **${clean(project.foundation.name)}**
- Description: ${clean(project.foundation.description)}
- Member promise: ${clean(project.foundation.promise)}
- Ideal member: ${clean(project.foundation.audience)}
- Membership model: **${project.offer.model}**
- Founding offer: ${clean(project.offer.foundingOffer)}
- Add any required disclaimers before inviting members.

### 2. Build the Community tab

- Create the categories listed in the Community setup CSV, in the same order.
- Add these tags: ${project.tags.map(clean).join(", ")}.
- Pin the Start Here instructions and welcome post from the Launch blueprint.
- Add the community rules and introduction prompt before opening the doors.

### 3. Build the Classroom tab

- Classroom name: **${clean(project.classroom.title)}**
- Create the modules in the order shown in the Classroom CSV.
- Create each lesson page under its matching module.
- Paste the complete manuscript, worksheet, quiz, action step, and media from each downloaded Lesson Studio pack.
- Set the access or drip timing in Skool after all lesson pages are in place.

### 4. Add the brand assets

- Upload the Community icon and Community cover from Brand Studio.
- Use the Launch graphic for your founding-member announcement.
- Check the desktop and mobile previews before publishing.

### 5. Prepare engagement and promotion

- Schedule the first-day and first-week actions from the Engagement section.
- Add the recurring rituals and office-hours schedule to your calendar.
- Start the Campaign pack with direct founding-member outreach before public promotion.

### 6. Final manual check

- [ ] Group name, description, pricing, and access are correct
- [ ] Categories, tags, welcome post, and rules are published
- [ ] Classroom modules and complete lessons are published in order
- [ ] Icon and cover look correct on desktop and mobile
- [ ] First member action and first event are scheduled
- [ ] Every link and invitation is tested with a non-admin account

### Optional Pro automation

Zapier is optional and requires **Skool Pro**. If you upgrade later, use it only for supported member operations such as inviting members and unlocking courses. Community creation, categories, lessons, posts, and branding still use the guided setup above.
`}

export function skoolSetupGuide(project:CommunityProject){return `# ${clean(project.foundation.name)} Skool Setup Guide

${setupInstructions(project)}
`}

export function toMarkdown(project:CommunityProject){const score=calculateLaunchScore(INITIAL_SCORE_VALUES);return `# ${clean(project.foundation.name)} Launch Blueprint

${setupInstructions(project)}

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
