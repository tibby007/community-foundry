# Community Foundry Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a demo-safe AI studio that turns a coach or consultant's idea into a scored, branded, exportable Skool community business in under three minutes.

**Architecture:** Build a Next.js application around one canonical `CommunityProject` document. Pure domain modules calculate scores, merge accepted proposals, render previews, and produce exports; server routes call OpenAI for structured text and images; repository and publishing adapters isolate Supabase and Skool from the UI. The seeded demo and deterministic fallback provider keep the judging flow operational when an external service is slow or unavailable.

**Tech Stack:** Next.js 16.2.10, React 19.2.7, TypeScript, Tailwind CSS, OpenAI SDK 6.48.0, Zod 4.4.3, Supabase JS 2.110.7, Vitest 4.1.10, Testing Library, Playwright 1.61.1, Netlify.

## Global Constraints

- Deployment target is Netlify.
- The application must not imply endorsement by or affiliation with Skool.
- Export works whether or not Skool is connected.
- No Reddit scraping or storage of Reddit posts, comments, or user profiles.
- All external publishing requires a content preview and explicit user confirmation.
- User edits are canonical and cannot be silently overwritten by regeneration.
- Financial and health templates display educational-use disclaimers.
- API keys remain server-side and never appear in exports, browser storage, or logs.
- The clean-browser demo must complete in under three minutes.
- Use `app.aimarvelsinc.com` for any future GoHighLevel reference, never `app.gohighlevel.com`.
- No live billing in the hackathon prototype.

---

## Planned File Map

```text
app/
  api/generate/route.ts             validated structured text generation
  api/images/route.ts               generated visual assets
  api/skool/capabilities/route.ts   safe Skool capability report
  api/skool/publish/route.ts        confirmed allowlisted publishing
  build/[projectId]/page.tsx        Studio route
  page.tsx                          template and custom-idea entry
  layout.tsx                        app metadata and global shell
components/
  entry/                             template gallery and custom intake
  studio/                            build rail, preview, AI coach, editors
  preview/                           community, classroom, offer, mobile views
  score/                             score ring and evidence breakdown
  brand/                             image direction and asset cards
  export/                            export center
  skool/                             capability and publish confirmation UI
data/
  templates.ts                       ten complete template seeds
  market-signals.ts                  curated, dated, cited signal records
domain/
  project-schema.ts                  canonical Zod schemas and TypeScript types
  proposals.ts                       locked-field-safe proposal application
  scoring.ts                         deterministic Launch Score calculation
  exports.ts                         Markdown, JSON, and CSV serializers
  capabilities.ts                    Skool allowlist and routing logic
lib/
  ai/client.ts                       server-only OpenAI client
  ai/contracts.ts                    generation request and response schemas
  ai/prompts.ts                      focused module prompts
  ai/provider.ts                     live and deterministic fallback providers
  repository/project-repository.ts   persistence interface
  repository/local-repository.ts     demo/browser implementation
  repository/supabase-repository.ts  authenticated implementation
  supabase/client.ts                 browser client
  supabase/server.ts                 server client
  skool/provider.ts                  capability-based provider interface
  store/project-store.tsx            client state and autosave orchestration
tests/
  unit/                              pure domain and contract tests
  component/                         Studio behavior tests
  e2e/                               primary demo, fallback, and export flows
supabase/migrations/                 projects and assets schema
public/demo/                         deterministic sample images
netlify.toml                         build and function configuration
```

---

### Task 1: Application Shell and Test Harness

