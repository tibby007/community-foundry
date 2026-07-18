import type { CommunityProject } from "@/domain/project-schema";

export function ClassroomEditor({ project }: { project: CommunityProject }) {
  return <div className="curriculum-list">
    <div className="curriculum-meta"><span>{project.classroom.modules.length} MODULES</span><b>{project.classroom.unlockCadence}</b></div>
    {project.classroom.modules.map((module, index) => <article key={module.id}><span>{String(index + 1).padStart(2, "0")}</span><section><h3>{module.title}</h3><p>{module.milestone}</p><small>{module.lessons.length} lessons · {module.lessons.map((lesson) => lesson.title).join(" · ")}</small></section></article>)}
  </div>;
}
