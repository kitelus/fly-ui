import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentStatus } from "./AgentStatus";
import { Reasoning } from "./Reasoning";
import { SourceCard, SourceList } from "./SourceCard";
import { StepList } from "./StepList";
import { ToolCall } from "./ToolCall";

const meta = {
  title: "Agent Components/Example/Trace Timeline",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong>Execution Trace</strong>
        <AgentStatus status="running" />
      </div>

      <StepList.Root>
        <StepList.Item status="done" isLast={false}>
          <StepList.Icon>1</StepList.Icon>
          <div>
            <StepList.Label>Collect requirements</StepList.Label>
            <StepList.Meta>Finished in 0.8s</StepList.Meta>
          </div>
          <StepList.Connector />
        </StepList.Item>

        <StepList.Item status="running" isLast={false}>
          <StepList.Icon>2</StepList.Icon>
          <div style={{ display: "grid", gap: 8 }}>
            <StepList.Label>Run documentation search</StepList.Label>
            <Reasoning.Root defaultOpen>
              <Reasoning.Trigger>
                <Reasoning.Summary duration={1600} />
              </Reasoning.Trigger>
              <Reasoning.Content>
                Prioritizing high-signal references from architecture and
                release docs.
              </Reasoning.Content>
            </Reasoning.Root>
            <ToolCall.Root toolName="search_docs" status="running" defaultOpen>
              <ToolCall.Header>
                <ToolCall.Name>search_docs</ToolCall.Name>
                <ToolCall.Status>running</ToolCall.Status>
              </ToolCall.Header>
              <ToolCall.Args
                value={{ query: "release summary", maxResults: 5 }}
              />
            </ToolCall.Root>
          </div>
          <StepList.Connector />
        </StepList.Item>

        <StepList.Item status="pending" isLast>
          <StepList.Icon>3</StepList.Icon>
          <div>
            <StepList.Label>Draft final response</StepList.Label>
            <StepList.Meta>Waiting for tool result</StepList.Meta>
          </div>
        </StepList.Item>
      </StepList.Root>
    </div>
  ),
};

export const ResearchAndTraceApp: Story = {
  render: () => (
    <div
      style={{
        padding: 16,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
      }}
    >
      <div style={{ display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Sources</h4>
        <SourceList.Root>
          <SourceList.Item>
            <SourceCard
              title="Architecture Guide"
              url="https://example.com/arch"
              excerpt="Domain boundaries and event patterns"
            />
          </SourceList.Item>
          <SourceList.Item>
            <SourceCard
              title="Deployment Runbook"
              url="https://example.com/runbook"
              excerpt="Staging and production rollout steps"
            />
          </SourceList.Item>
        </SourceList.Root>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h4 style={{ margin: 0 }}>Trace Timeline</h4>
        <StepList.Root>
          <StepList.Item status="done" isLast={false}>
            <StepList.Icon>1</StepList.Icon>
            <div>
              <StepList.Label>Collect references</StepList.Label>
              <StepList.Meta>2 sources found</StepList.Meta>
              <ToolCall.Root
                toolName="search_docs"
                status="success"
                defaultOpen
              >
                <ToolCall.Header>
                  <ToolCall.Name>search_docs</ToolCall.Name>
                  <ToolCall.Status>success</ToolCall.Status>
                </ToolCall.Header>
                <ToolCall.Result value={{ hits: 2 }} />
              </ToolCall.Root>
            </div>
            <StepList.Connector />
          </StepList.Item>
          <StepList.Item status="running" isLast>
            <StepList.Icon>2</StepList.Icon>
            <div>
              <StepList.Label>Draft answer</StepList.Label>
              <StepList.Meta>In progress</StepList.Meta>
            </div>
          </StepList.Item>
        </StepList.Root>
      </div>
    </div>
  ),
};
