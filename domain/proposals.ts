import type { CommunityProject } from "@/domain/project-schema";

export type ProposalSection =
  | "foundation"
  | "offer"
  | "community"
  | "classroom"
  | "engagement"
  | "promotion"
  | "brand";

export type ProjectProposal = {
  id: string;
  section: ProposalSection;
  changes: Record<string, unknown>;
};

const sectionRoots: Record<ProposalSection, string[]> = {
  foundation: ["foundation"],
  offer: ["offer"],
  community: ["categories", "tags"],
  classroom: ["classroom"],
  engagement: ["engagement"],
  promotion: ["promotion"],
  brand: ["brand"],
};

function readPath(value: object, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (typeof current !== "object" || current === null) return undefined;
    return (current as Record<string, unknown>)[key];
  }, value);
}

function writePath(value: object, path: string, nextValue: unknown): void {
  const keys = path.split(".");
  const finalKey = keys.pop();
  if (!finalKey) throw new Error("Change path cannot be empty.");
  let current = value as Record<string, unknown>;
  for (const key of keys) {
    const child = current[key];
    if (typeof child !== "object" || child === null) throw new Error(`Unknown change path: ${path}`);
    current = child as Record<string, unknown>;
  }
  if (!(finalKey in current)) throw new Error(`Unknown change path: ${path}`);
  current[finalKey] = nextValue;
}

export function applyProposal(project: CommunityProject, proposal: ProjectProposal) {
  const allowedRoots = sectionRoots[proposal.section];
  const paths = Object.keys(proposal.changes);
  for (const path of paths) {
    const root = path.split(".")[0];
    if (!allowedRoots.includes(root)) throw new Error(`${path} is not allowed in ${proposal.section}.`);
  }

  const next = structuredClone(project);
  const before: Record<string, unknown> = {};
  const after: Record<string, unknown> = {};
  const skippedPaths: string[] = [];

  for (const [path, nextValue] of Object.entries(proposal.changes)) {
    if (project.lockedPaths.includes(path)) {
      skippedPaths.push(path);
      continue;
    }
    before[path] = structuredClone(readPath(next, path));
    writePath(next, path, structuredClone(nextValue));
    after[path] = structuredClone(nextValue);
  }

  if (Object.keys(after).length) {
    next.history.push({
      id: proposal.id,
      acceptedAt: new Date().toISOString(),
      section: proposal.section,
      before,
      after,
    });
    next.updatedAt = new Date().toISOString();
  }

  return { project: next, skippedPaths };
}

export function undoLastChange(project: CommunityProject): CommunityProject {
  const next = structuredClone(project);
  const latest = next.history.pop();
  if (!latest) return next;
  for (const [path, previousValue] of Object.entries(latest.before)) {
    writePath(next, path, previousValue);
  }
  next.updatedAt = new Date().toISOString();
  return next;
}
