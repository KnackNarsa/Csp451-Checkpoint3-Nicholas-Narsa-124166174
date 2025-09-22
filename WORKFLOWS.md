# Workflows Documentation

This repository includes three GitHub Actions workflows and one reusable composite action to support Weeks 1–3 assignments.

# WORKFLOWS

This document describes each GitHub Actions workflow, its purpose, triggers, job graph, required secrets, and common troubleshooting steps.

---

## 1) CI Pipeline (`.github/workflows/ci.yml`)

**Purpose**
- Continuous Integration: install deps, lint, test (with coverage), and optionally build artifacts.

**Triggers**
- `push` to `main` (and/or `develop`, depending on your config)
- `pull_request` targeting `main`

**Jobs & Dependencies**
- `quality-check`  
  - Uses local composite action `./.github/actions/setup-project` to: set up Node, `npm ci`, `npm run lint`, `npm test`.
- `build` (optional in your repo; include if present)  
  - `needs: quality-check`  
  - Runs `npm run build` and (optionally) uploads `dist/` as an artifact.

**Secrets Required**
- _None_ for CI itself.
- **Codecov**: If repository is **private**, add `CODECOV_TOKEN` (Repo → Settings → Secrets and variables → Actions).

**Troubleshooting**
- **Local action not found**: Ensure the job includes `actions/checkout@v4` *before* `uses: ./.github/actions/setup-project`. The action must exist at `.github/actions/setup-project/action.yml` on the same commit that triggered the run.
- **ESLint exit code 2**: Usually a misconfigured ESLint (missing plugins/parsers) or invalid `.eslintrc`. Exit 1 = real lint errors; Exit 2 = config/runtime error.
- **Coverage threshold fail**: Add tests or reduce dead code; adjust thresholds in Jest config if required.
- **Codecov “Token required”**: For private repos, set `CODECOV_TOKEN`. For public repos, ensure the repo is enabled in Codecov.

---

## 2) GitHub Pages Deploy (`.github/workflows/pages.yml`)

**Purpose**
- Build static site to `dist/` and publish to GitHub Pages.

**Triggers**
- `push` to `main` (and `workflow_dispatch` for manual runs, if enabled).

**Jobs & Dependencies**
- `build`
  - Checks out code, sets up Node, installs deps, runs `npm run build`, then uploads `./dist` using `actions/upload-pages-artifact@v3`.
- `deploy`
  - `needs: build`
  - Uses `actions/deploy-pages@v4` to publish artifact to the `github-pages` environment.  
  - The environment URL is the deployed site.

**Secrets Required**
- None (Pages uses OpenID Connect via `id-token: write` permission).

**Troubleshooting**
- **404 on site**: Ensure `dist/index.html` exists. Add a debug step `ls -la dist` before upload. Filename must be lower‑case `index.html`.
- **Wrong URL**: Project sites live at `https://<user>.github.io/<repo>/`. The root `https://<user>.github.io/` is only for a user‑site repo named `<user>.github.io`.
- **Pages source**: In Repo **Settings → Pages**, set Source to **GitHub Actions**.

---

## 3) Scheduled Dependency Audit (`.github/workflows/scheduled-audit.yml`)

**Purpose**
- Nightly security check via `npm audit`; opens/updates an issue if vulnerabilities found (high/critical, or as configured).

**Triggers**
- `schedule` (cron, e.g., `0 0 * * *` nightly at 00:00 UTC)
- `workflow_dispatch` (manual run)

**Jobs**
- `audit`
  - Checkout → Setup Node → Install deps (`npm ci` if `package-lock.json` present) → `npm audit --json` → parse results → create/update issue labeled `security-audit`.

**Secrets Required**
- None (uses repository token to create/update issues).
- Ensure workflow has `permissions: issues: write` (and `contents: read`).

**Troubleshooting**
- **“Dependencies lock file is not found”**: Confirm `package-lock.json` is committed at repo root. Add a diagnostic step:
  ```bash
  ls -la
  find . -maxdepth 2 -name "package-lock.json" -o -name "npm-shrinkwrap.json" -o -name "yarn.lock"


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
