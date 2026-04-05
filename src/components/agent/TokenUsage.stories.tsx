import { TokenUsage } from "./TokenUsage";

const meta = {
  title: "Agent Components/Base/TokenUsage",
  component: TokenUsage,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <TokenUsage used={6200} max={10000} label="Context usage" />
    </div>
  ),
};

export const Warning = {
  render: () => (
    <div style={{ padding: 16 }}>
      <TokenUsage used={9300} max={10000} warnAt={0.8} label="Near limit" />
    </div>
  ),
};
