"use client";

import { useEffect, useState } from "react";
import type { CommunityProject } from "@/domain/project-schema";
import { CommunityProjectSchema } from "@/domain/project-schema";
import { StudioShell } from "@/components/studio/studio-shell";

export function StudioLoader({ projectId, fallbackProject }: { projectId: string; fallbackProject: CommunityProject }) {
  const [project, setProject] = useState<CommunityProject | null>(null);
  useEffect(() => {
    Promise.resolve().then(() => {
      const raw = window.localStorage.getItem(`community-foundry.project.${projectId}`);
      const parsed = raw ? CommunityProjectSchema.safeParse(JSON.parse(raw)) : null;
      setProject(parsed?.success ? parsed.data : fallbackProject);
    });
  }, [projectId, fallbackProject]);
  if (!project) return <main className="studio-loading" role="status">Preparing your Community Studio…</main>;
  return <StudioShell initialProject={project} storageKey={projectId} />;
}
