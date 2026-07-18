import { expect, test } from "@playwright/test";

test("build-from-scratch creates an editable autosaved project", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I teach nonprofit leaders to build sustainable donor systems");
  await page.getByRole("button", { name: /build from scratch with ai/i }).click();
  await expect(page.getByLabel("Community name")).toHaveValue("My Expert Community");
  await page.getByLabel("Community name").fill("The Sustainable Donor Lab");
  await page.waitForTimeout(600);
  const routeId = page.url().split("/").pop();
  const savedName = await page.evaluate((id) => JSON.parse(window.localStorage.getItem(`community-foundry.project.${id}`) ?? "{}").foundation?.name, routeId);
  expect(savedName).toBe("The Sustainable Donor Lab");
  await page.reload();
  await expect(page.getByLabel("Community name")).toHaveValue("The Sustainable Donor Lab");
});

test("all strategy stages expose editable controls and contextual previews", async ({ page }) => {
  await page.goto("/build/demo");
  await page.getByRole("button", { name: /02\s*offer/i }).click();
  await page.getByLabel("Monthly price").fill("59");
  await expect(page.getByLabel("Community preview")).toContainText("$59");
  await page.getByRole("button", { name: /03\s*community/i }).click();
  await expect(page.getByLabel("Start-here instructions")).toBeEditable();
  await page.getByRole("button", { name: /04\s*classroom/i }).click();
  await expect(page.getByLabel("Classroom title")).toBeEditable();
  await page.getByRole("button", { name: /05\s*engagement/i }).click();
  await expect(page.getByLabel("Office hours")).toBeEditable();
  await page.getByRole("button", { name: /07\s*promotion/i }).click();
  await expect(page.getByLabel("Social post 1")).toBeEditable();
});

test("AI and image fallback preserve a complete credential-free demo", async ({ page }) => {
  await page.goto("/build/demo");
  await page.getByRole("button", { name: /regenerate section/i }).click();
  await expect(page.getByText(/validated recommendation is ready/i)).toBeVisible();
  await page.getByRole("button", { name: /apply regenerated suggestion/i }).click();
  await page.getByRole("button", { name: /06\s*brand/i }).click();
  await page.getByRole("button", { name: /generate variation for community icon/i }).click();
  await expect(page.getByText("Demo-safe generated fallback").first()).toBeVisible();
});

test("preview supports mobile mode, keyboard navigation, and reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/build/demo");
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.getByLabel("Community preview")).toHaveClass(/mobile-preview/);
  await page.getByRole("button", { name: /01\s*foundation/i }).focus();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: /02\s*offer/i })).toBeFocused();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

test("launch package includes the campaign export and unsupported Skool routes", async ({ page }) => {
  await page.goto("/build/demo");
  await page.getByRole("button", { name: /08\s*launch/i }).click();
  const campaignDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: /campaign pack/i }).click();
  expect((await campaignDownload).suggestedFilename()).toContain("campaign.md");
  await expect(page.getByText("Export required").first()).toBeVisible();
});