**Files:**
- Create: `package.json`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/smoke.test.ts`
- Create: `.env.example`, `.gitignore`, `netlify.toml`

**Interfaces:**
- Produces: runnable Next.js app, `npm run test`, `npm run test:e2e`, `npm run build`

- [ ] **Step 1: Initialize Git and scaffold the application**

Run:

```bash
git init
npx create-next-app@16.2.10 scaffold --ts --tailwind --eslint --app --src-dir=false --import-alias='@/*' --use-npm
```

Move the generated scaffold contents into the repository root with `rsync`, excluding its `.git`, then remove only the validated temporary `scaffold` directory.

Expected: `npm run dev` serves the generated Next.js page.

- [ ] **Step 2: Add test and application dependencies**

Run:

```bash
npm install openai@6.48.0 zod@4.4.3 @supabase/supabase-js@2.110.7 lucide-react clsx tailwind-merge
npm install -D vitest@4.1.10 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test@1.61.1
npx playwright install chromium
```

Add scripts: `test`, `test:watch`, `test:e2e`, and `typecheck`.

- [ ] **Step 3: Write and run the shell test**

```ts
// tests/unit/smoke.test.ts
import { describe, expect, it } from "vitest";

describe("Community Foundry", () => {
  it("has a working test harness", () => expect(true).toBe(true));
});
```

Run: `npm test -- tests/unit/smoke.test.ts`  
Expected: one passing test.

- [ ] **Step 4: Replace boilerplate with the branded entry shell**

The page must render the name, tagline, the two entry paths, and the disclaimer `Independent product. Not affiliated with Skool.` Use semantic headings, visible focus states, and CSS design tokens for ink, canvas, violet, mint, amber, and danger colors.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git add .
git commit -m "chore: scaffold Community Foundry"
```

Expected: all commands pass and the first commit is created.

---

### Task 2: Canonical Project Schema and Ten Templates

**Files:**
- Create: `domain/project-schema.ts`
- Create: `data/templates.ts`
- Create: `tests/unit/project-schema.test.ts`
- Create: `tests/unit/templates.test.ts`

**Interfaces:**
- Produces: `CommunityProjectSchema`, `CommunityProject`, `CommunityTemplate`, `COMMUNITY_TEMPLATES`, `createProjectFromTemplate(templateId, ownerInput)`

- [ ] **Step 1: Write failing schema and template tests**

```ts
import { describe, expect, it } from "vitest";
import { COMMUNITY_TEMPLATES, createProjectFromTemplate } from "@/data/templates";

describe("template library", () => {
  it("contains ten unique launchable templates", () => {
    expect(COMMUNITY_TEMPLATES).toHaveLength(10);
    expect(new Set(COMMUNITY_TEMPLATES.map((item) => item.id)).size).toBe(10);
    for (const item of COMMUNITY_TEMPLATES) {
      expect(item.categories.length).toBeGreaterThanOrEqual(4);
      expect(item.classroom.modules.length).toBeGreaterThanOrEqual(4);
      expect(item.promotion.channels.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("creates an editable project without mutating the template", () => {
    const project = createProjectFromTemplate("consulting-client-accelerator", "Women over 40");
    expect(project.foundation.audience).toContain("Women over 40");
    expect(project.lockedPaths).toEqual([]);
  });
});
```

Run: `npm test -- tests/unit/templates.test.ts`  
Expected: FAIL because the modules do not exist.

- [ ] **Step 2: Implement the canonical Zod model**

Define schemas for metadata, foundation, offer, pricing tiers, categories, tags, classroom modules and lessons, engagement plan, promotion plan, brand assets, score dimensions, citations, locked paths, and generation history. Export the inferred TypeScript types. Every list has a sensible minimum and every URL uses `z.url()`.

- [ ] **Step 3: Implement all ten complete templates**

Use these exact IDs:

```ts
const templateIds = [
  "consulting-client-accelerator",
  "creator-revenue-lab",
  "ai-business-builder",
  "freelancer-growth-collective",
  "debt-freedom-accountability",
  "fitness-habit-accountability",
  "career-pivot-lab",
  "real-estate-investor-launchpad",
  "language-learning-club",
  "productivity-focus-systems",
] as const;
```

