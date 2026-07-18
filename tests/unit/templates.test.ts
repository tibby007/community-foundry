import { describe, expect, it } from "vitest";
import { COMMUNITY_TEMPLATES, createProjectFromScratch, createProjectFromTemplate } from "@/data/templates";
import { CommunityProjectSchema } from "@/domain/project-schema";

describe("template library", () => {
  it("contains ten unique, complete templates", () => {
    expect(COMMUNITY_TEMPLATES).toHaveLength(10);
    expect(new Set(COMMUNITY_TEMPLATES.map((item) => item.id)).size).toBe(10);

    for (const item of COMMUNITY_TEMPLATES) {
      expect(item.categories.length).toBeGreaterThanOrEqual(4);
      expect(item.classroom.modules.length).toBeGreaterThanOrEqual(4);
      expect(item.promotion.channels.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("creates a complete custom project without assigning a proven template", () => {
    const project = createProjectFromScratch("Nonprofit leaders building donor systems");
    expect(project.templateId).toBe("custom");
    expect(project.foundation.audience).toContain("Nonprofit leaders");
    expect(project.promotion.launchPlan).toHaveLength(30);
  });

  it("creates a valid editable project without mutating the template", () => {
    const project = createProjectFromTemplate(
      "consulting-client-accelerator",
      "Women over 40",
    );

    expect(CommunityProjectSchema.safeParse(project).success).toBe(true);
    expect(project.foundation.audience).toContain("Women over 40");
    expect(project.lockedPaths).toEqual([]);
    expect(COMMUNITY_TEMPLATES[0].foundation.audience).not.toContain("Women over 40");
  });

  it("requires financial and health disclaimers on regulated templates", () => {
    const finance = COMMUNITY_TEMPLATES.find((item) => item.id === "debt-freedom-accountability");
    const fitness = COMMUNITY_TEMPLATES.find((item) => item.id === "fitness-habit-accountability");

    expect(finance?.disclaimers.join(" ")).toMatch(/education/i);
    expect(fitness?.disclaimers.join(" ")).toMatch(/medical/i);
  });
});
