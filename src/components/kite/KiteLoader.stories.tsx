import type { Meta, StoryObj } from "@storybook/react-vite";

import { KiteLoader } from "./KiteLoader";

const meta = {
  title: "Kite/KiteLoader",
  component: KiteLoader,
  tags: ["autodocs"],
  args: {
    size: "md",
    showBrand: true,
    name: "Fly",
    subBrand: "UI",
    label: "Loading data...",
  },
  argTypes: {
    size: {
      options: ["sm", "md", "lg"],
      control: { type: "inline-radio" },
    },
    showBrand: { control: "boolean" },
    name: { control: "text" },
    subBrand: { control: "text" },
  },
  parameters: {
    docs: {
      source: {
        code: '<KiteLoader size="md" showBrand name="Kite" subBrand="Success" label="Loading data..." />',
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
