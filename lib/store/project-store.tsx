"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { CommunityProject } from "@/domain/project-schema";
import { applyProposal, undoLastChange, type ProjectProposal } from "@/domain/proposals";
import type { ProjectRepository } from "@/lib/repository/project-repository";

type SaveStatus = "idle" | "saving" | "saved" | "error";

type ProjectStoreValue = {
  project: CommunityProject;
  saveStatus: SaveStatus;
  acceptProposal: (proposal: ProjectProposal) => void;
  editField: (path: string, value: unknown, section: ProjectProposal["section"]) => void;
  undo: () => void;
};

const ProjectStoreContext = createContext<ProjectStoreValue | null>(null);

export function ProjectStoreProvider({
  initialProject,
  repository,
  children,
}: {
  initialProject: CommunityProject;
  repository: ProjectRepository;
  children: React.ReactNode;
}) {
  const [project, setProject] = useState(initialProject);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSaveStatus("saving");
    const timeout = window.setTimeout(() => {
      repository.save(project).then(
        () => setSaveStatus("saved"),
        () => setSaveStatus("error"),
      );
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [project, repository]);

  const acceptProposal = useCallback((proposal: ProjectProposal) => {
    setProject((current) => applyProposal(current, proposal).project);
  }, []);

  const editField = useCallback((path: string, value: unknown, section: ProjectProposal["section"]) => {
    setProject((current) => {
      const unlocked = { ...current, lockedPaths: current.lockedPaths.filter((item) => item !== path) };
      const updated = applyProposal(unlocked, {
        id: crypto.randomUUID(),
        section,
        changes: { [path]: value },
      }).project;
      return { ...updated, lockedPaths: [...updated.lockedPaths, path] };
    });
  }, []);

  const undo = useCallback(() => setProject((current) => undoLastChange(current)), []);
  const value = useMemo(() => ({ project, saveStatus, acceptProposal, editField, undo }), [project, saveStatus, acceptProposal, editField, undo]);

  return <ProjectStoreContext.Provider value={value}>{children}</ProjectStoreContext.Provider>;
}

export function useProjectStore() {
  const value = useContext(ProjectStoreContext);
  if (!value) throw new Error("useProjectStore must be used inside ProjectStoreProvider.");
  return value;
}
