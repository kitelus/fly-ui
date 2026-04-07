import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentMemoryPanel } from "./AgentMemoryPanel";
import { AgentStatusCard } from "./AgentStatusCard";
import { AgentStepTimeline } from "./AgentStepTimeline";
import { MultiAgentDiagram } from "./MultiAgentDiagram";
import { ToolCallInspector } from "./ToolCallInspector";

const themeArgType = {
  description: "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
  control: "object",
  table: {
    type: {
      summary: "KiteTheme",
      detail:
        "{\n  primary?: string;\n  primaryHover?: string;\n  primaryActive?: string;\n  primarySubtle?: string;\n  foreground?: string;\n  muted?: string;\n  disabled?: string;\n  background?: string;\n  surface?: string;\n  border?: string;\n  radius?: string;\n  success?: string;\n  warning?: string;\n  danger?: string;\n  fontFamily?: string;\n  shadowSm?: string;\n  shadowMd?: string;\n  overlayBackground?: string;\n  overlayBlur?: string;\n}",
    },
    defaultValue: { summary: "undefined" },
  },
};

const meta = {
  title: "Components/Agent",
  component: AgentStatusCard,
  subcomponents: { AgentStepTimeline, ToolCallInspector, AgentMemoryPanel, MultiAgentDiagram },
  tags: ["autodocs"],
  args: {
    name: "Research Agent",
    status: "running",
    model: "claude-opus-4",
    description: "Autonomously researching and summarising the provided documents.",
    inputTokens: 12_400,
    outputTokens: 3_200,
  },
  argTypes: {
    name: {
      description: "Display name of the agent instance.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    status: {
      description:
        "Current lifecycle state. Controls the badge colour and dot animation. `running` and `thinking` pulse; `completed` shows green; `error` shows red.",
      options: ["idle", "running", "thinking", "acting", "completed", "error"],
      control: { type: "select" },
      table: { defaultValue: { summary: "idle" } },
    },
    model: {
      description: "Model identifier shown as a subtitle below the name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    description: {
      description: "Short human-readable description of what the agent is doing.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    inputTokens: {
      description: "Input token count displayed in the token usage row.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    outputTokens: {
      description: "Output token count displayed in the token usage row.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    errorMessage: {
      description: "Error description shown in a red alert box when `status` is `error`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    onStop: {
      description: "Callback — shows a **Stop** button when provided and `status === \"running\"`.",
      control: false,
      table: { defaultValue: { summary: "undefined" } },
    },
    onRetry: {
      description: "Callback — shows a **Retry** button when provided and `status === \"error\"`.",
      control: false,
      table: { defaultValue: { summary: "undefined" } },
    },
    onReset: {
      description: "Callback — shows a **Reset** button when provided.",
      control: false,
      table: { defaultValue: { summary: "undefined" } },
    },
    theme: themeArgType,
    className: { table: { category: "Styling" } },
    style: { table: { category: "Styling" } },
  },
  parameters: {
    docs: {
      description: {
        component: `
Agent status and inspection components for monitoring AI agent execution in real time.

---

## Import

\`\`\`tsx
import { AgentStatusCard, AgentStepTimeline, ToolCallInspector, AgentMemoryPanel, MultiAgentDiagram } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`AgentStatusCard\` | Status card showing name, lifecycle badge, model, token usage, and action buttons |
| \`AgentStepTimeline\` | Vertical timeline of thought/action/observation steps with expandable detail |
| \`ToolCallInspector\` | Collapsible card showing tool name, status, input/output JSON and latency |
| \`AgentMemoryPanel\` | Context window progress bar + list of short-term, long-term and episodic memories |
| \`MultiAgentDiagram\` | Node-based diagram for multi-agent pipelines with status badges and edge labels |

## Usage

\`\`\`tsx
import { AgentStatusCard, AgentStepTimeline, ToolCallInspector } from "@kitelus/fly-ui";

<AgentStatusCard
  name="Research Agent"
  status="running"
  model="claude-opus-4"
  inputTokens={12400}
  outputTokens={3200}
  onStop={() => abortAgent()}
/>

<AgentStepTimeline steps={agentSteps} />

<ToolCallInspector
  toolName="web_search"
  status="completed"
  input={{ query: "latest AI papers" }}
  output={searchResults}
  latencyMs={340}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof AgentStatusCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — switch `status`, add an `errorMessage`, toggle token counts, and wire up action callbacks using the controls panel.",
      },
    },
  },
};

export const Idle: Story = {
  args: { status: "idle", description: "Waiting for task assignment.", inputTokens: undefined, outputTokens: undefined },
  parameters: {
    docs: { description: { story: "Agent is initialised but not yet running." } },
  },
};

export const Running: Story = {
  args: {
    status: "running",
    description: "Executing step 3 of 7 — extracting entities from the document.",
    onStop: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Agent is actively running. Pass `onStop` to show a Stop button. The status dot pulses.",
      },
    },
  },
};

export const Thinking: Story = {
  args: {
    status: "thinking",
    description: "Reasoning about the next action to take.",
    inputTokens: 28_000,
    outputTokens: 0,
  },
  parameters: {
    docs: { description: { story: "Agent is in a reasoning/thinking phase — dot pulses in primary colour." } },
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
    description: "Task completed successfully. Generated a 3-page executive summary.",
    inputTokens: 45_000,
    outputTokens: 12_500,
  },
  parameters: {
    docs: { description: { story: "Agent has finished its task — badge turns green." } },
  },
};

export const Error: Story = {
  args: {
    status: "error",
    errorMessage: "Rate limit exceeded on the web_search tool. Retry after 30 s.",
    onRetry: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error state — shows a red alert with `errorMessage`. Pass `onRetry` to offer a retry button.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    status: "running",
    description: "Custom theme applied via the `theme` prop.",
    theme: { primary: "#16a34a", primarySubtle: "#dcfce7", foreground: "#14532d" },
    onStop: () => {},
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const AgentStepTimelineShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <AgentStepTimeline
        steps={[
          { id: "1", type: "thought", content: "I need to retrieve the latest sales data before analysing trends.", timestamp: "10:00:01", durationMs: 120 },
          { id: "2", type: "tool_use", content: "Calling database_query tool", detail: '{ "table": "sales", "limit": 500, "order": "desc" }', timestamp: "10:00:02", durationMs: 340 },
          { id: "3", type: "observation", content: "Retrieved 500 rows. Top product: Widget Pro ($142 k revenue).", timestamp: "10:00:03" },
          { id: "4", type: "action", content: "Generating trend analysis chart", timestamp: "10:00:04", isStreaming: true },
          { id: "5", type: "decision", content: "Recommend increasing Widget Pro inventory by 20%.", timestamp: "10:00:05" },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`AgentStepTimeline` — vertical step-by-step trace of agent reasoning. Click on a step with `detail` to expand raw JSON. The `isStreaming` flag shows a live cursor on the currently active step.",
      },
      source: {
        code: `<AgentStepTimeline steps={[
  { id: "1", type: "thought", content: "Need to retrieve data first.", timestamp: "10:00:01" },
  { id: "2", type: "tool_use", content: "Calling database_query", detail: JSON.stringify(input, null, 2) },
  { id: "3", type: "observation", content: "Got 500 rows." },
  { id: "4", type: "decision", content: "Recommend increasing inventory." },
]} />`,
      },
    },
  },
};

export const ToolCallInspectorShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 560 }}>
      <ToolCallInspector
        toolName="web_search"
        description="Search the web for recent information"
        status="completed"
        input={{ query: "latest Claude API updates 2025", max_results: 5 }}
        output={[{ title: "Claude API v3 released", url: "https://example.com", snippet: "Anthropic announces..." }]}
        latencyMs={412}
      />
      <ToolCallInspector
        toolName="database_query"
        description="Execute a read-only SQL query"
        status="running"
        input={{ sql: "SELECT * FROM orders WHERE status = 'pending' LIMIT 100" }}
      />
      <ToolCallInspector
        toolName="send_email"
        description="Send an email notification"
        status="error"
        input={{ to: "manager@company.com", subject: "Weekly Report" }}
        errorMessage="SMTP connection refused. Check firewall rules."
        latencyMs={5021}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ToolCallInspector` — collapsible card for each tool invocation. Click the header to expand input/output JSON and error details. Supports `idle`, `running`, `completed`, and `error` statuses.",
      },
      source: {
        code: `<ToolCallInspector
  toolName="web_search"
  status="completed"
  input={{ query: "latest AI papers" }}
  output={results}
  latencyMs={412}
/>`,
      },
    },
  },
};

