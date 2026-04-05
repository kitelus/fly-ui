import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "../loading/Loading";
import { KiteLoader } from "./KiteLoader";
import { KiteLogo } from "./KiteLogo";
import { KitePageLoader } from "./KitePageLoader";
import { FlyUIThemeProvider } from "./theme";

const meta = {
  title: "Guides/Theming",
  component: KiteLogo,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Theme guide for FlyUI. Recommended: set FlyUIThemeProvider once at app root. Optional: pass theme prop on a component to override only that component.",
      },
      source: {
        code: `import { FlyUIThemeProvider, KiteLoader, KitePageLoader } from "@kitelus/fly-ui";

export function App() {
  return (
    <FlyUIThemeProvider
      theme={{
        primary: "#16a34a",
        foreground: "#0f172a",
        muted: "#64748b",
        overlayBackground: "rgba(240, 253, 244, 0.86)",
      }}
    >
      <KiteLoader showBrand name="Kite" subBrand="Success" label="Loading..." />
      <KitePageLoader message="Preparing workspace..." />
    </FlyUIThemeProvider>
  );
}`,
      },
    },
  },
} satisfies Meta<typeof KiteLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const GlobalThemeProvider: Story = {
  render: () => (
    <FlyUIThemeProvider
      theme={{
        primary: "#16a34a",
        foreground: "#0f172a",
        muted: "#64748b",
        overlayBackground: "rgba(240, 253, 244, 0.86)",
        overlayBlur: "3px",
      }}
    >
      <KiteLogo size="lg" name="Kite" subBrand="Success" />
      <KiteLoader
        showBrand
        name="Kite"
        subBrand="Success"
        label="Loading data..."
      />
      <Loading />
    </FlyUIThemeProvider>
  ),
};

export const ComponentOverrideOnTopOfGlobal: Story = {
  render: () => (
    <FlyUIThemeProvider
      theme={{
        primary: "#2563eb",
        foreground: "#0f172a",
        muted: "#64748b",
      }}
    >
      <KiteLoader
        showBrand
        name="Kite"
        subBrand="Success"
        label="Global blue theme"
      />
      <KiteLoader
        showBrand
        name="Kite"
        subBrand="Success"
        label="Local orange override"
        theme={{ primary: "#f97316" }}
      />
      <KitePageLoader
        message="Page loader with local purple override"
        theme={{
          primary: "#a855f7",
          overlayBackground: "rgba(245, 243, 255, 0.86)",
        }}
      />
    </FlyUIThemeProvider>
  ),
};
