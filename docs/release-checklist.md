# Community Foundry Release Checklist

## Product

- [x] Landing idea flow opens the Studio.
- [x] All ten templates open successfully.
- [x] Build-from-scratch path remains available.
- [x] AI Coach suggestion can be applied and undone.
- [x] Studio edits survive a reload.
- [x] Classroom and engagement stages render.
- [x] Promotion score improves from 74 to 86.
- [x] Five social posts and three emails render.
- [x] Brand generation falls back safely without credentials.
- [ ] Live OpenAI brand generation passes after credentials are configured.
- [x] Blueprint, JSON, both CSV exports, and campaign pack download.
- [x] Skool capability report distinguishes supported and unsupported actions.

## Engineering

- [x] Unit and component tests pass.
- [x] TypeScript passes.
- [x] ESLint passes.
- [x] Production build passes.
- [x] Playwright desktop and mobile flows pass.
- [x] No credentials are committed.
- [x] Credential-free fallback has been tested.

## Netlify

- [ ] Site is linked to the correct repository and feature release branch.
- [x] Build command is `npm run build`.
- [x] Publish directory is `.next`.
- [x] Node version is 22.
- [ ] Required environment variables are configured in Netlify.
- [x] Production deployment is healthy.
- [x] Landing, `/build/demo`, generation fallback, image fallback, and downloads pass on the production URL.

## Presentation

- [x] Seeded consulting idea is available at `/build/demo`.
- [ ] Browser zoom is 100 percent.
- [ ] Notifications and unrelated tabs are closed.
- [x] Credential-free fallback has been rehearsed and recorded.
- [x] Automated demo flow completes comfortably under three minutes.
