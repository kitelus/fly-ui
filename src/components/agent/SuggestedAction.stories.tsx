import type { Meta, StoryObj } from "@storybook/react-vite";

import { SuggestedAction } from "./SuggestedAction";

const meta = {
  title: "Agent Components/Base/SuggestedAction",
  component: SuggestedAction.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof SuggestedAction.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SuggestedAction.Root style={{ padding: 16 }}>
      <SuggestedAction.Item value="Write release notes" />
      <SuggestedAction.Item value="Create changelog" />
      <SuggestedAction.Item value="Generate checklist" />
    </SuggestedAction.Root>
  ),
};
