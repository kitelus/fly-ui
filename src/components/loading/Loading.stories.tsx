import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "./Loading";

const meta = {
  title: "Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  args: {
    theme: {
      primary: "#0ea5e9",
      foreground: "#0f172a",
      muted: "#64748b",
    },
  },
  argTypes: {
    theme: { control: "object" },
  },
  parameters: {
    docs: {
      description: {
        component:
          "Three-dot loading indicator extracted from KitePageLoader progress dots. Supports FlyUIThemeProvider (global) and theme prop (local override).",
      },
      source: {
        code: '<Loading theme={{ primary: "#ef4444" }} />',
      },
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Themed: Story = {
  args: {
    theme: {
      primary: "#ef4444",
      foreground: "#7f1d1d",
      muted: "#b91c1c",
    },
  },
};
