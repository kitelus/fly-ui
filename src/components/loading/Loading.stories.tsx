import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "./Loading";

const meta = {
  title: "Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  args: {
    label: "Loading",
  },
  argTypes: {
    label: {
      description: "Accessible label exposed as `aria-label` on the status container. Not visible — use this to give screen readers meaningful context.",
      control: "text",
      table: { defaultValue: { summary: "Loading" } },
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
          "Minimal three-dot bouncing indicator. Drop-in for any inline loading state. Colour follows `--kite-primary` automatically, supports `FlyUIThemeProvider` (global) and `theme` prop (local override).",
      },
    },
  },
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: "Interactive playground — change theme colours and the accessible label using the controls panel.",
      },
    },
  },
};

export const CustomAriaLabel: Story = {
  args: {
    label: "Saving your changes",
  },
  parameters: {
    docs: {
      description: {
        story: "Pass a meaningful `label` so screen readers announce the specific action in progress.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: {
      primary: "#ef4444",
      foreground: "#7f1d1d",
      muted: "#b91c1c",
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
        code: `<Loading />`,
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
