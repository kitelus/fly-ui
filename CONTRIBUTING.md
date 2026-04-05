# Contributing to FlyUI

Thanks for your interest in contributing to FlyUI.

## Ways to Contribute

- Report bugs
- Suggest features
- Improve documentation
- Improve Storybook examples
- Submit code fixes and enhancements

## Before You Start

1. Search existing issues and pull requests first.
2. For larger changes, open an issue to discuss scope before coding.
3. Keep pull requests focused and small when possible.

## Development Setup

```bash
npm install
npm run storybook
```

Build package:

```bash
npm run build:lib
```

Build Storybook static output:

```bash
npm run build-storybook
```

## Pre-commit Hooks

This repository uses Husky + lint-staged to keep commits clean.

- On `git commit`, a pre-commit hook runs `npm run lint:staged`.
- Only staged `*.{js,jsx,ts,tsx}` files are linted/fixed.

If needed, run it manually:

```bash
npm run lint:staged
```

## Branch and Commit Guidelines

- Create a feature branch from `main`.
- Use clear commit messages.
- Keep commits logically grouped.

Recommended commit style:

- `feat: add new loading variant`
- `fix: resolve theme variable fallback`
- `docs: update overview examples`

## Pull Request Checklist

Before opening a pull request, make sure:

- [ ] Code builds successfully
- [ ] Storybook runs without errors
- [ ] New behavior is covered by stories/tests when applicable
- [ ] Docs were updated if public API changed
- [ ] No unrelated refactors are mixed in

## Design and API Principles

- Keep component APIs typed and minimal.
- Avoid breaking changes unless discussed in advance.
- Maintain isolated styling behavior.
- Prefer accessibility-friendly defaults.

## Reporting Bugs

Please include:

- Expected behavior
- Actual behavior
- Steps to reproduce
- Environment (OS, Node version, package version)
- Screenshots or recordings if relevant

Use the bug report template in `.github/ISSUE_TEMPLATE/bug_report.md`.

## Security Reports

Do not open public issues for security vulnerabilities.

Please report security concerns privately via email:

- thanhbinh.bent@gmail.com
