import { AgentStatus } from "./AgentStatus";

const meta = {
  title: "Agent Components/Base/AgentStatus",
  component: AgentStatus,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <AgentStatus status="running" />
    </div>
  ),
};

export const AllStates = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 8 }}>
      <AgentStatus status="idle" />
      <AgentStatus status="thinking" />
      <AgentStatus status="running" />
      <AgentStatus status="paused" />
      <AgentStatus status="done" />
      <AgentStatus status="error" />
    </div>
  ),
};

