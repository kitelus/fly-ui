import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "./Loading";

const meta = {
  title: "Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  argTypes: {
    theme: {
      control: "object",
      description:
        "Optional local override. Example: { primary: '#ef4444', foreground: '#7f1d1d', muted: '#b91c1c' }",
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
          "Three-dot loading indicator extracted from KitePageLoader progress dots. Supports FlyUIThemeProvider (global) and theme prop (local override).",
      },
      source: {
        code: "<Loading />",
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
