import { AgentAvatar } from "./AgentAvatar";

const meta = {
  title: "Agent Components/Base/AgentAvatar",
  component: AgentAvatar,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "flex", gap: 12 }}>
      <AgentAvatar fallback="AI" />
      <AgentAvatar fallback="PL" status="running" />
      <AgentAvatar fallback="RV" status="done" />
    </div>
  ),
};

