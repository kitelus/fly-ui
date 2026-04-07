import type { Meta, StoryObj } from '@storybook/react-vite';

import { Loading } from '../loading/Loading';
import { KiteLoader } from './KiteLoader';
import { KiteLogo } from './KiteLogo';
import { KitePageLoader } from './KitePageLoader';
import { createTheme, darkTheme, lightTheme } from './theme-tokens';
import { FlyUIThemeProvider } from './theme';

const meta: Meta = {
  title: 'Guides/Theming',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
FlyUI uses CSS custom properties scoped to each component host element.
You can customise colours, typography, borders, shadows, and overlays — either
globally for your whole app or locally on a single component.

---

## Usage

### 1. \`FlyUIThemeProvider\` — global theme

Wrap your app (or any subtree) once. Every FlyUI component inside automatically
inherits the theme via React context. The provider also injects the CSS variables
onto a \`data-flyui-theme\` wrapper \`<div>\`, so your own CSS can consume
\`var(--kite-primary)\` etc. anywhere in the subtree.

\`\`\`tsx
import { FlyUIThemeProvider } from "@kitelus/fly-ui";

<FlyUIThemeProvider theme={{ primary: "#16a34a", radius: "4px" }}>
  <App />
</FlyUIThemeProvider>
\`\`\`

### 2. \`theme\` prop — per-component override

Pass \`theme\` directly to any FlyUI component. Only the tokens you specify
change; everything else inherits from the nearest provider or CSS defaults.

\`\`\`tsx
<KiteLoader theme={{ primary: "#f97316" }} label="Uploading..." />
\`\`\`

### 3. \`createTheme(overrides?)\` — named theme object

Merges your overrides on top of the built-in light defaults and returns a
complete \`Required<KiteTheme>\` with every token filled in. Define it once
and share it across your app.

\`\`\`tsx
import { createTheme, FlyUIThemeProvider } from "@kitelus/fly-ui";

const brandTheme = createTheme({ primary: "#16a34a", radius: "4px" });

<FlyUIThemeProvider theme={brandTheme}>
  <App />
</FlyUIThemeProvider>
\`\`\`

Extend the dark preset:

\`\`\`tsx
import { createTheme, darkTheme } from "@kitelus/fly-ui";

const darkBrand = createTheme({ ...darkTheme, primary: "#facc15" });
\`\`\`

### 4. Built-in presets

\`lightTheme\` and \`darkTheme\` are exported as typed constants — the exact
values the CSS defaults use. Dark tokens are also applied **automatically**
via \`@media (prefers-color-scheme: dark)\`; you do not need to wire up
\`darkTheme\` yourself unless you manage your own colour-scheme toggle.

\`\`\`tsx
import { lightTheme, darkTheme } from "@kitelus/fly-ui";
\`\`\`

---

## Token reference

All tokens are optional. Tokens you omit fall back to the CSS defaults,
preserving automatic dark-mode behaviour.

### Primary (brand / accent)

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`primary\` | \`--kite-primary\` | \`#0ea5e9\` | \`#38bdf8\` |
| \`primaryHover\` | \`--kite-primary-hover\` | \`#38bdf8\` | \`#7dd3fc\` |
| \`primaryActive\` | \`--kite-primary-active\` | \`#0284c7\` | \`#0ea5e9\` |
| \`primarySubtle\` | \`--kite-primary-subtle\` | \`#e0f2fe\` | \`#0c4a6e\` |

### Text

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`foreground\` | \`--kite-foreground\` | \`#0f172a\` | \`#f1f5f9\` |
| \`muted\` | \`--kite-muted\` | \`#64748b\` | \`#94a3b8\` |
| \`disabled\` | \`--kite-disabled\` | \`#cbd5e1\` | \`#475569\` |

### Background

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`background\` | \`--kite-background\` | \`#ffffff\` | \`#0f172a\` |
| \`surface\` | \`--kite-surface\` | \`#f8fafc\` | \`#1e293b\` |

### Border

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`border\` | \`--kite-border\` | \`#e2e8f0\` | \`#334155\` |
| \`radius\` | \`--kite-radius\` | \`8px\` | \`8px\` |

### Semantic status

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`success\` | \`--kite-success\` | \`#22c55e\` | \`#4ade80\` |
| \`warning\` | \`--kite-warning\` | \`#f59e0b\` | \`#fbbf24\` |
| \`danger\` | \`--kite-danger\` | \`#ef4444\` | \`#f87171\` |

### Typography

| Token | CSS variable | Default |
|---|---|---|
| \`fontFamily\` | \`--kite-font-family\` | \`"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif\` |

### Elevation

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`shadowSm\` | \`--kite-shadow-sm\` | \`0 1px 3px 0 rgb(0 0 0 / 0.1)…\` | \`0 1px 3px 0 rgb(0 0 0 / 0.4)…\` |
| \`shadowMd\` | \`--kite-shadow-md\` | \`0 4px 6px -1px rgb(0 0 0 / 0.1)…\` | \`0 4px 6px -1px rgb(0 0 0 / 0.4)…\` |

### Overlay *(KitePageLoader only)*

| Token | CSS variable | Light | Dark |
|---|---|---|---|
| \`overlayBackground\` | \`--kite-overlay-background\` | \`rgba(255,255,255,0.82)\` | \`rgba(15,23,42,0.88)\` |
| \`overlayBlur\` | \`--kite-overlay-blur\` | \`2px\` | \`4px\` |
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// ─── Built-in presets ─────────────────────────────────────────────────────────

export const LightPreset: Story = {
  render: () => (
    <FlyUIThemeProvider theme={lightTheme}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <KiteLogo size="lg" name="Fly" subBrand="UI" />
        <KiteLoader showBrand name="Fly" subBrand="UI" label="Loading..." />
        <Loading />
      </div>
    </FlyUIThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Explicitly passing the built-in `lightTheme` preset — identical to the default appearance. Useful as a starting point to spread and override individual tokens.',
      },
      source: {
        code: `import { FlyUIThemeProvider, lightTheme } from "@kitelus/fly-ui";

<FlyUIThemeProvider theme={lightTheme}>
  <KiteLogo size="lg" name="Fly" subBrand="UI" />
  <KiteLoader showBrand name="Fly" subBrand="UI" label="Loading..." />
  <Loading />
</FlyUIThemeProvider>`,
      },
    },
  },
};

export const DarkPreset: Story = {
  render: () => (
    <FlyUIThemeProvider theme={darkTheme}>
      <div style={{ background: '#0f172a', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <KiteLogo size="lg" name="Fly" subBrand="UI" />
        <KiteLoader showBrand name="Fly" subBrand="UI" label="Loading..." />
        <Loading />
      </div>
    </FlyUIThemeProvider>
  ),
  parameters: {
    backgrounds: { default: 'ink' },
    docs: {
      description: {
        story:
          'Explicitly passing `darkTheme` — useful when your app manages its own dark-mode toggle instead of relying on `prefers-color-scheme`. Without this, dark tokens apply automatically via the media query.',
      },
      source: {
        code: `import { FlyUIThemeProvider, darkTheme } from "@kitelus/fly-ui";

<FlyUIThemeProvider theme={darkTheme}>
  <KiteLogo size="lg" name="Fly" subBrand="UI" />
  <KiteLoader showBrand name="Fly" subBrand="UI" label="Loading..." />
  <Loading />
</FlyUIThemeProvider>`,
      },
    },
  },
};

// ─── createTheme ──────────────────────────────────────────────────────────────

export const CreateTheme: Story = {
  render: () => {
    const brandTheme = createTheme({ primary: '#16a34a', muted: '#4ade80' });
    return (
      <FlyUIThemeProvider theme={brandTheme}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <KiteLogo size="lg" name="Kite" subBrand="Green" />
          <KiteLoader showBrand name="Kite" subBrand="Green" label="Loading data..." />
          <Loading />
        </div>
      </FlyUIThemeProvider>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          '`createTheme()` merges your overrides on top of `lightTheme` defaults, returning a complete theme object with every token filled in. Define it once outside your component tree.',
      },
      source: {
        code: `import { createTheme, FlyUIThemeProvider } from "@kitelus/fly-ui";

const brandTheme = createTheme({ primary: "#16a34a", muted: "#4ade80" });

<FlyUIThemeProvider theme={brandTheme}>
  <KiteLogo size="lg" name="Kite" subBrand="Green" />
  <KiteLoader showBrand name="Kite" subBrand="Green" label="Loading data..." />
  <Loading />
</FlyUIThemeProvider>`,
      },
    },
  },
};

export const ExtendDarkTheme: Story = {
  render: () => {
    const highContrastDark = createTheme({ ...darkTheme, primary: '#facc15' });
    return (
      <FlyUIThemeProvider theme={highContrastDark}>
        <div style={{ background: '#0f172a', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
          <KiteLogo size="lg" name="Fly" subBrand="UI" />
          <KiteLoader showBrand name="Fly" subBrand="UI" label="Loading..." />
          <Loading />
        </div>
      </FlyUIThemeProvider>
    );
  },
  parameters: {
    backgrounds: { default: 'ink' },
    docs: {
      description: {
        story: 'Spread `darkTheme` into `createTheme()` then override individual tokens — a simple pattern for building theme variants.',
      },
      source: {
        code: `import { createTheme, darkTheme, FlyUIThemeProvider } from "@kitelus/fly-ui";

const highContrastDark = createTheme({ ...darkTheme, primary: "#facc15" });

<FlyUIThemeProvider theme={highContrastDark}>
  <KiteLogo size="lg" name="Fly" subBrand="UI" />
  <KiteLoader showBrand name="Fly" subBrand="UI" label="Loading..." />
  <Loading />
</FlyUIThemeProvider>`,
      },
    },
  },
};

// ─── Provider scope ───────────────────────────────────────────────────────────

export const GlobalThemeProvider: Story = {
  render: () => (
    <FlyUIThemeProvider theme={{ primary: '#16a34a', muted: '#4ade80' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <KiteLogo size="lg" name="Kite" subBrand="Green" />
        <KiteLoader showBrand name="Kite" subBrand="Green" label="Loading data..." />
        <Loading />
      </div>
    </FlyUIThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A single `FlyUIThemeProvider` propagates the theme to every FlyUI component in the subtree. Pass only the tokens you want to override — everything else falls back to the CSS defaults.',
      },
      source: {
        code: `import { FlyUIThemeProvider } from "@kitelus/fly-ui";

<FlyUIThemeProvider theme={{ primary: "#16a34a", muted: "#4ade80" }}>
  <KiteLogo size="lg" name="Kite" subBrand="Green" />
  <KiteLoader showBrand name="Kite" subBrand="Green" label="Loading data..." />
  <Loading />
</FlyUIThemeProvider>`,
      },
    },
  },
};

export const ComponentOverride: Story = {
  render: () => (
    <FlyUIThemeProvider theme={{ primary: '#2563eb' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <KiteLoader showBrand name="Kite" label="Global blue theme" />
        <KiteLoader showBrand name="Kite" label="Local orange override" theme={{ primary: '#f97316' }} />
        <KitePageLoader message="Local purple override" theme={{ primary: '#a855f7', overlayBackground: 'rgba(245, 243, 255, 0.86)' }} />
      </div>
    </FlyUIThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The provider sets blue globally. The second `KiteLoader` and `KitePageLoader` each pass a local `theme` prop — only those tokens change, the rest still inherit from the provider. Local overrides always win.',
      },
      source: {
        code: `import { FlyUIThemeProvider, KiteLoader, KitePageLoader } from "@kitelus/fly-ui";

<FlyUIThemeProvider theme={{ primary: "#2563eb" }}>
  {/* Inherits global blue */}
  <KiteLoader showBrand name="Kite" label="Global blue theme" />

  {/* Local orange override — only primary changes */}
  <KiteLoader
    showBrand
    name="Kite"
    label="Local orange override"
    theme={{ primary: "#f97316" }}
  />

  {/* Local purple override with overlay token */}
  <KitePageLoader
    message="Local purple override"
    theme={{ primary: "#a855f7", overlayBackground: "rgba(245, 243, 255, 0.86)" }}
  />
</FlyUIThemeProvider>`,
      },
    },
  },
};

// ─── Individual token groups ───────────────────────────────────────────────────

export const SemanticColors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <KiteLoader showBrand name="Fly" subBrand="Success" label="Operation succeeded" theme={{ primary: '#22c55e' }} />
      <KiteLoader showBrand name="Fly" subBrand="Warning" label="Proceed with caution" theme={{ primary: '#f59e0b' }} />
      <KiteLoader showBrand name="Fly" subBrand="Danger" label="Action required" theme={{ primary: '#ef4444' }} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Use `success`, `warning`, and `danger` tokens for semantic states. Pass them via local `theme` prop or set them globally on the provider.',
      },
      source: {
        code: `<KiteLoader label="Operation succeeded" theme={{ primary: "#22c55e" }} />
<KiteLoader label="Proceed with caution" theme={{ primary: "#f59e0b" }} />
<KiteLoader label="Action required"      theme={{ primary: "#ef4444" }} />`,
      },
    },
  },
};

export const TypographyAndRadius: Story = {
  render: () => (
    <FlyUIThemeProvider
      theme={{
        fontFamily: '"Georgia", serif',
        radius: '2px',
        foreground: '#1c1917',
        muted: '#78716c',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <KiteLogo size="lg" name="Serif" subBrand="Brand" />
        <KiteLoader showBrand name="Serif" subBrand="Brand" label="Loading content..." />
      </div>
    </FlyUIThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story: "Override `fontFamily` and `radius` to match your brand's typography and shape language.",
      },
      source: {
        code: `import { FlyUIThemeProvider } from "@kitelus/fly-ui";

<FlyUIThemeProvider
  theme={{
    fontFamily: '"Georgia", serif',
    radius: "2px",
    foreground: "#1c1917",
    muted: "#78716c",
  }}
>
  <KiteLogo size="lg" name="Serif" subBrand="Brand" />
  <KiteLoader showBrand name="Serif" subBrand="Brand" label="Loading content..." />
</FlyUIThemeProvider>`,
      },
    },
  },
};

