import type { Meta, StoryObj } from "@storybook/react-vite";

import { KiteLogo } from "./KiteLogo";

const meta = {
  title: "Kite/KiteLogo",
  component: KiteLogo,
  tags: ["autodocs"],
  args: {
    size: "md",
    showText: true,
    name: "Fly",
    subBrand: "UI",
  },
  argTypes: {
    size: {
      options: ["xs", "sm", "md", "lg", "xl"],
      control: { type: "inline-radio" },
    },
    showText: { control: "boolean" },
    name: { control: "text" },
    subBrand: { control: "text" },
  },
  parameters: {
    docs: {
      source: {
        code: '<KiteLogo size="md" showText name="Kite" subBrand="Success" />',
      },
    },
  },
} satisfies Meta<typeof KiteLogo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const KiteSuccess: Story = {
  args: {
    name: "Kite",
    subBrand: "Success",
  },
};
