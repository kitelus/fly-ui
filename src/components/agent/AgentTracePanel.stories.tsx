import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentTracePanel, type AgentStep } from "./AgentTracePanel";

const steps: AgentStep[] = [
  {
    id: "1",
    label: "Understand request",
    status: "done",
    reasoning: {
      content: "Classify intent and collect context.",
      duration: 1200,
    },
  },
  {
    id: "2",
    label: "Run search tool",
    status: "running",
    toolCall: {
      name: "search_docs",
      callId: "tc-1",
      status: "running",
      args: { topic: "release notes" },
    },
  },
  { id: "3", label: "Draft response", status: "pending" },
];

const meta = {
  title: "Agent Component/AgentTracePanel",
  component: AgentTracePanel,
  tags: ["autodocs"],
  args: {
    steps,
    status: "running",
    showToolArgs: true,
    showToolResults: true,
  },
} satisfies Meta<typeof AgentTracePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <AgentTracePanel {...args} />,
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <AgentTracePanel
        {...args}
        status="idle"
        steps={[{ id: "a", label: "Idle", status: "pending" }]}
      />
      <AgentTracePanel
        {...args}
        status="error"
        steps={[
          {
            id: "err",
            label: "Tool failed",
            status: "error",
            toolCall: {
              name: "api_call",
              callId: "c-err",
              status: "error",
              error: "Network timeout",
            },
          },
        ]}
      />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        ["--kfa-accent" as string]: "#c2410c",
        ["--kfa-warning" as string]: "#ea580c",
      }}
    >
      <AgentTracePanel {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.trace-override{border:2px dashed #f59e0b;background:#fffbeb;}`}</style>
      <AgentTracePanel {...args} className="trace-override" />
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ padding: 12 }}>
      <AgentTracePanel {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <AgentTracePanel
      {...args}
      renderStep={(step, fallback) => (
        <div
          style={{ borderLeft: "3px solid var(--kfa-accent)", paddingLeft: 8 }}
        >
          {fallback}
          {step.metadata ? (
            <small>{JSON.stringify(step.metadata)}</small>
          ) : null}
        </div>
      )}
    />
  ),
};
