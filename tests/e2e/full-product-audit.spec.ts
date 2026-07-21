import { expect, test } from "@playwright/test";

test("a custom community completes every Studio step and working action", async ({ page }) => {
  test.setTimeout(120_000);
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help women over 40 create beautiful gardens");
  await page.getByRole("button", { name: /build from scratch with ai/i }).click();

  const communityName = page.getByLabel("Community name");
  await expect(communityName).toHaveValue(/Beautiful Gardens/i);
  const originalName = await communityName.inputValue();
  await communityName.fill("Garden Makers Club");
  await page.getByRole("button", { name: /^undo$/i }).click();
  await expect(communityName).toHaveValue(originalName);
  await page.getByRole("button", { name: /apply suggestion/i }).click();
  await expect(page.getByLabel("Community preview")).toContainText(/visible first milestone/i);

  await page.getByRole("button", { name: /continue to offer/i }).click();
  await page.getByLabel("Membership model").selectOption("freemium");
  await page.getByLabel("Monthly price").fill("37");
  await expect(page.getByLabel("Community preview")).toContainText("$37");

  await page.getByRole("button", { name: /continue to community/i }).click();
  await page.getByRole("textbox", { name: "Category name" }).first().fill("Garden Welcome");
  await expect(page.getByLabel("Community preview")).toContainText("Garden Welcome");

  await page.getByRole("button", { name: /continue to classroom/i }).click();
  await expect(page.getByText(/turn the outline into a complete, ready-to-teach lesson/i)).toBeVisible();
  await page.getByRole("button", { name: /open lesson studio/i }).first().click();
  await page.getByRole("button", { name: /build complete lesson/i }).click();
  await expect(page.getByLabel("Lesson manuscript")).toHaveValue(/beautiful gardens/i);
  await page.getByRole("button", { name: /generate lesson image/i }).click();
  await expect(page.getByRole("img", { name: /generated visual/i })).toBeVisible();
  await page.getByRole("button", { name: /create 8-second video clip/i }).click();
  await expect(page.getByRole("status")).toContainText(/production pack|video script|render/i);
  const lessonDownload = page.waitForEvent("download");
  await page.getByRole("button", { name: /download lesson pack/i }).click();
  expect((await lessonDownload).suggestedFilename()).toMatch(/\.md$/);

  await page.getByRole("button", { name: /continue to engagement/i }).click();
  await page.getByLabel("First-day win").fill("Share a photo and choose the first garden bed.");
  await page.getByText(/view 30-day engagement calendar/i).click();
  await expect(page.locator(".calendar-plan ol").first()).toBeVisible();

  await page.getByRole("button", { name: /continue to brand/i }).click();
  const previewCover = page.locator(".preview-cover");
  const startingBackground = await previewCover.evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.getByRole("button", { name: /bold/i }).click();
  const boldBackground = await previewCover.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(boldBackground).not.toBe(startingBackground);
  await page.getByRole("button", { name: /warm/i }).click();
  const warmBackground = await previewCover.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(warmBackground).not.toMatch(/115, 87, 255|118, 87, 255|7357ff|7657ff/i);
  const fallbackCover = page.getByRole("img", { name: /community cover/i });
  await expect(fallbackCover).toHaveAttribute("src", /^data:image\/svg\+xml/);
  await expect(fallbackCover).not.toHaveAttribute("src", /community-cover\.svg/i);
  await page.getByRole("button", { name: /generate variation for community cover/i }).click();
  await expect(page.getByText(/custom fallback/i)).toBeVisible();
  await page.getByRole("button", { name: /use community cover/i }).click();

  const coach = page.locator(".coach-card");
  const coachBodySize = await coach.locator("p").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  const coachButtonSize = await coach.getByRole("button").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(coachBodySize).toBeGreaterThanOrEqual(14);
  expect(coachButtonSize).toBeGreaterThanOrEqual(12);

  await page.getByRole("button", { name: /continue to promotion/i }).click();
  const referral = page.getByLabel("Referral campaign");
  const referralBefore = await referral.inputValue();
  await page.getByRole("button", { name: /apply referral campaign/i }).click();
  await expect(referral).not.toHaveValue(referralBefore);
  await expect(page.getByText("86", { exact: true })).toBeVisible();
  await page.getByLabel("Social post 1").fill("Show us the garden space you are transforming.");

  await page.getByRole("button", { name: /continue to launch/i }).click();
  await expect(page.getByText(/Skool Hobby: guided setup/i)).toBeVisible();
  await expect(page.getByText(/no connection required/i)).toBeVisible();
  await expect(page.getByText(/Zapier.*optional.*Skool Pro/i)).toBeVisible();
  await expect(page.getByText(/credential check required/i)).toHaveCount(0);
  const exports = page.locator(".export-center");
  for (const label of ["Start here: Skool setup guide", "Launch blueprint", "Project data", "Classroom", "Community setup", "Campaign pack"]) {
    const download = page.waitForEvent("download");
    await exports.getByRole("button", { name: new RegExp(label, "i") }).click();
    expect((await download).suggestedFilename().length).toBeGreaterThan(5);
  }
  await page.getByRole("button", { name: "Mobile", exact: true }).click();
  await expect(page.getByLabel("Community preview")).toHaveClass(/mobile-preview/);
  expect(pageErrors).toEqual([]);
});
