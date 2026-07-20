import { expect, test } from "@playwright/test";

test("all ten proven templates open complete Studio projects", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /start with a proven template/i }).click();
  const templateNames = ["Consulting Client Accelerator","Creator Revenue Lab","AI-Powered Business Builder","Freelancer Growth Collective","Debt Freedom and Money Accountability","Fitness and Habit Accountability","Career Pivot and Job Search Lab","Real Estate Investor Launchpad","Language Learning Accountability Club","Productivity and Focus Systems"];
  for (const name of templateNames) {
    await page.getByRole("button", { name: new RegExp(name, "i") }).click();
    await expect(page.getByRole("heading", { name: "Foundation" })).toBeVisible();
    await expect(page.getByLabel("Community name")).toHaveValue(name);
    await page.getByRole("link", { name: /back to templates/i }).click();
    await page.getByRole("button", { name: /start with a proven template/i }).click();
  }
});

test("build-from-scratch creates an editable autosaved project", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help women over 50 build AI agents");
  await page.getByRole("button", { name: /build from scratch with ai/i }).click();
  await expect(page.getByLabel("Community name")).toHaveValue("AI Agent Builder Lab");
  await expect(page.getByLabel("Ideal member")).toHaveValue(/women over 50/i);
  await expect(page.getByLabel("Community promise")).toHaveValue(/build AI agents/i);
  await page.getByRole("button", { name: /03\s*community/i }).click();
  await expect(page.getByRole("textbox", { name: "Category name" }).nth(1)).toHaveValue(/AI Agent Strategy/i);
  await page.getByRole("button", { name: /04\s*classroom/i }).click();
  await expect(page.getByRole("textbox", { name: "Module title" }).nth(1)).toHaveValue(/AI Agent Fundamentals/i);
  await page.getByRole("button", { name: /07\s*promotion/i }).click();
  await expect(page.getByLabel("Social post 1")).toHaveValue(/AI agent/i);
  await page.getByRole("button", { name: /01\s*foundation/i }).click();
  await page.getByRole("button", { name: /continue to offer/i }).click();
  await expect(page.getByRole("heading", { name: "Offer" })).toBeVisible();
  await page.getByRole("button", { name: /regenerate section: offer/i }).click();
  await expect(page.getByText(/focused offer recommendation is ready/i)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /apply regenerated suggestion/i }).click();
  await page.getByRole("button", { name: /01\s*foundation/i }).click();
  await page.getByLabel("Community name").fill("The Women 50+ AI Agent Lab");
  await page.waitForTimeout(600);
  const routeId = page.url().split("/").pop();
  const savedName = await page.evaluate((id) => JSON.parse(window.localStorage.getItem(`community-foundry.project.${id}`) ?? "{}").foundation?.name, routeId);
  expect(savedName).toBe("The Women 50+ AI Agent Lab");
  await page.reload();
  await expect(page.getByLabel("Community name")).toHaveValue("The Women 50+ AI Agent Lab");
});

test("primary build button creates a custom project from the entered idea", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help women over 40 create beautiful gardens");
  await page.getByRole("button", { name: /build my community/i }).click();

  await expect(page.getByLabel("Community name")).toHaveValue(/Beautiful Gardens/i);
  await expect(page.getByLabel("Community name")).not.toHaveValue(/Consulting Client Accelerator/i);
  await expect(page.getByLabel("Ideal member")).toHaveValue(/women over 40/i);
  await expect(page.getByLabel("Community promise")).toHaveValue(/create beautiful gardens/i);
});

test("a scratch route never falls back to the consulting template", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help women over 40 create beautiful gardens");
  await page.getByRole("button", { name: /build from scratch with ai/i }).click();
  await expect(page.getByLabel("Community name")).toHaveValue(/Beautiful Gardens/i);
  const routeId = page.url().split("/").pop();
  await page.evaluate((id) => window.localStorage.setItem(`community-foundry.project.${id}`, "invalid saved data"), routeId);
  await page.reload();

  await expect(page.getByLabel("Community name")).not.toHaveValue(/Consulting/i);
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
  await expect(page.getByText(/validated recommendation is ready/i)).toBeVisible({ timeout: 30_000 });
  await page.getByRole("button", { name: /apply regenerated suggestion/i }).click();
  await page.getByRole("button", { name: /06\s*brand/i }).click();
  await page.getByRole("button", { name: /generate variation for community icon/i }).click();
  await expect(page.getByText("Custom fallback").first()).toBeVisible({ timeout: 30_000 });
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
