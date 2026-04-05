# Fly UI

Modern React component library with isolated styles, Storybook docs, and npm publishing workflow.

## Tech Stack

- React + TypeScript
- Vite (local playground)
- Storybook 10 (docs and interactive examples)
- tsup (library build to ESM + CJS + DTS)

## Components Included

- `KiteLogo`
- `KiteLoader`
- `KitePageLoader`
- `Loading` (3-dot indicator)

Each component has:

- typed props
- Storybook controls (params playground)
- usage source examples in docs
- CSS Module styling to avoid leakage into host apps

## Local Development

```bash
npm install
npm run dev
```

Run Storybook:

```bash
npm run storybook
```

Build package:

```bash
npm run build:lib
```

Build static Storybook for GitHub Pages:

```bash
npm run build-storybook
```

## Install and Use

```bash
npm install @kitelus/fly-ui
```

```tsx
import { KiteLoader, KitePageLoader, KiteLogo, Loading } from "@kitelus/fly-ui";

export function Example() {
  return (
    <div>
      <KiteLogo size="md" />
      <KiteLoader label="Loading panel..." />
      <Loading />
      <KitePageLoader message="Preparing workspace..." />
    </div>
  );
}
```

## GitHub Pages

Workflow: `.github/workflows/deploy-storybook-pages.yml`

- Trigger: push to `main`
- Output: Storybook static site on GitHub Pages

## NPM Publish

Workflow: `.github/workflows/publish-npm.yml`

Required secret:

- `NPM_TOKEN`

Publish triggers:

- GitHub Release `published`
- manual workflow dispatch

## Repo Setup

If this folder is used as a standalone repo:

```bash
git init
git remote add origin https://github.com/kitelus/fly-ui.git
git add .
git commit -m "feat: bootstrap fly-ui component library"
git branch -M main
git push -u origin main
```