Each record includes the full starter foundation, model and price hypothesis, at least four categories, at least four classroom modules, engagement rituals, at least two channels, visual direction, and required disclaimers.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/project-schema.test.ts tests/unit/templates.test.ts`  
Expected: all tests pass.

```bash
git add domain data tests/unit
git commit -m "feat: add project schema and template library"
```

---

### Task 3: Locked-Field-Safe Proposal Engine and Project Store

**Files:**
- Create: `domain/proposals.ts`
- Create: `lib/store/project-store.tsx`
- Create: `lib/repository/project-repository.ts`
- Create: `lib/repository/local-repository.ts`
- Create: `tests/unit/proposals.test.ts`
- Create: `tests/component/project-store.test.tsx`

**Interfaces:**
- Consumes: `CommunityProject`
- Produces: `ProjectProposal`, `applyProposal(project, proposal)`, `undoLastChange(project)`, `ProjectRepository`, `useProjectStore()`

- [ ] **Step 1: Write the locked-path regression test**

```ts
it("preserves a user-locked promise during regeneration", () => {
  const edited = { ...project, lockedPaths: ["foundation.promise"] };
  const proposal = { id: "p1", section: "foundation", changes: {
    "foundation.promise": "AI replacement",
    "foundation.name": "Second Act Lab",
  }};
  const result = applyProposal(edited, proposal);
  expect(result.project.foundation.promise).toBe(project.foundation.promise);
  expect(result.project.foundation.name).toBe("Second Act Lab");
  expect(result.skippedPaths).toEqual(["foundation.promise"]);
});
```

Run: `npm test -- tests/unit/proposals.test.ts`  
Expected: FAIL because `applyProposal` does not exist.

- [ ] **Step 2: Implement immutable proposals, locks, and undo**

Only allow paths present in an explicit section allowlist. Applying a proposal creates a history entry containing before and after values. Undo reverses the most recent accepted history entry. Invalid or cross-section paths return typed errors.

- [ ] **Step 3: Implement repository and autosave contracts**

```ts
export interface ProjectRepository {
  get(id: string): Promise<CommunityProject | null>;
  save(project: CommunityProject): Promise<void>;
  list(): Promise<CommunityProject[]>;
}
```

The local implementation stores only non-secret project JSON under `community-foundry.projects.v1`. The provider debounces saves and surfaces `idle`, `saving`, `saved`, and `error` states.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/proposals.test.ts tests/component/project-store.test.tsx`  
Expected: all tests pass.

```bash
git add domain lib tests
git commit -m "feat: add safe project state and autosave"
```

---

### Task 4: Structured AI Provider With Deterministic Fallback

**Files:**
- Create: `lib/ai/client.ts`, `lib/ai/contracts.ts`, `lib/ai/prompts.ts`, `lib/ai/provider.ts`
- Create: `app/api/generate/route.ts`
- Create: `tests/unit/ai-contracts.test.ts`
- Create: `tests/unit/ai-provider.test.ts`

**Interfaces:**
- Produces: `GenerationSection`, `GenerationRequestSchema`, `GenerationResponseSchema`, `GenerationProvider.generate(request)`, POST `/api/generate`

- [ ] **Step 1: Write contract and fallback tests**

```ts
it("returns a valid deterministic proposal when fallback mode is enabled", async () => {
  const response = await fallbackProvider.generate({
    project,
    section: "foundation",
    instruction: "Strengthen the promise",
  });
  expect(GenerationResponseSchema.safeParse(response).success).toBe(true);
  expect(response.proposal.section).toBe("foundation");
});
```

Run: `npm test -- tests/unit/ai-contracts.test.ts tests/unit/ai-provider.test.ts`  
Expected: FAIL because the contracts and provider do not exist.

- [ ] **Step 2: Define request and response contracts**

Sections are `foundation`, `offer`, `community`, `classroom`, `engagement`, `promotion`, and `assessment`. Responses contain a proposal, concise explanation, confidence from 0 to 1, warnings, citations, and affected score dimensions.

- [ ] **Step 3: Implement focused prompts and OpenAI provider**

