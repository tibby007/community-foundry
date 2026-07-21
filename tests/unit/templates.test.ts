import { describe, expect, it } from "vitest";
import { COMMUNITY_TEMPLATES, createProjectFromScratch, createProjectFromTemplate } from "@/data/templates";
import { CommunityProjectSchema } from "@/domain/project-schema";
import { createBrandAssetDataUrl } from "@/lib/brand-system";

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

  it("treats a request to create a Skool group as platform intent, not the community topic", () => {
    const project = createProjectFromScratch("I want to create a Skool group for my gardening clu");
    const foundation = JSON.stringify(project.foundation);
    const projectText = JSON.stringify(project);

    expect(project.foundation.name).toMatch(/gardening club/i);
    expect(project.foundation.audience).toMatch(/gardening/i);
    expect(project.foundation.audience).not.toMatch(/^i want to$/i);
    expect(project.foundation.promise).toMatch(/gardening/i);
    expect(foundation).not.toMatch(/create a skool group|skool group for creator/i);
    expect(project.categories.map((category) => category.name).join(" ")).toMatch(/gardening/i);
    expect(project.classroom.modules.map((module) => module.title).join(" ")).toMatch(/gardening/i);
    expect(project.promotion.leadMagnet).toMatch(/gardening/i);
    expect(projectText).not.toMatch(/i want to want to|a skool group for creator/i);
  });

  it("generalizes club-community requests beyond gardening", () => {
    const project = createProjectFromScratch("Create a community for our neighborhood photography club");
    const projectText = JSON.stringify(project);

    expect(project.foundation.name).toMatch(/neighborhood photography club/i);
    expect(project.foundation.audience).toMatch(/photography/i);
    expect(projectText).toMatch(/photography/i);
    expect(projectText).not.toMatch(/gardening|skool group for creator/i);
  });

  it("creates a teachable topic-aware classroom instead of generic understand and apply lessons", () => {
    const gardening = createProjectFromScratch("I want to create a Skool group for my gardening club");
    const photography = createProjectFromScratch("Create a community for our neighborhood photography club");
    const gardeningClassroom = JSON.stringify(gardening.classroom);
    const photographyClassroom = JSON.stringify(photography.classroom);

    expect(gardening.classroom.modules).toHaveLength(6);
    expect(gardening.classroom.modules.flatMap((module) => module.lessons)).toHaveLength(12);
    expect(gardeningClassroom).toMatch(/gardening goal|gardening essentials|gardening project|gardening progress/i);
    expect(gardeningClassroom).not.toMatch(/Understand Welcome|Apply Welcome|Understand Share|Apply Share/i);
    expect(photographyClassroom).toMatch(/photography goal|photography essentials|photography project|photography progress/i);
    expect(photographyClassroom).not.toMatch(/gardening/i);
  });

  it("recommends a visual direction from the scratch topic", () => {
    const garden = createProjectFromScratch("I help women over 40 create beautiful gardens");
    const technology = createProjectFromScratch("I help women over 50 build AI agents");
    expect(garden.brand.direction).toBe("warm");
    expect(technology.brand.direction).not.toBe(garden.brand.direction);
    expect(technology.brand.palette).not.toEqual(garden.brand.palette);
  });

  it("personalizes unrelated scratch ideas without leaking the AI-agent example", () => {
    const project = createProjectFromScratch("I help local business owners automate client follow-up");

    expect(project.foundation.name).toMatch(/Client Follow-Up/i);
    expect(project.foundation.audience).toMatch(/local business owners/i);
    expect(project.foundation.promise).toMatch(/automate client follow-up/i);
    expect(project.foundation.description).not.toMatch(/AI agent|women over 50/i);
  });

  it("builds every scratch section from the user's idea without consulting-template leakage", () => {
    const project = createProjectFromScratch("I help local business owners automate client follow-up");
    const completeProject = JSON.stringify(project);

    expect(completeProject).toMatch(/automate client follow-up/i);
    expect(completeProject).not.toMatch(/consulting|consultant|paying clients|profitable niche|close the right clients|deliver and refer|LinkedIn authority content|strategic referral partners/i);
    expect(project.classroom.modules.map((module) => module.title).join(" ")).toMatch(/client follow-up/i);
    expect(project.categories.map((category) => category.name).join(" ")).not.toMatch(/client accountability|client wins/i);
    expect(project.promotion.socialPosts.join(" ")).toMatch(/client follow-up/i);
    expect(project.promotion.emails.join(" ")).toMatch(/client follow-up/i);
  });

  it("requires financial and health disclaimers on regulated templates", () => {
    const finance = COMMUNITY_TEMPLATES.find((item) => item.id === "debt-freedom-accountability");
    const fitness = COMMUNITY_TEMPLATES.find((item) => item.id === "fitness-habit-accountability");

    expect(finance?.disclaimers.join(" ")).toMatch(/education/i);
    expect(fitness?.disclaimers.join(" ")).toMatch(/medical/i);
  });

  it("gives visual directions distinct palettes instead of one purple default", () => {
    const palettes = COMMUNITY_TEMPLATES.map((template) => template.brand.palette.join(","));
    expect(new Set(palettes).size).toBeGreaterThanOrEqual(5);
    const warm = COMMUNITY_TEMPLATES.find((template) => template.brand.direction === "warm");
    expect(warm?.brand.palette.join(" ")).not.toMatch(/7657FF/i);
  });

  it("wraps long community names in generated covers instead of clipping them", () => {
    const url = createBrandAssetDataUrl({
      assetType: "cover",
      communityName: "Beautiful Gardens Creator Lab for Women Over Forty",
      promise: "Create a beautiful garden with guided projects and practical feedback.",
      palette: ["#2F3B2E", "#A65232", "#D8A65A", "#FAF3E7"],
    });
    const svg = decodeURIComponent(url.split(",")[1]);
    expect(svg).toContain("<tspan");
    expect(svg).toContain("Beautiful Gardens");
    expect(svg).toContain("Creator");
    expect(svg).toContain("Lab");
  });
});
