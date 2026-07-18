import type { CommunityProject } from "@/domain/project-schema";

export function EngagementEditor({ project, onChange }: { project: CommunityProject; onChange?: (project: CommunityProject, path: string) => void }) {
  const plan = project.engagement;
  const update = (changes: Partial<typeof plan>, path: string) => onChange?.({ ...project, engagement: { ...plan, ...changes } }, path);
  return <div className="section-form"><div className="engagement-grid">
    <article><label>First-day win<textarea value={plan.firstDay} onChange={(event)=>update({firstDay:event.target.value},"engagement.firstDay")}/></label></article>
    <article><label>First-week milestone<textarea value={plan.firstWeek} onChange={(event)=>update({firstWeek:event.target.value},"engagement.firstWeek")}/></label></article>
    <article className="wide"><label>Community rituals<textarea value={plan.rituals.join("\n")} onChange={(event)=>update({rituals:event.target.value.split("\n").filter(Boolean)},"engagement.rituals")}/></label></article>
    <article><label>Challenge<textarea value={plan.challenge} onChange={(event)=>update({challenge:event.target.value},"engagement.challenge")}/></label></article>
    <article><label>Recognition<textarea value={plan.recognition} onChange={(event)=>update({recognition:event.target.value},"engagement.recognition")}/></label></article>
    <article><label>Office hours<textarea value={plan.officeHours} onChange={(event)=>update({officeHours:event.target.value},"engagement.officeHours")}/></label></article>
    <article><label>Founder cadence<textarea value={plan.founderCadence} onChange={(event)=>update({founderCadence:event.target.value},"engagement.founderCadence")}/></label></article>
  </div><details className="calendar-plan"><summary>View 30-day engagement calendar</summary><ol>{plan.calendar.map((item)=><li key={item}>{item}</li>)}</ol></details></div>;
}
