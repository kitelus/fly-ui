import type { Meta, StoryObj } from "@storybook/react-vite";

import { KiteLogo } from "./KiteLogo";

const meta = {
  title: "Kite Components/KiteLogo",
  component: KiteLogo,
  tags: ["autodocs"],
  args: {
    size: "md",
    showText: true,
    name: "Fly",
    subBrand: "UI",
    iconTextGap: 7,
  },
  argTypes: {
    size: {
      description: "Size preset controlling icon dimensions, text size and default gap.",
      options: ["xs", "sm", "md", "lg", "xl"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "md" } },
    },
    showText: {
      description: "Whether to render the brand name text alongside the icon.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
    name: {
      description: "Primary brand name (bold weight).",
      control: "text",
      table: { defaultValue: { summary: "Fly" } },
    },
    subBrand: {
      description: "Secondary brand segment (light weight) appended after the name.",
      control: "text",
      table: { defaultValue: { summary: "UI" } },
    },
    iconTextGap: {
      description: "Gap in px between the icon and text. Defaults to the size-based value when omitted.",
      control: { type: "number", min: 0, max: 48, step: 1 },
      table: { defaultValue: { summary: "size-based" } },
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
    textClassName: {
      description: "Extra class name applied to the text `<span>` wrapper.",
      control: "text",
      table: { category: "Styling" },
    },
    className: {
      table: { category: "Styling" },
    },
    style: {
      table: { category: "Styling" },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Brand logo combining the kite icon with a two-part name. Supports five size presets, optional text, custom gap, per-component theming via `theme` prop, and global theming via `FlyUIThemeProvider`.",
      },
    },
  },
} satisfies Meta<typeof KiteLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: "Interactive playground — adjust all props using the controls panel below.",
      },
    },
  },
};

export const IconOnly: Story = {
  args: {
    showText: false,
  },
  parameters: {
    docs: {
      description: {
        story: "Icon rendered without any text — useful in compact navbars or favicon contexts.",
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
      <KiteLogo size="xs" name="Fly" subBrand="UI" />
      <KiteLogo size="sm" name="Fly" subBrand="UI" />
      <KiteLogo size="md" name="Fly" subBrand="UI" />
      <KiteLogo size="lg" name="Fly" subBrand="UI" />
      <KiteLogo size="xl" name="Fly" subBrand="UI" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All five size presets side by side: `xs`, `sm`, `md`, `lg`, `xl`.",
      },
      source: {
        code: `<KiteLogo size="xs" name="Fly" subBrand="UI" />
<KiteLogo size="sm" name="Fly" subBrand="UI" />
<KiteLogo size="md" name="Fly" subBrand="UI" />
<KiteLogo size="lg" name="Fly" subBrand="UI" />
<KiteLogo size="xl" name="Fly" subBrand="UI" />`,
      },
    },
  },
};

export const CustomBrand: Story = {
  args: {
    name: "Kite",
    subBrand: "Success",
  },
  parameters: {
    docs: {
      description: {
        story: "Override `name` and `subBrand` to adapt the logo to any product.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: {
      primary: "#f97316",
      foreground: "#1f2937",
      muted: "#6b7280",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop — no provider required.",
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
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
        story: "Automatic dark-mode colours applied by `prefers-color-scheme: dark`. The component adapts without any extra props.",
      },
      source: {
        code: `<KiteLogo size="md" showText name="Fly" subBrand="UI" />`,
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
