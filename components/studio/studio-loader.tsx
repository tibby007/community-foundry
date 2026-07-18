"use client";

import { useEffect, useState } from "react";
import type { CommunityProject } from "@/domain/project-schema";
import { CommunityProjectSchema } from "@/domain/project-schema";
import { StudioShell } from "@/components/studio/studio-shell";

export function StudioLoader({ projectId, fallbackProject }: { projectId: string; fallbackProject: CommunityProject }) {
  const [project, setProject] = useState<CommunityProject>(fallbackProject);
  useEffect(() => {
    Promise.resolve().then(() => {
      const raw = window.localStorage.getItem(`community-foundry.project.${projectId}`);
      const parsed = raw ? CommunityProjectSchema.safeParse(JSON.parse(raw)) : null;
      if (parsed?.success) setProject(parsed.data);
    });
  }, [projectId]);
  return <StudioShell key={`${project.id}:${project.updatedAt}`} initialProject={project} storageKey={projectId} />;
}