Each prompt includes only the canonical project, relevant section schema, locked paths, and user instruction. The server route validates input, performs one structured-output repair attempt, and returns a recoverable 422 response after a second validation failure.

- [ ] **Step 4: Implement deterministic demo fallback**

When `DEMO_FALLBACK=true` or the live request times out, return validated fixture proposals tailored to the seeded Second Act Consulting Lab project. Set `meta.provider` to `fallback` so the UI can disclose it without blocking the demo.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- tests/unit/ai-contracts.test.ts tests/unit/ai-provider.test.ts`  
Expected: all tests pass without an API key.

```bash
git add lib/ai app/api/generate tests/unit
git commit -m "feat: add validated AI generation provider"
```

---

### Task 5: Template, Build-From-Scratch, and Hybrid Studio Foundation Slice

**Files:**
- Create: `components/entry/template-gallery.tsx`, `components/entry/custom-intake.tsx`
- Create: `components/studio/studio-shell.tsx`, `build-rail.tsx`, `ai-coach.tsx`, `section-editor.tsx`
- Create: `components/preview/community-preview.tsx`
- Create: `app/build/[projectId]/page.tsx`
- Create: `tests/component/studio-foundation.test.tsx`

**Interfaces:**
- Consumes: project store and `/api/generate`
- Produces: template/custom entry, three-panel Studio, editable Foundation, Offer, and Community sections

- [ ] **Step 1: Write the primary interaction test**

```tsx
it("accepts an AI recommendation and updates the live preview", async () => {
  render(<StudioShell initialProject={project} provider={fakeProvider} />);
  await user.click(screen.getByRole("button", { name: /strengthen promise/i }));
  await user.click(await screen.findByRole("button", { name: /apply suggestion/i }));
  expect(screen.getByLabelText("Community preview")).toHaveTextContent("land five consulting clients");
  expect(screen.getByText(/saved/i)).toBeVisible();
});
```

Run: `npm test -- tests/component/studio-foundation.test.tsx`  
Expected: FAIL because the Studio does not exist.

- [ ] **Step 2: Implement template and custom entry**

The gallery displays ten outcome-led cards and a custom idea field. Submitting creates a project, saves it, and navigates to `/build/{id}`. Custom intake asks audience, expertise, and transformation in one compact step.

- [ ] **Step 3: Implement the responsive three-region Studio**

Desktop uses build rail, preview, and coach. Tablet collapses the coach into a drawer. Mobile uses Preview, Build, and Coach tabs. Preserve keyboard order independent of visual columns.

- [ ] **Step 4: Implement Foundation, Offer, and Community editing**

Support accept, edit, regenerate, ask why, apply, and undo. Manual edits lock their field paths. Display generation progress and recoverable errors adjacent to the requesting section.

- [ ] **Step 5: Verify and commit**

Run:

```bash
npm test -- tests/component/studio-foundation.test.tsx
npm run lint
npm run typecheck
git add app components tests/component
git commit -m "feat: build hybrid Community Studio"
```

Expected: all commands pass.

---

### Task 6: Classroom and Engagement Vertical Slice

**Files:**
- Create: `components/studio/classroom-editor.tsx`, `engagement-editor.tsx`
- Create: `components/preview/classroom-preview.tsx`
- Create: `tests/component/classroom-engagement.test.tsx`

**Interfaces:**
- Produces: reorderable modules and lessons, lesson expansion action, thirty-day engagement plan

- [ ] **Step 1: Write the editing isolation test**

```tsx
it("expands one lesson without replacing neighboring lessons", async () => {
  render(<ClassroomEditor project={project} provider={fakeProvider} />);
  await user.click(screen.getByRole("button", { name: /expand define your niche/i }));
  expect(await screen.findByText(/lesson manuscript/i)).toBeVisible();
  expect(screen.getByText("Package Your Offer")).toBeVisible();
});
```

- [ ] **Step 2: Implement classroom editing and preview**

Support module and lesson editing, lesson expansion, unlock cadence, action steps, and resource concepts. Do not generate every manuscript automatically.

- [ ] **Step 3: Implement engagement editor**

Render first-day, first-week, rituals, challenges, recognition, office hours, re-engagement, churn warnings, and a thirty-day calendar.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/component/classroom-engagement.test.tsx`  
Expected: all tests pass.

