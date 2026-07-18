# Community Foundry Product Specification

**Status:** Design approved, awaiting written-spec review  
**Date:** July 18, 2026  
**Target:** Three-day OpenAI Build Hackathon prototype  
**Deployment:** Netlify  

## 1. Product Definition

Community Foundry is an AI community-business generator for coaches, consultants, and course creators launching communities on Skool. It turns a founder's expertise into a complete, editable, launch-ready community system.

The product combines ten market-tested templates with a build-from-scratch path. It generates the community strategy, offer, pricing, discussion structure, classroom curriculum, engagement system, promotional campaign, brand assets, and launch-readiness assessment. It always supports export and conditionally publishes through Skool when an available integration explicitly supports the requested action.

### Product promise

Go from community idea to launch-ready business in under three minutes.

### Working positioning

**Name:** Community Foundry  
**Tagline:** Turn your expertise into a launch-ready paid community.  
**Descriptor:** Built for Skool, designed to support other community platforms later.

The product must not imply that it is owned, sponsored, or endorsed by Skool.

## 2. Target Customer

### Primary customer

Coaches, consultants, and course creators who want recurring revenue but do not know how to structure, price, populate, and launch a paid community.

### Secondary post-hackathon customer

Agencies and community strategists building communities for clients.

### Core jobs to be done

1. Clarify the community's audience and transformation.
2. Select a viable membership and pricing model.
3. Design a useful classroom and active discussion environment.
4. Create an engagement system that reduces ghost-town risk.
5. Determine how the first members will be acquired.
6. Produce launch assets and a setup-ready package.

## 3. Product Principles

1. **Recommend a direction.** The AI gives a best recommendation with reasoning instead of overwhelming users with options.
2. **Show the community becoming real.** Every accepted decision updates a live visual preview.
3. **Structured before verbose.** The system creates a coherent starter curriculum and expands individual lessons only on request.
4. **Evidence over mystery scores.** Every assessment includes its basis and corrective actions.
5. **User edits are authoritative.** Regeneration never silently overwrites accepted user changes.
6. **Export is guaranteed.** Third-party integration limits never prevent the user from completing the workflow.
7. **Publishing is explicit.** The app shows supported actions and requires confirmation before sending anything externally.

## 4. Scope

### Must ship for the hackathon

- Ten polished, monetizable templates inspired by high-demand community verticals
- Build-from-scratch workflow
- Hybrid Community Studio
- Contextual AI coach
- Community foundation generator
- Offer, pricing, and tier generator
- Categories, tags, rules, and onboarding generator
- Classroom with modules, lessons, objectives, and action steps
- Engagement and retention plan
- Community Launch Score with evidence and recommendations
- Market Signal Validation using approved or curated sources
- Thirty-day launch plan
- Five social posts and three launch emails
- Lead magnet and referral campaign concepts
- Community icon, cover image, and promotional graphic
- Live desktop and mobile community preview
- Autosaved project state
- Downloadable launch package
- Capability-based Skool connection screen
- Netlify deployment
- Seeded demo project and backup demo state

### Stretch goals

- Direct Skool publishing for actions confirmed by the connected integration
- PDF export
- Multiple saved projects
- Public share link
- Expanded lesson manuscripts
- Collaborative editing

### Explicitly out of scope

- Building a Skool replacement
- Billing and paid subscriptions
- Scraping Reddit
- Storing raw Reddit posts, comments, or user profiles
- Full course manuscript generation by default
- Browser automation against Skool
- Supporting additional community platforms during the hackathon
- Automated external publishing without confirmation

## 5. User Experience

### 5.1 Entry

The landing experience presents two paths:

1. **Start with a proven template**
2. **Build my own community**

A free-text idea field can recommend the closest template while preserving the option to continue from scratch.

### 5.2 Hybrid Community Studio

The main application uses three coordinated regions:

- **Build rail:** Foundation, Offer, Community, Classroom, Engagement, Brand, Promotion, Launch
- **Live preview:** Skool-inspired community, classroom, offer page, launch assets, and mobile views
- **AI coach:** Contextual recommendation, explanation, conflict warning, and one-click application

The interface must communicate progress without trapping the user in a rigid wizard.

### 5.3 Generation controls

Every generated section supports:

