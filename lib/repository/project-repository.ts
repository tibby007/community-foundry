import type { CommunityProject } from "@/domain/project-schema";

export interface ProjectRepository {
  get(id: string): Promise<CommunityProject | null>;
  save(project: CommunityProject): Promise<void>;
  list(): Promise<CommunityProject[]>;
}
