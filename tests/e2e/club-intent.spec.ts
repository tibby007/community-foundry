import { expect, test } from "@playwright/test";
import { createProjectFromScratch } from "@/data/templates";

test("a mobile club request builds the club topic instead of repeating the platform instruction", async ({ page }) => {
  test.setTimeout(120_000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I want to create a Skool group for my gardening clu");
  await page.getByRole("button", { name: /build my community/i }).click();

  await expect(page.getByLabel("Community name")).toHaveValue("Gardening Club");
  await expect(page.getByLabel("Ideal member")).toHaveValue(/gardening club members/i);
  await expect(page.getByLabel("Community promise")).toHaveValue(/gardening/i);
  await expect(page.getByLabel("Community promise")).not.toHaveValue(/create a skool group/i);
  await expect(page.getByLabel("Community preview")).toContainText("Gardening Club");
  await expect(page.getByLabel("Community preview")).not.toContainText("A Skool Group For Creator Lab");

  await page.getByRole("button", { name: /03\s*community/i }).click();
  await expect(page.getByRole("textbox", { name: "Category name" }).nth(1)).toHaveValue(/gardening discussion/i);

  await page.getByRole("button", { name: /04\s*classroom/i }).click();
  await expect(page.getByLabel("Module title").nth(1)).toHaveValue(/gardening essentials/i);
  await expect(page.getByLabel("Lesson title").nth(1)).toHaveValue(/gardening goal/i);
  await page.getByRole("button", { name: /^build the full course$/i }).click();
  await expect(page.getByRole("status")).toContainText(/12 complete lessons are ready/i, { timeout: 60_000 });
  await expect(page.getByLabel("Lesson manuscript")).toHaveValue(/gardening/i);
  await expect(page.getByRole("button", { name: /download complete course/i })).toBeVisible();

  await page.getByRole("button", { name: /07\s*promotion/i }).click();
  await expect(page.getByLabel("Lead magnet")).toHaveValue(/gardening/i);
});

test("an already-saved misparsed club project repairs itself when reopened", async ({ page }) => {
  const project = createProjectFromScratch("I help neighbors create beautiful gardens");
  project.id = "legacy-club-intent";
  project.foundation.name = "A Skool Group For Creator Lab";
  project.foundation.audience = "I want to";
  project.foundation.promise = "Help I want to create a skool group for my gardening clu through guided projects, practical feedback, and peer accountability.";
  project.foundation.pain = "I want to want to create a skool group for my gardening clu, but they lack a clear roadmap.";
  project.lockedPaths = [];

  await page.goto("/");
  await page.evaluate((savedProject) => {
    window.localStorage.setItem(`community-foundry.project.${savedProject.id}`, JSON.stringify(savedProject));
  }, project);
  await page.goto(`/build/${project.id}`);

  await expect(page.getByLabel("Community name")).toHaveValue("Gardening Club");
  await expect(page.getByLabel("Ideal member")).toHaveValue(/gardening club members/i);
});
