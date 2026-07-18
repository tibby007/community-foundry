import type { CommunityProject } from "@/domain/project-schema";

export function EngagementEditor({ project }: { project: CommunityProject }) {
  const plan = project.engagement;
  return <div className="engagement-grid">
    <article><small>FIRST-DAY WIN</small><h3>{plan.firstDay}</h3></article>
    <article><small>FIRST-WEEK MILESTONE</small><h3>{plan.firstWeek}</h3></article>
    <article className="wide"><small>COMMUNITY RITUALS</small>{plan.rituals.map((ritual) => <div className="ritual" key={ritual}>{ritual}</div>)}</article>
    <article><small>7-DAY CHALLENGE</small><h3>{plan.challenge}</h3></article>
    <article><small>RECOGNITION</small><h3>{plan.recognition}</h3></article>
  </div>;
}
