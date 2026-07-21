"use client";

import Image from "next/image";
import { useState } from "react";
import type { CommunityProject } from "@/domain/project-schema";
import { buildTopicAwareModules, inferCourseTopic } from "@/lib/course-structure";

type Lesson = CommunityProject["classroom"]["modules"][number]["lessons"][number];

export function ClassroomEditor({ project, onChange }: { project: CommunityProject; onChange?: (project: CommunityProject, path: string) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [notice, setNotice] = useState<Record<string, string>>({});
  const [courseProgress, setCourseProgress] = useState({ complete: 0, total: 0 });
  const [courseNotice, setCourseNotice] = useState("");
  const update = (changes: Partial<CommunityProject["classroom"]>, path: string) => onChange?.({ ...project, classroom: { ...project.classroom, ...changes } }, path);
  const changeLesson = (mi: number, li: number, changes: Partial<Lesson>, path: string) => {
    const modules = structuredClone(project.classroom.modules);
    Object.assign(modules[mi].lessons[li], changes);
    update({ modules }, path);
  };
  const buildLesson = async (mi: number, li: number) => {
    const lesson = project.classroom.modules[mi].lessons[li];
    setLoading(`lesson-${lesson.id}`);
    try {
      const response = await fetch("/api/lessons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ communityName: project.foundation.name, audience: project.foundation.audience, transformation: project.foundation.transformation, moduleTitle: project.classroom.modules[mi].title, lessonTitle: lesson.title, brandDirection: project.brand.direction, palette: project.brand.palette }) });
      if (!response.ok) throw new Error();
      const result = await response.json();
      changeLesson(mi, li, result.content, `classroom.modules.${mi}.lessons.${li}`);
      setNotice((v) => ({ ...v, [lesson.id]: result.provider === "openai" ? "Complete lesson created with AI." : "Complete lesson created with the reliable demo engine." }));
    } catch { setNotice((v) => ({ ...v, [lesson.id]: "Lesson generation failed. Please try again." })); }
    finally { setLoading(null); }
  };
  const requestLesson = async (moduleTitle: string, lessonTitle: string) => {
    const response = await fetch("/api/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        communityName: project.foundation.name,
        audience: project.foundation.audience,
        transformation: project.foundation.transformation,
        moduleTitle,
        lessonTitle,
        brandDirection: project.brand.direction,
        palette: project.brand.palette,
      }),
    });
    if (!response.ok) throw new Error("Lesson generation failed");
    return (await response.json()) as { content: Partial<Lesson>; provider: "openai" | "fallback" };
  };
  const buildFullCourse = async () => {
    const genericOutline = project.classroom.modules.some((module) => module.lessons.some((item) => /^(Understand|Apply)\b/i.test(item.title)));
    const modules = structuredClone(genericOutline ? buildTopicAwareModules(inferCourseTopic(project)) : project.classroom.modules);
    const lessonJobs = modules.flatMap((module, mi) => module.lessons.map((item, li) => ({ module, item, mi, li })));
    setLoading("course");
    setCourseProgress({ complete: 0, total: lessonJobs.length });
    setCourseNotice("");
    let complete = 0;
    try {
      await Promise.all(lessonJobs.map(async ({ module, item, mi, li }) => {
        const result = await requestLesson(module.title, item.title);
        Object.assign(modules[mi].lessons[li], result.content);
        complete += 1;
        setCourseProgress({ complete, total: lessonJobs.length });
      }));
      update({ modules }, "classroom.modules");
      setExpanded(modules[0]?.lessons[0]?.id ?? null);
      setCourseNotice(`${modules.length} modules and ${lessonJobs.length} complete lessons are ready. The first lesson is open below.`);
    } catch {
      setCourseNotice("The full course could not be completed. Your existing classroom is unchanged. Try again.");
    } finally {
      setLoading(null);
    }
  };
  const generateImage = async (mi: number, li: number) => {
    const lesson = project.classroom.modules[mi].lessons[li];
    setLoading(`image-${lesson.id}`);
    try {
      const response = await fetch("/api/images", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ assetType: "lesson", prompt: lesson.imagePrompt || `Educational visual for ${lesson.title}`, communityName: project.foundation.name, promise: lesson.title, palette: project.brand.palette }) });
      if (!response.ok) throw new Error();
      const result = await response.json();
      changeLesson(mi, li, { imageUrl: result.url }, `classroom.modules.${mi}.lessons.${li}.imageUrl`);
      setNotice((v) => ({ ...v, [lesson.id]: "Lesson image ready." }));
    } catch { setNotice((v) => ({ ...v, [lesson.id]: "Image generation failed. Please try again." })); }
    finally { setLoading(null); }
  };
  const createVideo = async (mi: number, li: number) => {
    const lesson = project.classroom.modules[mi].lessons[li];
    setLoading(`video-${lesson.id}`);
    try {
      const response = await fetch("/api/videos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: lesson.videoPrompt || `Polished educational intro for ${lesson.title}`, seconds: "8" }) });
      if (!response.ok) throw new Error();
      const result = await response.json();
      changeLesson(mi, li, { videoId: result.id, videoStatus: result.status }, `classroom.modules.${mi}.lessons.${li}.videoStatus`);
      setNotice((v) => ({ ...v, [lesson.id]: result.message || "Video render started. Check its status in a moment." }));
    } catch { setNotice((v) => ({ ...v, [lesson.id]: "Video request failed. Your script is still available." })); }
    finally { setLoading(null); }
  };
  const downloadPack = (lesson: Lesson, moduleTitle: string) => {
    const text = [`# ${lesson.title}`, `Module: ${moduleTitle}`, `\n## Objective\n${lesson.objective}`, `\n## Lesson manuscript\n${lesson.manuscript}`, `\n## Key points\n${lesson.keyPoints.map((point) => `- ${point}`).join("\n")}`, `\n## Example\n${lesson.example}`, `\n## Exercise\n${lesson.exercise}`, `\n## Worksheet\n${lesson.worksheet}`, `\n## Quiz\n${lesson.quiz.map((q, i) => `${i + 1}. ${q.question}\nAnswer: ${q.answer}`).join("\n\n")}`, `\n## Action step\n${lesson.actionStep}`, `\n## Video script\n${lesson.videoScript}`, `\n## Image prompt\n${lesson.imagePrompt}`, `\n## Video prompt\n${lesson.videoPrompt}`].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${lesson.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.md`; anchor.click(); URL.revokeObjectURL(url);
  };
  const downloadCompleteCourse = () => {
    const text = [
      `# ${project.classroom.title}`,
      `\n## Member transformation\n${project.classroom.transformation}`,
      `\n## How to use this course\nCreate each module in Skool Classroom in the order shown. Add each lesson under its module, paste in the manuscript and worksheet, then upload any generated media. Review and personalize the teaching examples before publishing.`,
      ...project.classroom.modules.flatMap((module, moduleIndex) => [
        `\n# Module ${moduleIndex + 1}: ${module.title}\nMilestone: ${module.milestone}`,
        ...module.lessons.map((item, lessonIndex) => [
          `\n## Lesson ${moduleIndex + 1}.${lessonIndex + 1}: ${item.title}`,
          `### Objective\n${item.objective}`,
          `### Manuscript\n${item.manuscript}`,
          `### Key teaching points\n${item.keyPoints.map((point) => `- ${point}`).join("\n")}`,
          `### Practical example\n${item.example}`,
          `### Exercise\n${item.exercise}`,
          `### Worksheet\n${item.worksheet}`,
          `### Quiz\n${item.quiz.map((question, index) => `${index + 1}. ${question.question}\nAnswer: ${question.answer}`).join("\n\n")}`,
          `### Action step\n${item.actionStep}`,
          `### Video narration\n${item.videoScript}`,
          `### Image prompt\n${item.imagePrompt}`,
          `### Video prompt\n${item.videoPrompt}`,
        ].join("\n\n")),
      ]),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.classroom.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-complete-course.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const courseReady = project.classroom.modules.every((module) => module.lessons.every((item) => item.manuscript.length > 0));
  return <div className="section-form">
    <aside className="lesson-studio-callout" aria-label="Full lesson creation">
      <div className="course-build-heading"><div><b>Build the full course, not just an outline</b><p>One click creates every complete lesson with a manuscript, worksheet, quiz, exercise, narration, and media prompts. You can still edit or rebuild any lesson afterward.</p></div><button type="button" onClick={buildFullCourse} disabled={loading !== null}>{loading === "course" ? `Building lesson ${courseProgress.complete} of ${courseProgress.total}…` : "Build the full course"}</button></div>
      {courseProgress.total > 0 && loading === "course" && <progress aria-label="Full course build progress" value={courseProgress.complete} max={courseProgress.total}/>}
      {courseNotice && <p className="course-build-notice" role="status">{courseNotice}</p>}
      {courseReady && <button className="download-course-button" type="button" onClick={downloadCompleteCourse}>Download complete course</button>}
    </aside>
    <div className="editor-card">
      <label>Classroom title<input value={project.classroom.title} onChange={(e) => update({ title: e.target.value }, "classroom.title")}/></label>
      <label>Member transformation<textarea value={project.classroom.transformation} onChange={(e) => update({ transformation: e.target.value }, "classroom.transformation")}/></label>
      <label>Unlock cadence<input value={project.classroom.unlockCadence} onChange={(e) => update({ unlockCadence: e.target.value }, "classroom.unlockCadence")}/></label>
      <label>Completion reward<input value={project.classroom.completionReward} onChange={(e) => update({ completionReward: e.target.value }, "classroom.completionReward")}/></label>
    </div>
    <div className="curriculum-list"><div className="curriculum-meta"><span>{project.classroom.modules.length} MODULES</span><b>{project.classroom.unlockCadence}</b></div>
      {project.classroom.modules.map((module, mi) => <article key={module.id}><span>{String(mi + 1).padStart(2, "0")}</span><section>
        <label>Module title<input value={module.title} onChange={(e) => { const modules = structuredClone(project.classroom.modules); modules[mi].title = e.target.value; update({ modules }, `classroom.modules.${mi}.title`); }}/></label>
        <label>Milestone<textarea value={module.milestone} onChange={(e) => { const modules = structuredClone(project.classroom.modules); modules[mi].milestone = e.target.value; update({ modules }, `classroom.modules.${mi}.milestone`); }}/></label>
        <small>{module.lessons.length} lessons</small>
        {module.lessons.map((lesson, li) => <div className="lesson-row" key={lesson.id}>
          <label>Lesson title<input value={lesson.title} onChange={(e) => changeLesson(mi, li, { title: e.target.value }, `classroom.modules.${mi}.lessons.${li}.title`)}/></label>
          <button type="button" onClick={() => setExpanded(expanded === lesson.id ? null : lesson.id)}>{expanded === lesson.id ? "Close lesson studio" : "Open lesson studio"}</button>
          {expanded === lesson.id && <div className="lesson-manuscript">
            <div className="lesson-production-heading"><b>Lesson Production Studio</b><button type="button" onClick={() => buildLesson(mi, li)} disabled={loading !== null}>{loading === `lesson-${lesson.id}` ? "Building complete lesson…" : "Build complete lesson"}</button></div>
            <label>Objective<textarea value={lesson.objective} onChange={(e) => changeLesson(mi, li, { objective: e.target.value }, `classroom.modules.${mi}.lessons.${li}.objective`)}/></label>
            {lesson.manuscript ? <div className="lesson-production-fields">
              <label>Lesson manuscript<textarea aria-label="Lesson manuscript" className="lesson-long-field" value={lesson.manuscript} onChange={(e) => changeLesson(mi, li, { manuscript: e.target.value }, `classroom.modules.${mi}.lessons.${li}.manuscript`)}/></label>
              <label>Key teaching points<textarea value={lesson.keyPoints.join("\n")} onChange={(e) => changeLesson(mi, li, { keyPoints: e.target.value.split("\n").filter(Boolean) }, `classroom.modules.${mi}.lessons.${li}.keyPoints`)}/></label>
              <label>Practical example<textarea value={lesson.example} onChange={(e) => changeLesson(mi, li, { example: e.target.value }, `classroom.modules.${mi}.lessons.${li}.example`)}/></label>
              <label>Exercise<textarea value={lesson.exercise} onChange={(e) => changeLesson(mi, li, { exercise: e.target.value }, `classroom.modules.${mi}.lessons.${li}.exercise`)}/></label>
              <label>Worksheet<textarea value={lesson.worksheet} onChange={(e) => changeLesson(mi, li, { worksheet: e.target.value }, `classroom.modules.${mi}.lessons.${li}.worksheet`)}/></label>
              <label>Video narration script<textarea value={lesson.videoScript} onChange={(e) => changeLesson(mi, li, { videoScript: e.target.value }, `classroom.modules.${mi}.lessons.${li}.videoScript`)}/></label>
              <label>Image prompt<textarea value={lesson.imagePrompt} onChange={(e) => changeLesson(mi, li, { imagePrompt: e.target.value }, `classroom.modules.${mi}.lessons.${li}.imagePrompt`)}/></label>
              <label>Video prompt<textarea value={lesson.videoPrompt} onChange={(e) => changeLesson(mi, li, { videoPrompt: e.target.value }, `classroom.modules.${mi}.lessons.${li}.videoPrompt`)}/></label>
              <div className="lesson-media-actions"><button type="button" onClick={() => generateImage(mi, li)} disabled={loading !== null}>{loading === `image-${lesson.id}` ? "Generating image…" : "Generate lesson image"}</button><button type="button" onClick={() => createVideo(mi, li)} disabled={loading !== null}>{loading === `video-${lesson.id}` ? "Starting video…" : "Create 8-second video clip"}</button><button type="button" onClick={() => downloadPack(lesson, module.title)}>Download lesson pack</button>{lesson.videoId && lesson.videoStatus === "completed" && <a href={`/api/videos/${lesson.videoId}/content`}>Download video</a>}</div>
              {lesson.imageUrl && <Image unoptimized className="lesson-image-preview" src={lesson.imageUrl} width={1200} height={800} sizes="(max-width: 1050px) 100vw, 50vw" alt={`Generated visual for ${lesson.title}`}/>}<small>Short video clips are visual intros or B-roll. The complete narration is included in the lesson pack.</small>
            </div> : <div><label>Summary<textarea value={lesson.summary} onChange={(e) => changeLesson(mi, li, { summary: e.target.value }, `classroom.modules.${mi}.lessons.${li}.summary`)}/></label><label>Action step<textarea value={lesson.actionStep} onChange={(e) => changeLesson(mi, li, { actionStep: e.target.value }, `classroom.modules.${mi}.lessons.${li}.actionStep`)}/></label></div>}
            {notice[lesson.id] && <p className="lesson-notice" role="status">{notice[lesson.id]}</p>}
          </div>}
        </div>)}
      </section></article>)}
    </div>
  </div>;
}
