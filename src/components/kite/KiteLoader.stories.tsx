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
    theme: {
      primary: "#0ea5e9",
      foreground: "#0f172a",
      muted: "#64748b",
    },
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "inline-radio" },
    },
    showBrand: { control: "boolean" },
    name: { control: "text" },
    subBrand: { control: "text" },
    theme: { control: "object" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "For system-wide theming, wrap your app with FlyUIThemeProvider. Use the theme prop only when you need local overrides.",
      },
      source: {
        code: '<KiteLoader size="md" showBrand name="Kite" subBrand="Success" label="Loading data..." theme={{ primary: "#22c55e" }} />',
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
