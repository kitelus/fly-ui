import type { Meta, StoryObj } from "@storybook/react-vite";

import { KiteLoader } from "./KiteLoader";

const meta = {
  title: "Kite Components/KiteLoader",
  component: KiteLoader,
  tags: ["autodocs"],
  args: {
    size: "md",
    showBrand: false,
    name: "Fly",
    subBrand: "UI",
    label: "Loading...",
  },
  argTypes: {
    size: {
      description: "Controls the kite animation dimensions.",
      options: ["sm", "md", "lg"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "md" } },
    },
    label: {
      description: "Visible loading message rendered below the animation. Also used as the accessible `aria-label`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    showBrand: {
      description: "When `true`, renders the brand name between the animation and the label.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    name: {
      description: "Primary brand name shown when `showBrand` is true.",
      control: "text",
      if: { arg: "showBrand", truthy: true },
      table: { defaultValue: { summary: "Fly" } },
    },
    subBrand: {
      description: "Secondary brand segment shown when `showBrand` is true.",
      control: "text",
      if: { arg: "showBrand", truthy: true },
      table: { defaultValue: { summary: "UI" } },
    },
    theme: {
      description: "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
      control: "object",
      table: {
        type: {
          summary: "KiteTheme",
          detail: "{\n  primary?: string;\n  foreground?: string;\n  muted?: string;\n}",
        },
        defaultValue: { summary: "undefined" },
      },
    },
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Animated kite loader for inline loading states. Renders a floating kite SVG with optional brand name and message label. For full-page loading use `KitePageLoader`.",
      },
    },
  },
} satisfies Meta<typeof KiteLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: "Interactive playground — toggle `showBrand`, change `size` and `label` using the controls panel.",
      },
    },
  },
};

export const WithLabel: Story = {
  args: {
    label: "Fetching data...",
  },
  parameters: {
    docs: {
      description: {
        story: "Loader with a visible status message below the animation.",
      },
    },
  },
};

export const WithBrand: Story = {
  args: {
    showBrand: true,
    name: "Fly",
    subBrand: "UI",
    label: "Loading data...",
  },
  parameters: {
    docs: {
      description: {
        story: "Loader with the brand name displayed between the animation and the label — ideal for splash or auth screens.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "3rem", flexWrap: "wrap" }}>
      <KiteLoader size="sm" label="sm" />
      <KiteLoader size="md" label="md" />
      <KiteLoader size="lg" label="lg" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All three size variants side by side: `sm`, `md`, `lg`.",
      },
      source: {
        code: `<KiteLoader size="sm" label="sm" />
<KiteLoader size="md" label="md" />
<KiteLoader size="lg" label="lg" />`,
      },
    },
  },
};

export const CustomBrand: Story = {
  args: {
    showBrand: true,
    name: "Kite",
    subBrand: "Success",
    label: "Loading data...",
  },
  parameters: {
    docs: {
      description: {
        story: "Override `name` and `subBrand` to match your product.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    showBrand: true,
    label: "Loading data...",
    theme: {
      primary: "#22c55e",
      foreground: "#064e3b",
      muted: "#0f766e",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop.",
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    showBrand: true,
    label: "Loading data...",
    theme: {
      primary: "#38bdf8",
      foreground: "#f1f5f9",
      muted: "#94a3b8",
    },
  },
  parameters: {
    backgrounds: { default: "ink" },
    docs: {
      description: {
        story: "Automatic dark-mode colours applied by `prefers-color-scheme: dark`.",
      },
      source: {
        code: `<KiteLoader size="md" showBrand name="Fly" subBrand="UI" label="Loading data..." />`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#0f172a", padding: "2rem", display: "inline-flex" }}>
        <Story />
      </div>
    ),
  ],
};
