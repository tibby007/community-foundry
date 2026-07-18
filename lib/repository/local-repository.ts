import { CommunityProjectSchema, type CommunityProject } from "@/domain/project-schema";
import type { ProjectRepository } from "@/lib/repository/project-repository";

const STORAGE_KEY = "community-foundry.projects.v1";

export class LocalProjectRepository implements ProjectRepository {
  private read(): CommunityProject[] {
    if (typeof window === "undefined") return [];
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const result = CommunityProjectSchema.array().safeParse(parsed);
    return result.success ? result.data : [];
  }

  async get(id: string) {
    return this.read().find((project) => project.id === id) ?? null;
  }

  async save(project: CommunityProject) {
    const projects = this.read().filter((item) => item.id !== project.id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...projects, CommunityProjectSchema.parse(project)]));
  }

  async list() {
    return this.read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }
}
