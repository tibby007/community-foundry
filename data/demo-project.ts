import { createProjectFromTemplate } from "@/data/templates";

export function createDemoProject() {
  const project = createProjectFromTemplate(
    "consulting-client-accelerator",
    "I help women over 40 turn their corporate experience into a consulting business",
  );
  return {
    ...project,
    id: "demo",
    foundation: {
      ...project.foundation,
      name: "The Second Act Consulting Lab",
      alternatives: ["Second Act Client Accelerator", "Experience to Expertise Lab"],
      promise: "Turn your corporate experience into a focused consulting offer and land your first five clients.",
      audience: "Women over 40 turning corporate experience into a consulting business",
    },
  };
}
