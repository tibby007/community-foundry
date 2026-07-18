import type { CommunityProject } from "@/domain/project-schema";

export function CommunityEditor({ project, onChange }: { project: CommunityProject; onChange: (project: CommunityProject, path: string) => void }) {
  const updateCommunity = (changes: Partial<CommunityProject["community"]>, path: string) => onChange({ ...project, community: { ...project.community, ...changes } }, path);
  return <div className="section-form">
    <div className="editor-card">
      <label>Start-here instructions<textarea value={project.community.startHere} onChange={(event) => updateCommunity({ startHere: event.target.value }, "community.startHere")}/></label>
      <label>Welcome post<textarea value={project.community.welcomePost} onChange={(event) => updateCommunity({ welcomePost: event.target.value }, "community.welcomePost")}/></label>
      <label>Introduction prompt<textarea value={project.community.introductionPrompt} onChange={(event) => updateCommunity({ introductionPrompt: event.target.value }, "community.introductionPrompt")}/></label>
      <label>Tags<input value={project.tags.join(", ")} onChange={(event) => onChange({ ...project, tags: event.target.value.split(",").map((item)=>item.trim()).filter(Boolean) }, "tags")}/></label>
    </div>
    <div className="category-edit-list">{project.categories.map((category,index)=><article key={category.id}><label>Emoji<input aria-label={`Category ${index+1} emoji`} value={category.emoji} onChange={(event)=>{const categories=[...project.categories];categories[index]={...category,emoji:event.target.value};onChange({...project,categories},`categories.${index}.emoji`)}}/></label><label>Category name<input value={category.name} onChange={(event)=>{const categories=[...project.categories];categories[index]={...category,name:event.target.value};onChange({...project,categories},`categories.${index}.name`)}}/></label><label>Description<textarea value={category.description} onChange={(event)=>{const categories=[...project.categories];categories[index]={...category,description:event.target.value};onChange({...project,categories},`categories.${index}.description`)}}/></label></article>)}</div>
  </div>;
}
