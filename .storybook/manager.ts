import { addons } from "storybook/manager-api";
import { create } from "storybook/theming";

addons.setConfig({
  theme: create({
    base: "light",
    brandTitle: "FlyUI",
    brandUrl: "https://github.com/kitelus/fly-ui",
    brandImage: "/kite-logo.svg",
    fontBase: "ui-sans-serif, Inter, Segoe UI, sans-serif",
    fontCode: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
    appBg: "#f6f7fb",
    appContentBg: "#ffffff",
    appBorderColor: "#d8deea",
    appBorderRadius: 14,
    barBg: "#ffffff",
    barTextColor: "#1f2937",
    barSelectedColor: "#0ea5e9",
    colorPrimary: "#0ea5e9",
    colorSecondary: "#2563eb",
  }),
});
