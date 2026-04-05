import { Reasoning } from "./Reasoning";

const meta = {
  title: "Agent Components/Base/Reasoning",
  component: Reasoning,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Reasoning
        defaultOpen
        duration={1800}
        summary="Thought for 1.8s"
        content="The assistant grouped requirements, selected relevant tools, and prepared an implementation sequence."
      />
    </div>
  ),
};
