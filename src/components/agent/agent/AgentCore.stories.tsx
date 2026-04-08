import React from "react";
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
      description: "Input token count shown inline in the meta row.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    outputTokens: {
      description: "Output token count shown inline in the meta row.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    errorMessage: {
      description: "Error description shown in a compact alert banner. Always rendered when provided regardless of `status`.",
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
    children: {
      description: "Render anything below the header — progress bars, step timelines, custom metrics, extra actions. Injected after the built-in description/tokens/error rows.",
      control: false,
      table: { defaultValue: { summary: "undefined" } },
    },
    color: {
      description: "Accent colour for the card. Accepts any CSS colour string — `\"#f97316\"`, `\"oklch(70% 0.2 30)\"`, etc. Overrides the automatic status colour. Tints the badge, background, and border.",
      control: "color",
      table: { defaultValue: { summary: "status colour" } },
    },
    variant: {
      description: "Visual weight of the card background.\n- `\"tinted\"` — subtle background tint (default)\n- `\"flat\"` — solid background, no tint\n- `\"outline\"` — transparent background, coloured border only",
      options: ["tinted", "flat", "outline"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "\"tinted\"" } },
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

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
      <AgentStatusCard name="Research Agent" status="running" model="claude-opus-4" description="Step 3 of 7 — extracting entities." inputTokens={12_400} outputTokens={3_200} variant="tinted" />
      <AgentStatusCard name="Research Agent" status="running" model="claude-opus-4" description="Step 3 of 7 — extracting entities." inputTokens={12_400} outputTokens={3_200} variant="flat" />
      <AgentStatusCard name="Research Agent" status="running" model="claude-opus-4" description="Step 3 of 7 — extracting entities." inputTokens={12_400} outputTokens={3_200} variant="outline" />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Three visual weights — `tinted` (default subtle background), `flat` (solid background, no tint), `outline` (transparent, coloured border only).",
      },
      source: {
        code: `<AgentStatusCard name="Agent" status="running" variant="tinted" />
<AgentStatusCard name="Agent" status="running" variant="flat" />
<AgentStatusCard name="Agent" status="running" variant="outline" />`,
      },
    },
  },
};

export const CustomColor: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 420 }}>
      <AgentStatusCard name="Marketing Agent" status="running" model="claude-haiku-4-5" description="Drafting campaign copy for Q2 launch." color="#f97316" variant="tinted" inputTokens={4_200} outputTokens={800} />
      <AgentStatusCard name="Finance Agent"   status="completed" model="claude-opus-4"  description="Q3 reconciliation complete." color="#8b5cf6" variant="tinted" inputTokens={22_000} outputTokens={5_400} />
      <AgentStatusCard name="DevOps Agent"    status="error"     model="claude-sonnet-4-5" description="Deployment pipeline failed." color="#e11d48" variant="outline" errorMessage="Container image pull failed — registry unreachable." onRetry={() => {}} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Use `color` to assign a brand or team colour independent of `status`. The badge, background tint, and border all adapt automatically.",
      },
      source: {
        code: `// Orange for marketing team
<AgentStatusCard
  name="Marketing Agent"
  status="running"
  color="#f97316"
  variant="tinted"
/>

// Purple for finance team
<AgentStatusCard
  name="Finance Agent"
  status="completed"
  color="#8b5cf6"
  variant="tinted"
/>

// Custom color + outline variant
<AgentStatusCard
  name="DevOps Agent"
  status="error"
  color="#e11d48"
  variant="outline"
  errorMessage="Container image pull failed."
  onRetry={() => retryPipeline()}
/>`,
      },
    },
  },
};