- Accept
- Edit
- Regenerate section
- Ask why
- Apply recommendation
- Undo last AI change

Whole-project regeneration is not exposed after the user begins editing.

## 6. Generation Stages

### 6.1 Foundation

Outputs:

- Community name and alternatives
- One-sentence promise
- Ideal-member profile
- Current pain and desired transformation
- Differentiating angle
- Community personality
- Founder-authority statement
- Membership criteria
- Community description
- Rules and boundaries

### 6.2 Offer and revenue

Outputs:

- Recommended model: free, freemium, paid, cohort, or tiered
- Reason for the recommendation
- Founding-member offer
- Monthly and annual pricing
- Tier definitions when warranted
- Included benefits
- Trial recommendation
- Bonuses
- Upsells
- Retention hooks
- Appropriate risk reversal
- Illustrative revenue scenarios for 25, 100, and 500 members

Revenue scenarios must be labeled as arithmetic illustrations, not forecasts.

### 6.3 Community structure

Outputs:

- Discussion categories
- Tags
- Start-here instructions
- Welcome post
- Introduction prompt
- Recurring weekly prompts
- Wins and accountability structure
- Feedback area
- Resource-sharing rules
- Moderator guidelines
- Onboarding questions

### 6.4 Classroom

Outputs:

- Classroom title and transformation
- Four to eight modules
- Lesson titles
- Lesson objectives
- Lesson summaries
- Action steps
- Worksheet or resource concepts
- Unlock schedule
- Progress milestones
- Completion reward

Users may expand a specific lesson in a separate action. The default workflow does not generate long manuscripts.

### 6.5 Engagement engine

Outputs:

- First-day journey
- First-week activation milestone
- Thirty-day content and engagement calendar
- Weekly rituals
- Challenges
- Office-hours recommendation
- Recognition system
- Member spotlight format
- Re-engagement messages
- Churn warning signs
- Founder operating cadence

### 6.6 Brand studio

Outputs:

- Visual direction
- Color palette
- Typography recommendation
- Community icon
- Community cover image
- Promotional social graphic
- Saved image prompt and variation history

Available directions are Authority, Energetic, Premium, Warm and Supportive, and Bold and Disruptive.

### 6.7 Promotion engine

Outputs:

- Promotion Readiness Score
- Best acquisition channels
- Audience-channel fit
- Thirty-day launch plan
- Pre-launch sequence
- Founding-member campaign
- Five social posts
- Three launch emails
- Lead magnet concept
- Referral campaign
- Partnership opportunities
- Community launch event
- First 25 Members plan
- Risks and recommended fixes

### 6.8 Review and launch

The final dashboard displays:

- Community Launch Score
- Full community preview
- Remaining risks
- Recommended corrections
- Generated files and images
- Export center
- Skool connection capabilities
- Publish confirmation for supported actions

## 7. Template Library

Each template includes a default audience, transformation, offer, pricing hypothesis, discussion structure, curriculum, engagement rhythm, promotion plan, visual direction, safety policy, and scoring-weight adjustments.

1. **Consulting Client Accelerator:** Client acquisition for coaches and consultants. Paid membership with group coaching.
2. **Creator Revenue Lab:** Audience growth and creator monetization. Freemium with paid implementation.
3. **AI-Powered Business Builder:** Applied AI and automation for entrepreneurs. Paid membership with build sessions.
4. **Freelancer Growth Collective:** Positioning, pricing, sales, and delivery. Low-cost membership with critique tier.
5. **Debt Freedom and Money Accountability:** Budgeting and debt organization. Educational cohort or membership with financial disclaimers.
6. **Fitness and Habit Accountability:** Consistency, challenges, and progress support. Paid membership with health disclaimers.
7. **Career Pivot and Job Search Lab:** Career transition, networking, and interviewing. Paid cohort with alumni community.
8. **Real Estate Investor Launchpad:** Deal analysis, acquisition, funding, and operations. Paid membership with deal reviews.
9. **Language Learning Accountability Club:** Practice, milestones, and conversation. Freemium with paid guided rooms.
10. **Productivity and Focus Systems:** Planning, focus, and accountability for professionals. Low-cost membership with facilitated sessions.

## 8. Market Signal Validation

The validator assesses:

