import { expect, test } from "@playwright/test";

test("AI Coach regenerates and applies every editable strategy section", async ({ page }) => {
  test.setTimeout(180_000);
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help local founders build resilient neighborhood businesses");
  await page.getByRole("button", { name: /build my community/i }).click();

  for (const [number, section] of [["01", "Foundation"], ["02", "Offer"], ["03", "Community"], ["04", "Classroom"], ["05", "Engagement"], ["07", "Promotion"]] as const) {
    await page.getByRole("button", { name: new RegExp(`${number}\\s*${section}`, "i") }).click();
    const instruction = page.getByLabel(/tell ai what to improve/i);
    await instruction.fill(`Make the ${section.toLowerCase()} specific to neighborhood businesses`);
    await page.getByRole("button", { name: new RegExp(`regenerate section: ${section}`, "i") }).click();
    const applyRegenerated = page.getByRole("button", { name: /apply regenerated suggestion/i });
    await expect(applyRegenerated).toBeVisible({ timeout: 25_000 });
    await applyRegenerated.click();
    await expect(page.getByText(/applied.*clearer|applied/i).first()).toBeVisible();
  }

  await page.getByRole("button", { name: /06\s*brand/i }).click();
  await expect(page.getByRole("button", { name: /regenerate section: brand/i })).toHaveCount(0);
  await page.getByRole("button", { name: /08\s*launch/i }).click();
  await expect(page.getByRole("button", { name: /regenerate section: launch/i })).toHaveCount(0);
});

test("every Brand direction and asset control produces a visible result", async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help families grow food in small urban gardens");
  await page.getByRole("button", { name: /build from scratch with ai/i }).click();
  await page.getByRole("button", { name: /06\s*brand/i }).click();
  const cover = page.locator(".preview-cover");
  const identities = new Set<string>();
  for (const direction of ["authority", "energetic", "premium", "warm", "bold"]) {
    await page.getByRole("button", { name: new RegExp(`^${direction}$`, "i") }).click();
    identities.add(await cover.evaluate((element) => getComputedStyle(element).backgroundImage));
  }
  expect(identities.size).toBe(5);

  for (const asset of ["Community icon", "Community cover", "Launch graphic"]) {
    await page.getByRole("button", { name: new RegExp(`generate variation for ${asset}`, "i") }).click();
    const card = page.locator(".brand-assets article").filter({ hasText: asset });
    await expect(card.getByText(/generated with openai|custom fallback/i)).toBeVisible({ timeout: 25_000 });
    await page.getByRole("button", { name: new RegExp(`use ${asset}`, "i") }).click();
    await expect(page.getByRole("button", { name: new RegExp(`use ${asset}`, "i") })).toHaveClass(/selected-asset/);
  }
});

test("AI Coach remains readable on a phone viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/build/demo");
  const coach = page.locator(".coach-card");
  await expect(coach).toBeVisible();
  expect(await coach.locator("p").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(14);
  expect(await coach.getByRole("button").first().evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(12);
});