export const AgentMemoryPanelShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <AgentMemoryPanel
        usedTokens={68_000}
        maxTokens={100_000}
        entries={[
          { id: "m1", type: "short_term", content: "User asked to analyse Q3 sales data from the uploaded CSV.", createdAt: "Just now" },
          { id: "m2", type: "short_term", content: "Database query returned 500 rows; Widget Pro leads revenue.", createdAt: "30 s ago" },
          { id: "m3", type: "long_term", content: "User prefers concise bullet-point summaries, not prose.", createdAt: "5 days ago" },
          { id: "m4", type: "episodic", content: "Previous session: user analysed Q2 data and found 12% growth.", createdAt: "2 wks ago" },
        ]}
        onDelete={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`AgentMemoryPanel` — shows context window usage (progress bar) and the memory store. Entries are colour-coded by type: `short_term` (blue), `long_term` (green), `episodic` (amber). Pass `onDelete` to show delete buttons.",
      },
      source: {
        code: `<AgentMemoryPanel
  usedTokens={68000}
  maxTokens={100000}
  entries={memoryEntries}
  onDelete={(id) => deleteMemory(id)}
/>`,
      },
    },
  },
};

export const MultiAgentDiagramShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 620 }}>
      <MultiAgentDiagram
        nodes={[
          { id: "orchestrator", label: "Orchestrator", status: "running", role: "Coordinator" },
          { id: "researcher", label: "Researcher", status: "completed", role: "Web Search" },
          { id: "analyst", label: "Analyst", status: "thinking", role: "Data Analysis" },
          { id: "writer", label: "Writer", status: "idle", role: "Report Generation" },
        ]}
        edges={[
          { from: "orchestrator", to: "researcher", label: "search task" },
          { from: "orchestrator", to: "analyst", label: "analyse results" },
          { from: "analyst", to: "writer", label: "findings" },
        ]}
        selectedId="analyst"
        onSelectNode={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`MultiAgentDiagram` — visual overview of a multi-agent pipeline. Each node shows a status badge; edges display data flow labels. Click a node to select it (use `selectedId` to control selection).",
      },
      source: {
        code: `<MultiAgentDiagram
  nodes={[
    { id: "orchestrator", label: "Orchestrator", status: "running", role: "Coordinator" },
    { id: "researcher", label: "Researcher", status: "completed" },
    { id: "analyst", label: "Analyst", status: "thinking" },
  ]}
  edges={[
    { from: "orchestrator", to: "researcher" },
    { from: "orchestrator", to: "analyst" },
  ]}
  selectedId={selectedId}
  onSelectNode={setSelectedId}
/>`,
      },
    },
  },
};
