import type { Meta, StoryObj } from "@storybook/react-vite";

import { Loading } from "./Loading";

const meta = {
  title: "Components/Loading",
  component: Loading,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Three-dot loading indicator extracted from KitePageLoader progress dots.",
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
