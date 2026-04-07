import type { Meta, StoryObj } from "@storybook/react-vite";

import { KitePageLoader } from "./KitePageLoader";

const meta = {
  title: "Kite Components/KitePageLoader",
  component: KitePageLoader,
  tags: ["autodocs"],
  args: {
    message: "Preparing workspace...",
    overlay: false,
    name: "Fly",
    subBrand: "UI",
  },
  argTypes: {
    message: {
      description: "Status message shown below the animation. Also used as the accessible `aria-label`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    overlay: {
      description:
        "When `true`, renders as a fixed full-viewport overlay with backdrop blur. When `false`, renders as a centred full-height block.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    name: {
      description: "Primary brand name (bold weight) in the logo.",
      control: "text",
      table: { defaultValue: { summary: "Fly" } },
    },
    subBrand: {
      description: "Secondary brand segment (light weight) appended after the name.",
      control: "text",
      table: { defaultValue: { summary: "UI" } },
    },
    theme: {
      description: "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
      control: "object",
      table: {
        type: {
          summary: "KiteTheme",
          detail:
            "{\n  primary?: string;\n  primaryHover?: string;\n  primaryActive?: string;\n  primarySubtle?: string;\n  foreground?: string;\n  muted?: string;\n  disabled?: string;\n  background?: string;\n  surface?: string;\n  border?: string;\n  radius?: string;\n  success?: string;\n  warning?: string;\n  danger?: string;\n  fontFamily?: string;\n  shadowSm?: string;\n  shadowMd?: string;\n  overlayBackground?: string;\n  overlayBlur?: string;\n}",
        },
        defaultValue: { summary: "undefined" },
      },
    },
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-page loading screen with animated kite, brand name, progress dots, and an optional status message. Supports both a centred full-height block mode and a fixed overlay mode.",
      },
    },
  },
} satisfies Meta<typeof KitePageLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story: "Interactive playground — toggle `overlay`, edit `message`, and adjust the `theme` using the controls panel.",
      },
    },
  },
};

export const WithMessage: Story = {
  args: {
    message: "Preparing workspace...",
  },
  parameters: {
    docs: {
      description: {
        story: "Default full-height centred layout with a status message.",
      },
    },
  },
};

export const Overlay: Story = {
  args: {
    overlay: true,
    message: "Applying updates...",
  },
  decorators: [
    (Story) => (
      <div style={{ position: "relative", height: "400px", overflow: "hidden", background: "#f1f5f9" }}>
        <div style={{ padding: "2rem", fontFamily: "sans-serif", color: "#334155" }}>
          <h2 style={{ margin: "0 0 0.5rem" }}>Page content behind overlay</h2>
          <p style={{ margin: 0 }}>This content is blocked while the overlay loader is visible.</p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          "Fixed overlay mode — renders over page content with a backdrop blur. In production this covers the full viewport via `position: fixed; inset: 0`.",
      },
    },
  },
};

export const CustomBrand: Story = {
  args: {
    name: "Kite",
    subBrand: "Success",
    message: "Loading your dashboard...",
  },
  parameters: {
    docs: {
      description: {
        story: "Override `name` and `subBrand` to match your product brand.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    message: "Loading your workspace...",
    theme: {
      primary: "#a855f7",
      foreground: "#1f1147",
      muted: "#6d28d9",
      overlayBackground: "rgba(245, 243, 255, 0.86)",
      overlayBlur: "3px",
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop — including overlay background and blur.",
      },
    },
  },
};

export const DarkMode: Story = {
  args: {
    message: "Preparing workspace...",
    theme: {
      primary: "#38bdf8",
      foreground: "#f1f5f9",
      muted: "#94a3b8",
      overlayBackground: "rgba(15, 23, 42, 0.88)",
      overlayBlur: "4px",
    },
  },
  parameters: {
    backgrounds: { default: "ink" },
    docs: {
      description: {
        story: "Automatic dark-mode colours applied by `prefers-color-scheme: dark`.",
      },
      source: {
        code: `<KitePageLoader message="Preparing workspace..." name="Fly" subBrand="UI" />`,
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ background: "#0f172a", width: "100%", minHeight: "320px" }}>
        <Story />
      </div>
    ),
  ],
};