```bash
git add components tests/component
git commit -m "feat: add classroom and engagement engine"
```

---

### Task 7: Deterministic Community Launch Score

**Files:**
- Create: `domain/scoring.ts`
- Create: `components/score/launch-score.tsx`, `score-breakdown.tsx`
- Create: `tests/unit/scoring.test.ts`
- Create: `tests/component/launch-score.test.tsx`

**Interfaces:**
- Produces: `calculateLaunchScore(dimensions)`, `scoreBand(total)`, `LaunchScore`

- [ ] **Step 1: Write arithmetic and boundary tests**

```ts
it("weights dimensions and assigns the correct band", () => {
  const result = calculateLaunchScore({
    problemUrgency: 80,
    transformationClarity: 90,
    audienceSpecificity: 70,
    willingnessToPay: 75,
    founderCredibility: 80,
    curriculumStrength: 85,
    engagementRetention: 75,
    acquisitionFeasibility: 60,
    operationalSafety: 100,
  });
  expect(result.total).toBe(79);
  expect(result.band).toBe("strong");
});
```

- [ ] **Step 2: Implement pure scoring**

Apply weights 15, 15, 10, 15, 10, 10, 10, 10, and 5. Round only the final total. Require evidence, confidence, and recommended action on each AI-supplied dimension before it enters the calculation.

- [ ] **Step 3: Implement the score experience**

