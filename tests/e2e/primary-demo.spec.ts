import { expect, test } from "@playwright/test";

test("builds, improves, and exports the Second Act community", async ({ page }) => {
  await page.goto("/");
  await page
    .getByLabel("Describe your community idea")
    .fill("I help women over 40 turn their corporate experience into a consulting business.");
  await page.getByRole("button", { name: /build my community/i }).click();
  await expect(page.getByRole("heading", { name: "Foundation" })).toBeVisible();
  await page.getByRole("button", { name: /apply suggestion/i }).click();
  await expect(page.getByLabel("Community preview")).toContainText("The Second Act Consulting Lab");
  await page.getByRole("button", { name: /07\s*promotion/i }).click();
  await expect(page.getByText("74", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /apply referral campaign/i }).click();
  await expect(page.getByText("86", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /08\s*launch/i }).click();
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: /launch blueprint/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("blueprint.md");
});

test("direct demo route renders without credentials", async ({ page }) => {
  await page.goto("/build/demo");
  await expect(page.getByRole("heading", { name: "Foundation" })).toBeVisible();
  await page.getByRole("button", { name: /06\s*brand/i }).click();
  await expect(page.getByText("Community icon", { exact: true })).toBeVisible();
});

test("mobile layout exposes every build stage", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/build/demo");
  await expect(page.getByRole("button", { name: /08\s*launch/i })).toBeVisible();
  await page.getByRole("button", { name: /08\s*launch/i }).click();
  await expect(page.getByText("COMMUNITY LAUNCH SCORE")).toBeVisible();
});
