# Community Foundry Release Checklist

## Product

- [ ] Landing idea flow opens the Studio.
- [ ] All ten templates open successfully.
- [ ] Build-from-scratch path remains available.
- [ ] AI Coach suggestion can be applied and undone.
- [ ] Studio edits survive a reload.
- [ ] Classroom and engagement stages render.
- [ ] Promotion score improves from 74 to 86.
- [ ] Five social posts and three emails render.
- [ ] Brand generation works with OpenAI and falls back safely without it.
- [ ] Blueprint, JSON, and both CSV exports download.
- [ ] Skool capability report distinguishes supported and unsupported actions.

## Engineering

- [ ] Unit and component tests pass.
- [ ] TypeScript passes.
- [ ] ESLint passes.
- [ ] Production build passes.
- [ ] Playwright desktop and mobile flows pass.
- [ ] No credentials are committed.
- [ ] `DEMO_FALLBACK=true` has been tested.

## Netlify

- [ ] Site is linked to the correct repository and feature release branch.
- [ ] Build command is `npm run build`.
- [ ] Publish directory is `.next`.
- [ ] Node version is 22.
- [ ] Required environment variables are configured in Netlify.
- [ ] Production deployment is healthy.
- [ ] Landing, `/build/demo`, generation, images, and downloads pass on the production URL.

## Presentation

- [ ] Use the seeded consulting idea.
- [ ] Browser zoom is 100 percent.
- [ ] Notifications and unrelated tabs are closed.
- [ ] Credential-free fallback has been rehearsed.
- [ ] Three-minute script has been timed twice.
