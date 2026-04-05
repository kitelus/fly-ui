import type { Meta, StoryObj } from "@storybook/react-vite";

import { KiteLoader } from "./KiteLoader";

const meta = {
  title: "Kite Components/KiteLoader",
  component: KiteLoader,
  tags: ["autodocs"],
  args: {
    size: "md",
    showBrand: true,
    name: "Fly",
    subBrand: "UI",
    label: "Loading data...",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "inline-radio" },
    },
    showBrand: { control: "boolean" },
    name: { control: "text" },
    subBrand: { control: "text" },
    theme: {
      control: "object",
      description:
        "Optional local override. Example: { primary: '#22c55e', foreground: '#064e3b', muted: '#0f766e' }",
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
          "For system-wide theming, wrap your app with FlyUIThemeProvider. Use the theme prop only when you need local overrides.",
      },
      source: {
        code: '<KiteLoader size="md" showBrand name="Kite" subBrand="Success" label="Loading data..." />',
      },
    },
  },
} satisfies Meta<typeof KiteLoader>;

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
      primary: "#22c55e",
      foreground: "#064e3b",
      muted: "#0f766e",
    },
  },
};
