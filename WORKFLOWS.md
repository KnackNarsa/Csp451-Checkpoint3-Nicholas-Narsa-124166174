# Workflows Documentation

This repository includes three GitHub Actions workflows and one reusable composite action to support Weeks 1–3 assignments.

## CI Pipeline (`.github/workflows/ci.yml`)
- Triggers: `push` to `main` or `develop`, and `pull_request` targeting `main`.
- Jobs:
  - `lint`: ESLint + Prettier check.
  - `test`: Jest tests with coverage, uploads to Codecov (requires `CODECOV_TOKEN` secret or org app).
  - `build`: Builds site and uploads artifact.
- Dependencies: `test` depends on `lint`, `build` depends on `test`.
- Secrets Required: `CODECOV_TOKEN` (if repository is private; for public repos token is optional depending on Codecov settings).
- Troubleshooting:
  - If lint fails, run `npm run lint` locally and fix reported issues.
  - If coverage threshold fails (<80%), add tests or reduce dead code.

## GitHub Pages Deployment (`.github/workflows/pages.yml`)
- Trigger: `push` to `main`.
- Jobs:
  - `build`: builds static site to `dist` and uploads as Pages artifact.
  - `deploy`: publishes to GitHub Pages (environment `github-pages`).
- Setup:
  - In repository Settings > Pages, choose "GitHub Actions" as the source.
- Outputs: The deployment URL is exposed as the environment URL.

## Scheduled Dependency Audit (`.github/workflows/scheduled-audit.yml`)
- Triggers: Nightly cron at 00:00 UTC and manual `workflow_dispatch`.
- Steps:
  - Installs deps and runs `npm audit --audit-level=moderate`.
  - Parses high/critical counts and opens an issue if any are found.
- Permissions: needs `security-events: write` to report; using `actions/github-script` to create issues.

## Composite Action (`.github/actions/setup-project`)
- Purpose: DRY setup for Node, deps, lint, and tests.
- Usage: `uses: ./.github/actions/setup-project` in workflows.
- Input: `node-version` (default 18).

## Environment Variables
- None required for local dev. Optional `.env` support via `dotenv` in code.

## Badges
Add these to your `README.md`:
- CI: `![CI](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)`
- Pages: `![Deploy](https://github.com/<owner>/<repo>/actions/workflows/pages.yml/badge.svg)`
- Coverage (Codecov): `![codecov](https://codecov.io/gh/<owner>/<repo>/branch/main/graph/badge.svg)`

## Common Issues
- Node version mismatch: Use `.nvmrc` or `nvm use` locally.
- Jest ESM issues: this repo uses `type: module`; import with file extensions.
- Pages 404: ensure the `deploy` job ran and repository has Pages enabled.
