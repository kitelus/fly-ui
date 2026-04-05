import type { Meta, StoryObj } from "@storybook/react-vite";

import { StepList } from "./StepList";

const meta = {
  title: "Agent Components/Base/StepList",
  component: StepList.Root,
  tags: ["autodocs"],
} satisfies Meta<typeof StepList.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <StepList.Root style={{ padding: 16 }}>
      <StepList.Item status="done" isLast={false}>
        <StepList.Icon>1</StepList.Icon>
        <div>
          <StepList.Label>Collect context</StepList.Label>
          <StepList.Meta>Finished in 1.2s</StepList.Meta>
        </div>
        <StepList.Connector />
      </StepList.Item>
      <StepList.Item status="running" isLast={false}>
        <StepList.Icon>2</StepList.Icon>
        <div>
          <StepList.Label>Run tool</StepList.Label>
          <StepList.Meta>In progress</StepList.Meta>
        </div>
        <StepList.Connector />
      </StepList.Item>
      <StepList.Item status="pending" isLast>
        <StepList.Icon>3</StepList.Icon>
        <div>
          <StepList.Label>Prepare output</StepList.Label>
        </div>
      </StepList.Item>
    </StepList.Root>
  ),
};
