# FlyUI

Lightweight React component library focused on loading UX with isolated styles and Storybook-driven documentation.

[![npm version](https://img.shields.io/npm/v/@kitelus/fly-ui)](https://www.npmjs.com/package/@kitelus/fly-ui)
[![npm downloads](https://img.shields.io/npm/dm/@kitelus/fly-ui)](https://www.npmjs.com/package/@kitelus/fly-ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Links

- GitHub: https://github.com/kitelus/fly-ui
- npm: https://www.npmjs.com/package/@kitelus/fly-ui
- Storybook Docs: https://kitelus.github.io/fly-ui/

## Features

- Isolated component styles via CSS Modules (prefixed classes)
- Loading-focused UI components for product consistency
- Global + per-component theming support
- Storybook docs and usage playground
- ESM + CJS + TypeScript declarations build output

## Components

- `KiteLogo`
- `KiteLoader`
- `KitePageLoader`
- `Loading`

## Installation

```bash
npm install @kitelus/fly-ui
```

## Quick Start

```tsx
import { KiteLogo, KiteLoader, KitePageLoader, Loading } from "@kitelus/fly-ui";

export function Example() {
  return (
    <div>
      <KiteLogo size="md" name="Fly" subBrand="UI" />
      <KiteLoader showBrand label="Loading section..." />
      <Loading />
      <KitePageLoader message="Preparing workspace..." />
    </div>
  );
}
```

## Development

```bash
npm install
npm run dev
```

Run Storybook:

```bash
npm run storybook
```

Build the package:

```bash
npm run build:lib
```

Build static Storybook for GitHub Pages:

```bash
npm run build-storybook
```

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create your feature branch
3. Commit your changes with clear messages
4. Open a pull request

Please include a clear description of the change and update docs/stories when relevant.

See detailed guidelines in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Community

- Code of Conduct: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- Contributing Guide: [CONTRIBUTING.md](./CONTRIBUTING.md)
- Security Policy: [SECURITY.md](./SECURITY.md)

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE) for full details.

## Contact

- Maintainer: Binh Tran
- Email: thanhbinh.bent@gmail.com