export const WithCustomContent: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 420 }}>
      {/* Progress bar injected via children */}
      <AgentStatusCard
        name="Summarisation Agent"
        status="running"
        model="claude-haiku-4-5"
        description="Processing document 3 of 7"
        inputTokens={8200}
        outputTokens={1400}
        onStop={() => {}}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--kite-muted)" }}>
            <span>Progress</span><span>3 / 7</span>
          </div>
          <div style={{ height: 4, background: "var(--kite-border)", borderRadius: 9999, overflow: "hidden" }}>
            <div style={{ width: "43%", height: "100%", background: "var(--kite-primary)", borderRadius: 9999 }} />
          </div>
        </div>
      </AgentStatusCard>

      {/* Custom step count badge injected via children */}
      <AgentStatusCard
        name="Research Agent"
        status="thinking"
        model="claude-opus-4"
        inputTokens={28000}
        outputTokens={0}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Step 1 ✓", "Step 2 ✓", "Step 3 …"].map((s, i) => (
            <span key={i} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: i < 2 ? "var(--kite-success-subtle)" : "var(--kite-primary-subtle)", color: i < 2 ? "var(--kite-success)" : "var(--kite-primary)", fontWeight: 600 }}>{s}</span>
          ))}
        </div>
      </AgentStatusCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `children` to inject anything below the built-in rows — progress bars, step chips, custom metrics, or extra actions. The card stays compact and the layout adapts automatically.",
      },
      source: {
        code: `<AgentStatusCard
  name="Summarisation Agent"
  status="running"
  model="claude-haiku-4-5"
  description="Processing document 3 of 7"
  inputTokens={8200}
  outputTokens={1400}
  onStop={() => abortAgent()}
>
  <ProgressBar value={43} label="3 / 7 documents" />
</AgentStatusCard>`,
      },
    },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const AgentStepTimelineShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 560 }}>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Default icons (auto by type)</p>
        <AgentStepTimeline
          steps={[
            { id: "1", type: "thought",     content: "I need to retrieve the latest sales data before analysing trends.", timestamp: "10:00:01", durationMs: 120 },
            { id: "2", type: "tool_use",    content: "Calling database_query tool", detail: '{ "table": "sales", "limit": 500, "order": "desc" }', timestamp: "10:00:02", durationMs: 340 },
            { id: "3", type: "observation", content: "Retrieved 500 rows. Top product: Widget Pro ($142 k revenue).", timestamp: "10:00:03" },
            { id: "4", type: "action",      content: "Generating trend analysis chart", timestamp: "10:00:04", isStreaming: true },
            { id: "5", type: "decision",    content: "Recommend increasing Widget Pro inventory by 20%.", timestamp: "10:00:05" },
          ]}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Custom icons — text, emoji, or SVG element</p>
        <AgentStepTimeline
          steps={[
            { id: "a", type: "thought",  icon: "🧠", content: "Evaluating risk factors from the uploaded contract." },
            { id: "b", type: "tool_use", icon: (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
              ), content: "Searching legal precedents database", detail: '{ "query": "force majeure clause", "jurisdiction": "UK" }' },
            { id: "c", type: "observation", icon: "📋", content: "Found 3 relevant precedents from 2019–2023." },
            { id: "d", type: "decision",    icon: "✅", content: "Clause is standard — no escalation required." },
          ]}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`AgentStepTimeline` — vertical step trace of agent reasoning. Click a step with `detail` to expand raw JSON. The `isStreaming` flag shows a live cursor on the active step. Pass `icon` per step to override the default emoji with any string, emoji, or ReactNode (SVG, component).",
      },
      source: {
        code: `// Default icons (auto-selected by type)
<AgentStepTimeline steps={[
  { id: "1", type: "thought",     content: "Need to retrieve data first.", timestamp: "10:00:01", durationMs: 120 },
  { id: "2", type: "tool_use",    content: "Calling database_query", detail: JSON.stringify({ table: "sales" }, null, 2), durationMs: 340 },
  { id: "3", type: "observation", content: "Got 500 rows." },
  { id: "4", type: "action",      content: "Generating chart", isStreaming: true },
  { id: "5", type: "decision",    content: "Recommend 20% inventory increase." },
]} />

// Custom icons per step
<AgentStepTimeline steps={[
  { id: "a", type: "thought",  icon: "🧠",    content: "Evaluating risk factors." },
  { id: "b", type: "tool_use", icon: <SearchIcon />, content: "Searching legal database", detail: JSON.stringify(query) },
  { id: "c", type: "decision", icon: "✅",    content: "No escalation required." },
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
        code: `// Completed tool call
<ToolCallInspector
  toolName="web_search"
  description="Search the web for recent information"
  status="completed"
  input={{ query: "latest Claude API updates 2025", max_results: 5 }}
  output={[{ title: "Claude API v3 released", url: "https://example.com", snippet: "Anthropic announces..." }]}
  latencyMs={412}
/>

// Running tool call
<ToolCallInspector
  toolName="database_query"
  description="Execute a read-only SQL query"
  status="running"
  input={{ sql: "SELECT * FROM orders WHERE status = 'pending' LIMIT 100" }}
/>

// Failed tool call
<ToolCallInspector
  toolName="send_email"
  description="Send an email notification"
  status="error"
  input={{ to: "manager@company.com", subject: "Weekly Report" }}
  errorMessage="SMTP connection refused. Check firewall rules."
  latencyMs={5021}
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
  render: () => {
    const [selected, setSelected] = React.useState<string | null>("analyst");
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 640 }}>
        {/* Basic interactive diagram */}
        <div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Click to select, drag to reposition</p>
          <MultiAgentDiagram
            nodes={[
              { id: "orchestrator", label: "Orchestrator", status: "running",   role: "Coordinator" },
              { id: "researcher",   label: "Researcher",   status: "completed", role: "Web Search" },
              { id: "analyst",      label: "Analyst",      status: "thinking",  role: "Data Analysis" },
              { id: "writer",       label: "Writer",       status: "idle",      role: "Report Generation" },
            ]}
            edges={[
              { from: "orchestrator", to: "researcher", label: "search task",     animated: true },
              { from: "orchestrator", to: "analyst",    label: "analyse results", animated: true },
              { from: "analyst",      to: "writer",     label: "findings" },
            ]}
            selectedId={selected ?? undefined}
            onSelectNode={setSelected}
            canvasHeight={240}
          />
        </div>

        {/* Custom colours per node */}
        <div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Custom node colours + icons</p>
          <MultiAgentDiagram
            nodes={[
              { id: "planner",   label: "Planner",    status: "running",   role: "Planning",   color: "#8b5cf6", icon: "🧠" },
              { id: "coder",     label: "Coder",      status: "acting",    role: "Code Gen",   color: "#0ea5e9", icon: "💻" },
              { id: "reviewer",  label: "Reviewer",   status: "thinking",  role: "QA Review",  color: "#f59e0b", icon: "🔍" },
              { id: "deployer",  label: "Deployer",   status: "idle",      role: "Deploy",     color: "#10b981", icon: "🚀" },
            ]}
            edges={[
              { from: "planner",  to: "coder",    color: "#8b5cf6" },
              { from: "coder",    to: "reviewer", color: "#0ea5e9", animated: true },
              { from: "reviewer", to: "deployer", color: "#f59e0b" },
            ]}
            canvasHeight={240}
          />
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          "`MultiAgentDiagram` — interactive node canvas with SVG curved connectors and arrowheads. **Drag** any node to reposition it; connectors follow. **Click** a node to select it. Pass `animated: true` on an edge to show a flowing dash animation. Use `color` + `icon` per node for team/role customisation.",
      },
      source: {
        code: `const [selected, setSelected] = useState(null);

<MultiAgentDiagram
  nodes={[
    { id: "orchestrator", label: "Orchestrator", status: "running",   role: "Coordinator" },
    { id: "researcher",   label: "Researcher",   status: "completed", role: "Web Search" },
    { id: "analyst",      label: "Analyst",      status: "thinking",  role: "Data Analysis" },
    { id: "writer",       label: "Writer",       status: "idle",      role: "Report Generation" },
  ]}
  edges={[
    { from: "orchestrator", to: "researcher", label: "search task",     animated: true },
    { from: "orchestrator", to: "analyst",    label: "analyse results", animated: true },
    { from: "analyst",      to: "writer",     label: "findings" },
  ]}
  selectedId={selected}
  onSelectNode={setSelected}
/>

// With custom node colours + icons
<MultiAgentDiagram
  nodes={[
    { id: "planner",  label: "Planner",  status: "running",  color: "#8b5cf6", icon: "🧠" },
    { id: "coder",    label: "Coder",    status: "acting",   color: "#0ea5e9", icon: "💻" },
    { id: "reviewer", label: "Reviewer", status: "thinking", color: "#f59e0b", icon: "🔍" },
  ]}
  edges={[
    { from: "planner",  to: "coder",    color: "#8b5cf6" },
    { from: "coder",    to: "reviewer", color: "#0ea5e9", animated: true },
  ]}
/>

// Custom node rendering via renderNode
<MultiAgentDiagram
  nodes={nodes}
  edges={edges}
  renderNode={(node, selected) => (
    <div style={{ padding: "12px 16px", opacity: selected ? 1 : 0.8 }}>
      <strong>{node.label}</strong>
      <div style={{ fontSize: 11, color: "gray" }}>{node.role}</div>
    </div>
  )}
/>`,
      },
    },
  },
};