Show the total, band, evidence, confidence, and action. After an accepted fix, animate only changed dimensions and announce the updated score through an `aria-live="polite"` region.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/scoring.test.ts tests/component/launch-score.test.tsx`  
Expected: all tests pass.

```bash
git add domain components/score tests
git commit -m "feat: add evidence-based launch scoring"
```

---

### Task 8: Curated Market Signal Validation

**Files:**
- Create: `data/market-signals.ts`
- Create: `components/studio/market-validation.tsx`
- Create: `tests/unit/market-signals.test.ts`

**Interfaces:**
- Produces: `MarketSignal`, `getSignalsForTemplate(id)`, cited validation panel

- [ ] **Step 1: Write provenance tests**

```ts
it("requires a source, access date, and permitted summary for every signal", () => {
  for (const signal of MARKET_SIGNALS) {
    expect(signal.sourceUrl).toMatch(/^https:\/\//);
    expect(signal.accessedAt).toMatch(/^2026-\d{2}-\d{2}$/);
    expect(signal.summary.length).toBeLessThanOrEqual(300);
    expect(signal.rawContent).toBeUndefined();
  }
});
```

- [ ] **Step 2: Create the curated evidence records**

Add at least two dated sources per template. Store short original summaries and metrics, never copied posts or user information. Include Reddit policy sources in the internal provenance record.

- [ ] **Step 3: Implement validation UI**

Display signal strength, reasons, source links, access dates, limitations, and low-confidence state. Call the feature `Market Signal Validation` throughout the interface.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/market-signals.test.ts`  
Expected: all tests pass.

```bash
git add data components/studio tests/unit
git commit -m "feat: add cited market signal validation"
```

---

### Task 9: Promotion Engine and Score-Improvement Moment

**Files:**
- Create: `components/studio/promotion-editor.tsx`, `campaign-assets.tsx`
- Create: `components/preview/offer-preview.tsx`
- Create: `tests/component/promotion-score.test.tsx`

**Interfaces:**
- Produces: channel fit, thirty-day plan, five posts, three emails, lead magnet, referral campaign, first-25-members plan

- [ ] **Step 1: Write the demo-critical test**

```tsx
it("applies the referral recommendation and improves acquisition score", async () => {
  render(<PromotionEditor project={weakAcquisitionProject} provider={fakeProvider} />);
  expect(screen.getByText("74")).toBeVisible();
  await user.click(screen.getByRole("button", { name: /apply referral campaign/i }));
  expect(await screen.findByText("86")).toBeVisible();
  expect(screen.getByText(/acquisition feasibility improved/i)).toBeVisible();
});
```

- [ ] **Step 2: Implement promotion generation and editing**

Make each asset independently editable and regenerable. Channel recommendations include rationale and founder workload. Source-derived claims link back to citations.

- [ ] **Step 3: Implement selective score recalculation**

Only acquisition feasibility and affected retention dimensions may change when the referral proposal is accepted. Preserve every unrelated dimension and show the before/after evidence.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/component/promotion-score.test.tsx`  
Expected: all tests pass.

```bash
git add components tests/component
git commit -m "feat: add launch campaign and score improvement"
```

---

### Task 10: Brand Studio and OpenAI Image Generation

**Files:**
- Create: `app/api/images/route.ts`
- Create: `components/brand/brand-studio.tsx`, `asset-card.tsx`
- Create: `public/demo/community-icon.png`, `community-cover.png`, `promo-graphic.png`
- Create: `tests/unit/image-contract.test.ts`
- Create: `tests/component/brand-studio.test.tsx`

**Interfaces:**
- Produces: POST `/api/images`, `BrandAsset`, icon, cover, and promotional graphic with fallback assets

- [ ] **Step 1: Write image request and fallback tests**

```ts
it("requires a supported asset type and safe prompt", () => {
  expect(ImageRequestSchema.safeParse({ assetType: "cover", prompt: "Premium consulting community" }).success).toBe(true);
  expect(ImageRequestSchema.safeParse({ assetType: "unknown", prompt: "x" }).success).toBe(false);
});
```

- [ ] **Step 2: Implement server-side image generation**

Accept `icon`, `cover`, or `promotion`, construct size-aware prompts from the locked brand direction, reject unsafe input, and return asset metadata. Never expose the OpenAI key.

- [ ] **Step 3: Implement Brand Studio**

Allow direction selection, generation, variation, download, and selection as canonical. When generation fails or times out, display the seeded demo asset and label it as a fallback.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/image-contract.test.ts tests/component/brand-studio.test.tsx`  
Expected: all tests pass without live generation.

```bash
git add app/api/images components/brand public/demo tests
git commit -m "feat: add generated community brand assets"
```

---

### Task 11: Guaranteed Export Center

**Files:**
- Create: `domain/exports.ts`
- Create: `components/export/export-center.tsx`
- Create: `tests/unit/exports.test.ts`
- Create: `tests/component/export-center.test.tsx`

**Interfaces:**
- Produces: `toMarkdown(project)`, `toJson(project)`, `classroomToCsv(project)`, `communityToCsv(project)`, browser downloads

- [ ] **Step 1: Write completeness and secret-exclusion tests**

```ts
it("exports every required section without secrets", () => {
  const markdown = toMarkdown(project);
  for (const heading of ["Foundation", "Offer", "Community", "Classroom", "Engagement", "Promotion", "Launch Score"]) {
    expect(markdown).toContain(`## ${heading}`);
  }
  expect(markdown).not.toMatch(/OPENAI_API_KEY|SUPABASE_SERVICE_ROLE_KEY/i);
});
```

- [ ] **Step 2: Implement pure serializers**

Markdown includes citations and disclaimers. JSON passes through `CommunityProjectSchema`. CSV serializers quote commas, quotes, and newlines correctly. Asset filenames use a sanitized project slug.

- [ ] **Step 3: Implement download UI**

Offer Blueprint, Project JSON, Classroom CSV, Community CSV, Campaign Pack, and individual image downloads. A missing optional image does not disable written exports.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/exports.test.ts tests/component/export-center.test.tsx`  
Expected: all tests pass.

