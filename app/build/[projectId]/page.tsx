import { StudioLoader } from "@/components/studio/studio-loader";
import { createProjectFromTemplate } from "@/data/templates";

export default async function BuildPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const fallbackProject = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
  return <StudioLoader projectId={projectId} fallbackProject={fallbackProject} />;
}
