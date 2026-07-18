import { chromium } from "@playwright/test";
import path from "node:path";

const baseURL = process.env.CAPTURE_BASE_URL ?? "http://localhost:3200";
const outputDir = process.env.CAPTURE_OUTPUT_DIR;
if (!outputDir) throw new Error("CAPTURE_OUTPUT_DIR is required");

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: outputDir, size: { width: 1280, height: 720 } } });
const page = await context.newPage();
await page.goto(baseURL);
await page.screenshot({ path: path.join(outputDir, "community-foundry-landing.png"), fullPage: true });
await page.getByLabel("Describe your community idea").fill("I help women over 40 turn their corporate experience into a consulting business.");
await page.getByRole("button", { name: /build my community/i }).click();
await page.getByRole("button", { name: /apply suggestion/i }).click();
await page.getByLabel("Community preview").getByText("The Second Act Consulting Lab", { exact: true }).first().waitFor();
await page.screenshot({ path: path.join(outputDir, "community-foundry-studio.png"), fullPage: true });
await page.getByRole("button", { name: /07\s*promotion/i }).click();
await page.getByRole("button", { name: /apply referral campaign/i }).click();
await page.screenshot({ path: path.join(outputDir, "community-foundry-score-86.png"), fullPage: true });
await page.getByRole("button", { name: /08\s*launch/i }).click();
await page.screenshot({ path: path.join(outputDir, "community-foundry-launch.png"), fullPage: true });
await page.waitForTimeout(750);
const video = page.video();
await context.close();
if (video) await video.saveAs(path.join(outputDir, "community-foundry-backup-demo.webm"));
await browser.close();
