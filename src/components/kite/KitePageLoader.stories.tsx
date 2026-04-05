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
    overlay: { control: "boolean" },
    name: { control: "text" },
    subBrand: { control: "text" },
    theme: {
      control: "object",
      description:
        "Optional local override. Example: { primary: '#a855f7', overlayBackground: 'rgba(245, 243, 255, 0.86)', overlayBlur: '3px' }",
      table: {
        type: {
          summary: "KiteTheme",
          detail:
            "{\n  primary?: string;\n  foreground?: string;\n  muted?: string;\n  overlayBackground?: string;\n  overlayBlur?: string;\n}",
        },
        defaultValue: { summary: "undefined" },
      },
    },
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "KitePageLoader supports both global theme from FlyUIThemeProvider and local theme override via props.",
      },
      source: {
        code: '<KitePageLoader message="Preparing workspace..." name="Kite" subBrand="Success" />',
      },
    },
  },
} satisfies Meta<typeof KitePageLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Overlay: Story = {
  args: {
    overlay: true,
    message: "Applying updates...",
  },
};

export const KiteSuccess: Story = {
  args: {
    name: "Kite",
    subBrand: "Success",
  },
};

export const Themed: Story = {
  args: {
    theme: {
      primary: "#a855f7",
      foreground: "#1f1147",
      muted: "#6d28d9",
      overlayBackground: "rgba(245, 243, 255, 0.86)",
      overlayBlur: "3px",
    },
  },
};
