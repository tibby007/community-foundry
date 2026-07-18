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

  it("turns a scratch idea into a specific foundation instead of generic placeholder copy", () => {
    const project = createProjectFromScratch("I help women over 50 build AI agents");

    expect(project.foundation.name).toMatch(/AI Agent/i);
    expect(project.foundation.name).not.toBe("My Expert Community");
    expect(project.foundation.audience).toMatch(/women over 50/i);
    expect(project.foundation.promise).toMatch(/build AI agents/i);
    expect(project.foundation.pain).toMatch(/AI agent/i);
    expect(project.foundation.transformation).toMatch(/AI agent/i);
  });

  it("personalizes unrelated scratch ideas without leaking the AI-agent example", () => {
    const project = createProjectFromScratch("I help local business owners automate client follow-up");

    expect(project.foundation.name).toMatch(/Client Follow-Up/i);
    expect(project.foundation.audience).toMatch(/local business owners/i);
    expect(project.foundation.promise).toMatch(/automate client follow-up/i);
    expect(project.foundation.description).not.toMatch(/AI agent|women over 50/i);
  });

  it("requires financial and health disclaimers on regulated templates", () => {
    const finance = COMMUNITY_TEMPLATES.find((item) => item.id === "debt-freedom-accountability");
    const fitness = COMMUNITY_TEMPLATES.find((item) => item.id === "fitness-habit-accountability");

    expect(finance?.disclaimers.join(" ")).toMatch(/education/i);
    expect(fitness?.disclaimers.join(" ")).toMatch(/medical/i);
  });
});