```bash
git add domain/exports.ts components/export tests
git commit -m "feat: add guaranteed launch package exports"
```

---

### Task 12: Capability-Based Skool Adapter

**Files:**
- Create: `domain/capabilities.ts`
- Create: `lib/skool/provider.ts`
- Create: `app/api/skool/capabilities/route.ts`, `app/api/skool/publish/route.ts`
- Create: `components/skool/capability-report.tsx`, `publish-confirmation.tsx`
- Create: `tests/unit/capabilities.test.ts`
- Create: `tests/component/skool-publish.test.tsx`

**Interfaces:**
- Produces: `SkoolCapability`, `SkoolProvider.capabilities()`, `SkoolProvider.publish(action, payload)`, safe confirmation workflow

- [ ] **Step 1: Write allowlist and confirmation tests**

```ts
it("routes unsupported actions to export and never executes them", async () => {
  const result = routePublishAction("create-classroom", ["invite-member"]);
  expect(result).toEqual({ mode: "export", reason: "unsupported" });
});

it("rejects publish without a confirmation token", async () => {
  const response = await publish({ action: "invite-member", confirmationToken: "" });
  expect(response.status).toBe(400);
});
```

- [ ] **Step 2: Implement provider and capability report**

Use an explicit allowlist. No arbitrary tool names or payloads may pass from the browser to the provider. Capabilities display as Supported, Export Required, or Unavailable.

- [ ] **Step 3: Implement two-step publishing**

First request creates a short-lived server-side confirmation token bound to action and payload hash. Second request consumes that token once. Record attempted action, timestamp, provider response, and status. Show success only after provider confirmation.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/capabilities.test.ts tests/component/skool-publish.test.tsx`  
Expected: all tests pass using a fake provider.

```bash
git add domain/capabilities.ts lib/skool app/api/skool components/skool tests
git commit -m "feat: add safe Skool capability adapter"
```

---

### Task 13: Supabase Persistence and Frictionless Demo Access

**Files:**
- Create: `supabase/migrations/202607180001_projects.sql`
- Create: `lib/supabase/client.ts`, `lib/supabase/server.ts`
- Create: `lib/repository/supabase-repository.ts`
- Create: `tests/unit/repository-contract.test.ts`

**Interfaces:**
- Consumes: `ProjectRepository`
- Produces: authenticated project persistence with local fallback

- [ ] **Step 1: Write the shared repository contract test**

```ts
export async function projectRepositoryContract(repository: ProjectRepository) {
  await repository.save(project);
  expect(await repository.get(project.id)).toEqual(project);
  expect((await repository.list()).map((item) => item.id)).toContain(project.id);
}
```

- [ ] **Step 2: Add migration with row-level security**

Create `community_projects` with `id uuid`, `user_id uuid`, `name text`, `project jsonb`, and timestamps. Enable row-level security and add select, insert, update, and delete policies restricted to `auth.uid() = user_id`. Create a private `community-assets` storage bucket policy scoped to the same user.

- [ ] **Step 3: Implement repository selection**

Authenticated users use Supabase. Demo users use the local repository. If Supabase configuration is absent, the app remains fully functional in demo mode and discloses that projects are stored in this browser.

- [ ] **Step 4: Verify and commit**

Run: `npm test -- tests/unit/repository-contract.test.ts`  
Expected: local contract passes; Supabase integration test skips only when test credentials are absent.

```bash
git add supabase lib/supabase lib/repository tests/unit
git commit -m "feat: add secure project persistence"
```

---

### Task 14: End-to-End Demo, Accessibility, and Failure Recovery

**Files:**
- Create: `data/demo-project.ts`
- Create: `tests/e2e/primary-demo.spec.ts`, `fallback.spec.ts`, `export.spec.ts`
- Modify: all interactive components requiring accessibility corrections

**Interfaces:**
- Produces: deterministic Second Act Consulting Lab demo and clean-browser acceptance suite

- [ ] **Step 1: Seed the exact demo state**

Create a project that begins with a score of 74, a weak acquisition dimension, and the user prompt `I help women over 40 turn their corporate experience into a consulting business.` The referral recommendation must produce validated inputs that recalculate the score to 86.

- [ ] **Step 2: Write the primary Playwright test**

```ts
test("builds and exports the Second Act Consulting Lab", async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Describe your community idea").fill("I help women over 40 turn their corporate experience into a consulting business.");
  await page.getByRole("button", { name: "Build my community" }).click();
  await expect(page.getByRole("heading", { name: "The Second Act Consulting Lab" })).toBeVisible();
  await expect(page.getByText("74")).toBeVisible();
  await page.getByRole("button", { name: /apply referral campaign/i }).click();
  await expect(page.getByText("86")).toBeVisible();
  await page.getByRole("button", { name: /export blueprint/i }).click();
});
```

- [ ] **Step 3: Add fallback and accessibility coverage**

Test AI timeout, image failure, unsupported Skool action, keyboard-only section editing, visible focus, reduced motion, `aria-live` updates, and 375-pixel mobile navigation.

- [ ] **Step 4: Run the full local gate and commit**

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
git add .
git commit -m "test: lock the hackathon demo flow"
```

