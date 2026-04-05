import type { Meta, StoryObj } from "@storybook/react-vite";

import { Reasoning } from "./Reasoning";

const meta = {
  title: "Agent Components/Base/Reasoning",
  component: Reasoning.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof Reasoning.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Reasoning.Root defaultOpen>
        <Reasoning.Trigger>
          <Reasoning.Summary duration={1800} />
        </Reasoning.Trigger>
        <Reasoning.Content>
          The assistant grouped requirements, selected relevant tools, and
          prepared an implementation sequence.
        </Reasoning.Content>
      </Reasoning.Root>
    </div>
  ),
};
