# Community Foundry

Community Foundry turns an idea into a launch-ready Skool community business. It combines ten research-backed vertical templates, a true build-from-scratch path, an AI-assisted Studio, complete course production, community architecture, launch scoring, brand assets, campaign copy, and guided exports.

**Live demo:** [communityfoundry.app](https://communityfoundry.app)

**Public repository:** [github.com/tibby007/community-foundry](https://github.com/tibby007/community-foundry)

## What it builds

- A specific community name, promise, audience, transformation, positioning, and rules.
- Free, freemium, paid, cohort, or tiered membership offers with pricing guidance.
- Discussion categories, tags, onboarding prompts, welcome content, and moderation guidance.
- A six-module, twelve-lesson classroom built around the user's actual topic.
- Complete lesson manuscripts, examples, exercises, worksheets, quizzes, action steps, narration, and media prompts.
- Individual lesson image and short-video controls, plus a downloadable complete-course package.
- A 30-day engagement calendar, promotion strategy, campaign assets, launch score, and guided Skool setup package.
- Editable desktop and mobile previews, autosave, undo, AI-assisted regeneration, and exports.

## Why I built it

Community Foundry began with my frustration manually building my own Skool communities. Defining the offer, pricing, classroom, discussion structure, engagement plan, branding, and launch campaign took far longer than creating the community itself. I built Community Foundry to turn that fragmented process into one guided, editable workflow.

## How Codex was used

Codex was the development partner throughout the build. It helped translate the product idea into an implementation plan, build the Next.js application, connect OpenAI and Supabase, create the AI-assisted Community Studio, troubleshoot deployment issues, and verify the finished production experience with unit, component, and end-to-end browser tests.

Codex also helped create the ten-template system, topic-aware complete-course engine, deterministic demo fallbacks, structured export packages, responsive previews, launch-scoring workflow, and guarded Skool capability adapter. The final production pass used regression-first debugging and live browser verification against the exact gardening-club flow that exposed the classroom-quality problem.

## How GPT-5.6 Sol was used

GPT-5.6 Sol powers the live community strategy and lesson-production experience through the OpenAI Responses API. It transforms incomplete user ideas into structured community plans, generates targeted recommendations, explains why those recommendations matter, improves individual sections without silently replacing user-edited work, and produces complete lesson packs for the generated classroom.

Model output is schema-validated before it enters application state. Users explicitly choose when to apply AI recommendations, and deterministic fallbacks preserve the complete product experience if an external request is unavailable.

GPT Image powers optional community brand concepts and visual assets.

## Hackathon demo

1. Open [communityfoundry.app](https://communityfoundry.app) and enter: `I want to create a Skool group for my gardening club.`
2. Select **Build my community**.
3. Review the topic-specific Foundation, Offer, Community, and live preview.
4. Open **Classroom** and select **Build the full course**. The system creates six modules and twelve complete lessons in one action.
5. Review the automatically opened lesson manuscript, worksheet, quiz, narration, and image/video controls.
6. Select **Download complete course** to export the full teaching package with Skool usage instructions.
7. Use the AI Coach in any strategy section to request a focused improvement, then review and apply the proposal.
8. Open **Brand** to create or download the icon, cover, and launch graphic.
9. Open **Promotion** and apply the referral campaign recommendation.
10. Open **Launch** to review the score and download the guided Skool setup and campaign packages.

The full-course build can take approximately 15 to 25 seconds on the live site. Progress is displayed while all twelve lessons are created. Deterministic fallbacks preserve the complete demo experience if an external generation request is unavailable.

## Instructions for judges

No account or credentials are required. Use the public live demo and follow the Hackathon demo above. Community Foundry is an independent product and is not affiliated with Skool. Because public Skool creation capabilities are limited and plan-dependent, the product guarantees guided setup instructions and downloadable assets instead of claiming an unsupported direct publish.

## Local setup

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `/build/demo` to enter the seeded Studio directly.

## Environment variables

- `OPENAI_API_KEY`: Enables structured generation and `gpt-image-2` brand variations.
- `OPENAI_MODEL`: Responses API model. The demo fallback remains available.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Browser-safe Supabase anonymous key.
- `SUPABASE_SERVICE_ROLE_KEY`: Server-only administrative key. Never expose it to the browser.
- `DEMO_FALLBACK`: Set to `true` for a completely credential-free demo.
- `SKOOL_MCP_URL`: Verified Skool MCP endpoint, if available.
- `SKOOL_MCP_TOKEN`: Token for that verified endpoint.

## Verification

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run test:e2e
```

Current verified release evidence:

- 52 unit and component tests passing.
- 17 complete local browser journeys passing.
- The mobile gardening-club build and legacy-project repair journeys passing against the production URL.
- Production Next.js build, TypeScript, and ESLint checks passing.

## Architecture and safety

- Next.js App Router, React, TypeScript, Zod, OpenAI SDK, and Supabase.
- AI output is schema-validated before it enters project state.
- AI suggestions are proposals with explicit apply and undo behavior.
- User-edited fields are locked against silent AI replacement.
- Browser persistence keeps the demo resilient when Supabase is unavailable.
- Skool actions use an allowlist and confirmation token. Unsupported capabilities are clearly labeled.
- Export is the guaranteed delivery path.

Supabase schema and row-level security live in `supabase/migrations`. Netlify build settings live in `netlify.toml`.