Expected: all checks pass from a clean browser context.

---

### Task 15: Netlify Deployment and Submission Readiness

**Files:**
- Modify: `netlify.toml`, `.env.example`, `README.md`
- Create: `docs/demo-script.md`, `docs/release-checklist.md`

**Interfaces:**
- Produces: public Netlify deployment, rehearsed demo, recovery assets

- [ ] **Step 1: Configure production environment**

Document these variables without values:

```text
OPENAI_API_KEY
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
DEMO_FALLBACK
SKOOL_MCP_URL
SKOOL_MCP_TOKEN
```

Mark Skool variables optional. Set `DEMO_FALLBACK=false` in normal production and document the emergency toggle.

- [ ] **Step 2: Deploy to Netlify**

Run the configured Netlify deployment workflow, set secrets through Netlify's environment UI or CLI, and verify the public build uses the expected commit.

- [ ] **Step 3: Run production smoke tests**

Run Playwright against the public URL and manually verify text generation, fallback mode, all three image assets, score improvement, downloads, mobile layout, and the Skool capability report.

- [ ] **Step 4: Freeze and prepare recovery assets**

Write the three-minute demo script, capture screenshots of every key state, record a backup demo video, and keep the seeded project accessible through a non-secret demo query parameter.

- [ ] **Step 5: Final verification and release commit**

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
git add README.md docs netlify.toml .env.example
git commit -m "docs: prepare Community Foundry hackathon release"
```

Expected: every local and production check passes, the demo takes less than three minutes, and no uncommitted release changes remain.

---

## Execution Order and Feature-Freeze Rule

Tasks run in numeric order. Tasks 1 through 5 establish the first usable vertical slice. Tasks 6 through 11 complete the guaranteed product. Task 12 is never allowed to delay Task 11. Task 13 may remain in local demo mode if Supabase setup threatens the final demo. At the start of Task 14, feature development freezes and only verified demo blockers may change.

## Definition of Done

- Ten valid templates pass schema tests.
- Custom and template paths produce editable projects.
- Locked user edits survive regeneration.
- AI failures preserve the current project and activate a disclosed fallback.
- The launch score is deterministic and evidence-backed.
- Applying the referral recommendation creates the rehearsed 74-to-86 demo moment.
- Icon, cover, and promotional assets are selectable and downloadable.
- Blueprint, JSON, classroom CSV, community CSV, and campaign exports work without Skool.
- Unsupported Skool actions cannot execute.
- The app is keyboard accessible, responsive, and deployed to Netlify.
- The clean-browser demo completes in under three minutes.
