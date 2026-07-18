# Community Foundry

Community Foundry turns an expert's idea into a launch-ready Skool community business. It combines ten research-backed vertical templates, an AI-assisted Studio, classroom and engagement architecture, launch scoring, brand assets, campaign copy, and guaranteed exports.

**Live demo:** [community-foundry-ai-marvels.netlify.app](https://community-foundry-ai-marvels.netlify.app)

## Why I built it

Community Foundry began with my frustration manually building my own Skool communities. Defining the offer, pricing, classroom, discussion structure, engagement plan, branding, and launch campaign took far longer than creating the community itself. I built Community Foundry to turn that fragmented process into one guided, editable workflow.

## How Codex was used

Codex was the development partner throughout the build. It helped translate the product idea into an implementation plan, build the Next.js application, connect OpenAI and Supabase, create the AI-assisted Community Studio, troubleshoot deployment issues, and verify the finished production experience with unit, component, and end-to-end browser tests.

Codex also helped create the ten-template system, deterministic demo fallbacks, structured export packages, responsive previews, launch-scoring workflow, and guarded Skool capability adapter.

## How GPT-5.6 Sol was used

GPT-5.6 Sol powers the live community strategy experience through the OpenAI Responses API. It transforms incomplete user ideas into structured community plans, generates targeted recommendations, explains why those recommendations matter, and improves individual sections without silently replacing user-edited work.

Model output is schema-validated before it enters application state. Users explicitly choose when to apply AI recommendations, and deterministic fallbacks preserve the complete product experience if an external request is unavailable.

GPT Image powers optional community brand concepts and visual assets.

## Hackathon demo

1. Open the landing page and enter: `I help women over 40 turn their corporate experience into a consulting business.`
2. Select **Build my community**.
3. Apply the AI Coach suggestion and watch the live preview update.
4. Open **Promotion**. Apply the referral campaign to move the Launch Score from 74 to 86.
5. Open **Brand** to generate or download the icon, cover, and launch graphic.
6. Open **Launch** to download the blueprint, JSON, classroom CSV, and community CSV.
7. Review the Skool capability report. Supported actions require confirmation. Unsupported actions always retain an export path.

The entire flow works without credentials through deterministic demo fallbacks.

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

## Architecture and safety

- Next.js App Router, React, TypeScript, Zod, OpenAI SDK, and Supabase.
- AI output is schema-validated before it enters project state.
- AI suggestions are proposals with explicit apply and undo behavior.
- User-edited fields are locked against silent AI replacement.
- Browser persistence keeps the demo resilient when Supabase is unavailable.
- Skool actions use an allowlist and confirmation token. Unsupported capabilities are clearly labeled.
- Export is the guaranteed delivery path.

Supabase schema and row-level security live in `supabase/migrations`. Netlify build settings live in `netlify.toml`.
