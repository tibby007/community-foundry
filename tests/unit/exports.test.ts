import { describe, expect, it } from "vitest";
import { createProjectFromTemplate } from "@/data/templates";
import { campaignToMarkdown, classroomToCsv, communityToCsv, toJson, toMarkdown } from "@/domain/exports";

describe("launch package exports", () => {
  const project = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");

  it("exports every required section without secrets", () => {
    const md = toMarkdown(project);
    for (const heading of ["Foundation", "Offer", "Community", "Classroom", "Engagement", "Promotion", "Launch Score"]) {
      expect(md).toContain(`## ${heading}`);
    }
    expect(md).toContain("30-Day Launch Plan");
    expect(md).not.toMatch(/OPENAI_API_KEY|SUPABASE_SERVICE_ROLE_KEY/i);
    expect(() => JSON.parse(toJson(project))).not.toThrow();
  });

  it("starts with clear Skool Hobby setup instructions and file mapping", () => {
    const md = toMarkdown(project);
    expect(md).toContain("## Start here: Set up your Skool group");
    expect(md).toContain("Skool Hobby");
    expect(md).toContain("Group Settings");
    expect(md).toContain("Community tab");
    expect(md).toContain("Classroom tab");
    expect(md).toContain("Brand Studio");
    expect(md).toMatch(/Zapier[\s\S]*optional[\s\S]*Skool Pro/i);
  });

  it("creates quoted classroom and community CSV files", () => {
    expect(classroomToCsv(project)).toContain('"Module"');
    expect(communityToCsv(project)).toContain('"Category"');
  });

  it("exports five posts, three emails, and thirty launch days", () => {
    const campaign = campaignToMarkdown(project);
    expect(campaign.match(/^### Post/gm)).toHaveLength(5);
    expect(campaign.match(/^### Email/gm)).toHaveLength(3);
    expect(project.promotion.launchPlan).toHaveLength(30);
  });
});
