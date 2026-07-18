import { StudioLoader } from "@/components/studio/studio-loader";
import { createProjectFromScratch, createProjectFromTemplate } from "@/data/templates";
import { createDemoProject } from "@/data/demo-project";

export default async function BuildPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const fallbackProject = projectId === "demo" ? createDemoProject() : projectId.startsWith("custom-") ? createProjectFromScratch("People I can help with my expertise") : createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
  return <StudioLoader projectId={projectId} fallbackProject={fallbackProject} />;
}
