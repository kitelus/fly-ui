import type { Meta, StoryObj } from "@storybook/react-vite";

import { KitePageLoader } from "./KitePageLoader";

const meta = {
  title: "Kite/KitePageLoader",
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
  },
  parameters: {
    layout: "fullscreen",
    docs: {
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
