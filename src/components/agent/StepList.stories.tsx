import { StepList } from "./StepList";

const meta = {
  title: "Agent Components/Base/StepList",
  component: StepList,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <StepList
      style={{ padding: 16 }}
      steps={[
        {
          id: "step-1",
          label: "Collect context",
          meta: "Finished in 1.2s",
          status: "done",
        },
        {
          id: "step-2",
          label: "Run tool",
          meta: "In progress",
          status: "running",
        },
        {
          id: "step-3",
          label: "Prepare output",
          status: "pending",
        },
      ]}
    />
  ),
};