- Recurring problem evidence
- Urgency
- Transformation strength
- Existing alternatives
- Willingness to pay
- Founder credibility
- Content depth
- Peer-interaction value
- Accountability value
- Retention potential
- Reachable acquisition channels
- Safety and compliance risk

### Reddit constraint

The hackathon application uses a curated, cited market-signal dataset for its templates and approved search sources for current validation. It does not scrape Reddit or store Reddit content. A provider interface may accept approved Reddit Data API access later, subject to Reddit's commercial-use permission and terms.

The user-facing feature is named **Market Signal Validation**, not Reddit Analyzer.

## 9. Community Launch Score

The score is calculated from explicit sub-scores rather than requested as a single unexplained model judgment.

| Dimension | Weight |
|---|---:|
| Problem urgency | 15 |
| Transformation clarity | 15 |
| Audience specificity | 10 |
| Willingness to pay | 15 |
| Founder-market credibility | 10 |
| Curriculum strength | 10 |
| Engagement and retention | 10 |
| Acquisition feasibility | 10 |
| Operational and safety risk | 5 |

Interpretation:

- 85 to 100: Ready to launch
- 70 to 84: Strong, with targeted improvements
- 50 to 69: Promising but underdeveloped
- Below 50: Validate before investing heavily

Every dimension must return a score, evidence statement, confidence level, and recommended action. Applying a recommendation recalculates only the affected dimensions.

## 10. AI Behavior and Contracts

The AI acts as a community-business strategist. It asks only necessary questions, recommends a best direction, explains material decisions, detects contradictions, and avoids unsupported certainty.

### Structured generation

All application-facing generations use validated structured outputs. Each module receives the current canonical project state and returns:

- Proposed field changes
- Explanation
- Confidence
- Warnings
- Score impact when applicable
- Source references when research is used

### Canonical state rules

- Accepted user edits become locked preferences.
- A module may propose changes outside its section but cannot apply them silently.
- Regeneration receives all locked preferences.
- Failed validation triggers one controlled repair attempt.
- A second failure returns a recoverable error and preserves existing content.

## 11. Exports and Skool Integration

### Guaranteed export package

- Complete Markdown blueprint
- Structured JSON project export
- Setup checklist organized by Skool screen
- Downloadable icon, cover, and promotional image
- Curriculum table
- Categories and tags table
- Promotion campaign pack
- PDF when time permits

### Capability-based connector

The Skool connector must:

1. Authenticate through the available supported mechanism.
2. Discover or load an allowlisted capability map.
3. Show supported and unsupported publishing actions.
4. Preview the exact payload or content to be published.
5. Require confirmation.
6. Execute only supported actions.
7. Record the response and show success only after confirmation.
8. Route unsupported elements to the export checklist.

The product does not promise complete one-click provisioning until the connected Skool integration proves that it can create the relevant resources.

## 12. Architecture

### Recommended stack

- Next.js, React, and TypeScript
- Tailwind CSS with a custom token system
- OpenAI Responses API with structured outputs and tools
- OpenAI image generation
- Supabase Postgres and Storage
- Supabase Auth with frictionless demo access
- Netlify deployment and server functions
- Runtime schema validation at every AI boundary

### Bounded modules

- Template Library
- Project Intake
- AI Community Strategist
- Market Signal Validator
- Offer and Pricing Engine
- Curriculum Generator
- Engagement Engine
- Promotion Engine
- Image Studio
- Launch Score Engine
- Preview Renderer
- Export Engine
- Skool Capability Adapter

Each module has an explicit input and output contract and can be tested independently.

## 13. Data Model

Primary entities:

- User
- CommunityProject
- Template
- AudienceProfile
- Foundation
- Offer
- PricingTier
- Category
- Tag
- Classroom
- Module
- Lesson
- EngagementPlan
- PromotionAssessment
- CampaignAsset
- BrandAsset
- LaunchScore
- SourceCitation
- ExportRecord
- IntegrationConnection
- PublishAttempt

Autosave occurs after accepted changes. Generated proposals remain separate from canonical state until accepted.

## 14. Error Handling

- AI generation shows stage-specific progress and supports cancellation.
- Timeouts preserve canonical project state and expose retry.
- Invalid structured output gets one automated repair attempt.
- Image failures do not block written community completion.
- Research failures produce a clearly labeled low-confidence assessment.
- Skool failures record the attempted action, preserve the export path, and never claim success.
- External secrets remain server-side and never enter exports or logs.

