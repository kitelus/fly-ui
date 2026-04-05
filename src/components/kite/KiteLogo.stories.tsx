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
      options: ["xs", "sm", "md", "lg", "xl"],
      control: { type: "inline-radio" },
    },
    showText: { control: "boolean" },
    name: { control: "text" },
    subBrand: { control: "text" },
    iconTextGap: {
      control: { type: "number", min: 0, max: 24, step: 1 },
      description:
        "Optional gap (px) between icon and text. If omitted, size-based default is used.",
    },
    theme: {
      control: "object",
      description:
        "Optional local override. Example: { primary: '#0ea5e9', foreground: '#0f172a', muted: '#64748b' }",
      table: {
        type: {
          summary: "KiteTheme",
          detail:
            "{\n  primary?: string;\n  foreground?: string;\n  muted?: string;\n}",
        },
        defaultValue: { summary: "undefined" },
      },
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Use theme prop for per-component customization, or use FlyUIThemeProvider to apply one theme across all FlyUI components.",
      },
      source: {
        code: '<KiteLogo size="md" showText name="Kite" subBrand="Success" iconTextGap={7} />',
      },
    },
  },
} satisfies Meta<typeof KiteLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const KiteSuccess: Story = {
  args: {
    name: "Kite",
    subBrand: "Success",
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
};
