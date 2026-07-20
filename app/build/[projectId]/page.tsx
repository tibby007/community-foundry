import { StudioLoader } from "@/components/studio/studio-loader";
import { createProjectFromScratch } from "@/data/templates";
import { createDemoProject } from "@/data/demo-project";

export default async function BuildPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const fallbackProject = projectId === "demo" ? createDemoProject() : createProjectFromScratch("People ready to achieve a clear practical result");
  return <StudioLoader projectId={projectId} fallbackProject={fallbackProject} />;
}