## 15. Safety and Trust

- Cite external market evidence with links and access dates.
- Label estimates and AI recommendations.
- Never promise revenue, growth, health outcomes, or investment returns.
- Add financial and health disclaimers to relevant templates.
- Do not generate diagnosis, treatment, or individualized financial advice.
- Do not retain raw Reddit user data.
- Confirm all external publishing.
- Make generated content editable and exportable.
- Display trademark and third-party affiliation disclaimers.

## 16. Quality and Testing

### Automated coverage

- Schema validation for every generator
- Launch Score arithmetic and boundary tests
- Preservation of locked user edits
- Section-level regeneration isolation
- Export completeness
- Capability-map enforcement
- Publish confirmation requirement
- Error-state and retry behavior

### End-to-end flows

1. Template to complete exported project
2. Custom idea to validated and scored project
3. User edit survives later generations
4. Weak promotion plan improves and score recalculates
5. Image failure falls back without losing project
6. Unsupported Skool action routes to manual setup
7. Clean-browser demo completes without hidden state

### Experience requirements

- First useful result in under 30 seconds under normal conditions
- Complete demo project in under three minutes
- Keyboard-operable controls
- Visible focus states
- Reduced-motion support
- Responsive desktop and mobile views
- No critical dependency on a live third-party service during judging

## 17. Three-Day Delivery Sequence

### Day 1: Core community generation

- Lock schemas and visual system
- Create ten template records
- Build Studio shell and project intake
- Implement foundation, offer, categories, and tags
- Connect generation to live preview
- Add editing, acceptance, undo, and regeneration

**Exit condition:** A user can select a template or enter an idea and produce an editable community foundation with a live preview.

### Day 2: Intelligence and assets

- Classroom generator
- Engagement engine
- Launch Score
- Curated market-signal validation
- Promotion engine
- Thirty-day campaign assets
- Brand direction and image generation

**Exit condition:** A user can produce a scored, branded, launch-ready community system.

### Day 3: Delivery and showmanship

- Export center
- Skool capability adapter
- Persistence and demo access
- Error handling
- Responsive and accessibility pass
- Netlify deployment
- Seeded demo project
- Full clean-browser rehearsal
- Feature freeze, bug fixes, screenshots, backup recording, and submission copy

**Exit condition:** The primary demo works from a clean session and has a non-live backup path.

## 18. Demo Script

Use the prompt:

> I help women over 40 turn their corporate experience into a consulting business.

Demo sequence:

1. Recommend Consulting Client Accelerator.
2. Generate **The Second Act Consulting Lab**.
3. Produce the promise, audience, and $49 founding offer.
4. Generate a six-module client-acquisition classroom.
5. Populate categories, tags, onboarding, and engagement rituals.
6. Generate the icon, cover, and promotional graphic.
7. Show an initial Launch Score near 74 with weak acquisition flagged.
8. Apply the recommended referral and thirty-day promotion plan.
9. Recalculate the score to approximately 86 based on improved inputs.
10. Export the complete launch package.
11. Show the Skool capability report and publish only a confirmed supported action.

The memorable moment is the visible score improvement after the AI identifies and fixes a real business weakness.

## 19. Acceptance Criteria

The hackathon prototype is complete when:

- A first-time user understands the value in 15 seconds.
- Both template and custom paths produce complete projects.
- All required project sections are editable.
- Outputs stay internally consistent.
- User edits survive regeneration.
- Every score includes evidence and action.
- Three final visual assets can be downloaded.
- The export package works without Skool.
- Unsupported publishing actions cannot execute.
- The application is deployed to Netlify.
- The primary demo completes in under three minutes.
- A seeded backup project and recorded fallback exist.

## 20. Post-Hackathon Revenue Model

- **Free:** One project, limited generations, branded export
- **Creator:** Multiple projects, full assets, exports, and promotion campaigns
- **Pro:** Advanced validation, integrations, and curriculum expansion
- **Agency:** Client workspaces, custom templates, and white-label exports

The Agency tier is the fastest high-value path because strategists can use the platform to deliver premium community-launch packages while Community Foundry handles the repeatable assembly work.
