import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { AgentMemoryPanel } from "./AgentMemoryPanel";
import { AgentStatusCard } from "./AgentStatusCard";
import { AgentStepTimeline } from "./AgentStepTimeline";
import { MultiAgentDiagram } from "./MultiAgentDiagram";
import { ToolCallInspector } from "./ToolCallInspector";

const themeArgType = {
  description:
    "Optional per-component theme override. Use `FlyUIThemeProvider` for app-wide theming.",
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
  subcomponents: {
    AgentStepTimeline,
    ToolCallInspector,
    AgentMemoryPanel,
    MultiAgentDiagram,
  },
  tags: ["autodocs"],
  args: {
    name: "Research Agent",
    status: "running",
    model: "claude-opus-4",
    description:
      "Autonomously researching and summarising the provided documents.",
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
        "Current lifecycle state. Controls badge colour and dot animation. `running` and `thinking` pulse; `completed` shows green; `error` shows red.",
      options: ["idle", "running", "thinking", "acting", "completed", "error"],
      control: { type: "select" },
      table: { defaultValue: { summary: "idle" } },
    },
    model: {
      description: "Model identifier shown as a subtitle below the agent name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    description: {
      description:
        "Short human-readable description of what the agent is currently doing.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    inputTokens: {
      description:
        "Input (prompt) token count shown in the meta row. Requires `showTokens` to not be `false`.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    outputTokens: {
      description: "Output (completion) token count shown in the meta row.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    showTokens: {
      description:
        "When `false`, hides the token usage row even if `inputTokens` / `outputTokens` are provided.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
    errorMessage: {
      description:
        "Error description rendered in a compact red alert banner. Always shown when provided, regardless of `status`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    color: {
      description:
        'Accent colour for the card — any CSS colour string (`"#f97316"`, `"oklch(70% 0.2 30)"`). Overrides the automatic status colour. Tints the badge, background, and border via `color-mix`.',
      control: "color",
      table: { defaultValue: { summary: "status colour" } },
    },
    variant: {
      description:
        'Visual weight of the card background.\n- `"tinted"` — subtle background tint (default)\n- `"flat"` — solid background, no tint\n- `"outline"` — transparent background, coloured border only',
      options: ["tinted", "flat", "outline"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: '"tinted"' } },
    },
    icon: {
      description:
        "ReactNode rendered in the top-right of the card — replaces the default status icon circle. Use for brand logos, custom avatars, or tool icons.",
      control: false,
      table: { category: "Slots" },
    },
    onStop: {
      description:
        'Callback — shows a **Stop** button when `status === "running"` and this prop is provided.',
      control: false,
    },
    onRetry: {
      description:
        'Callback — shows a **Retry** button when `status === "error"` and this prop is provided.',
      control: false,
    },
    onReset: {
      description:
        "Callback — shows a **Reset** button when provided (visible in all statuses).",
      control: false,
    },
    actionLabels: {
      description:
        "Override built-in button labels. Keys: `stop`, `retry`, `reset`. Each value is a ReactNode (string or custom element).",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    extraActions: {
      description:
        'Additional action buttons rendered alongside the built-in ones. Each item: `{ label, onClick, variant?, ariaLabel? }`. `variant` accepts `"primary"`, `"danger"`, or `"default"`.',
      control: false,
    },
    cardAriaLabel: {
      description:
        "Accessible label for the card container element. Useful for screen readers in dashboards with multiple agent cards.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    metaSlot: {
      description:
        "ReactNode rendered in the meta row alongside the description and token counts.",
      control: false,
      table: { category: "Slots" },
    },
    children: {
      description:
        "ReactNode rendered below all built-in rows — use for progress bars, step timelines, custom metrics, or extra actions.",
      control: false,
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

  > Availability: These components are available in '@kitelus/fly-ui' version '0.1.5-rc.0' and later.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import {
  AgentStatusCard,
  AgentStepTimeline,
  ToolCallInspector,
  AgentMemoryPanel,
  MultiAgentDiagram,
} from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`AgentStatusCard\` | Status card showing name, lifecycle badge, model, token usage, and action buttons |
| \`AgentStepTimeline\` | Vertical timeline of thought / action / observation steps with expandable detail |
| \`ToolCallInspector\` | Collapsible card showing tool name, status, input/output JSON, and latency |
| \`AgentMemoryPanel\` | Context-window progress bar + colour-coded memory store (short-term, long-term, episodic) |
| \`MultiAgentDiagram\` | Draggable node canvas for multi-agent pipelines with SVG connectors and status badges |

---

## Quick start

\`\`\`tsx
import { AgentStatusCard, AgentStepTimeline, ToolCallInspector } from "@kitelus/fly-ui";

// 1. Status card — shows agent state at a glance
<AgentStatusCard
  name="Research Agent"
  status="running"
  model="claude-opus-4"
  inputTokens={12400}
  outputTokens={3200}
  onStop={() => abortAgent()}
/>

// 2. Step timeline — trace agent reasoning step by step
<AgentStepTimeline
  steps={[
    { id: "1", type: "thought",     content: "I need to fetch the latest data first." },
    { id: "2", type: "tool_use",    content: "Calling database_query", detail: JSON.stringify({ table: "sales" }), durationMs: 340 },
    { id: "3", type: "observation", content: "Returned 500 rows.", timestamp: "10:00:03" },
    { id: "4", type: "decision",    content: "Proceed to analysis.", isStreaming: true },
  ]}
/>

// 3. Tool call inspector — inspect each tool invocation
<ToolCallInspector
  toolName="web_search"
  status="completed"
  input={{ query: "latest AI papers", max_results: 5 }}
  output={[{ title: "Claude API v3 released", url: "https://example.com" }]}
  latencyMs={412}
  onCopy={(section, content) => navigator.clipboard.writeText(content)}
/>
\`\`\`

---

## Theming

Every component accepts an optional \`theme\` prop for per-instance overrides, or wrap your app in \`FlyUIThemeProvider\` for global theming.

\`\`\`tsx
import { FlyUIThemeProvider } from "@kitelus/fly-ui";

<FlyUIThemeProvider theme={{ primary: "#7c3aed", radius: "6px" }}>
  <App />
</FlyUIThemeProvider>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof AgentStatusCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── AgentStatusCard stories ──────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — switch `status`, add an `errorMessage`, toggle token counts, choose a `variant`, and wire up action callbacks using the controls panel.",
      },
    },
  },
};

export const Idle: Story = {
  args: {
    status: "idle",
    description: "Waiting for task assignment.",
    inputTokens: undefined,
    outputTokens: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Agent is initialised but not yet running — muted badge, no token counts.",
      },
    },
  },
};

export const Running: Story = {
  args: {
    status: "running",
    description:
      "Executing step 3 of 7 — extracting entities from the document.",
    onStop: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Agent is actively running. Pass `onStop` to reveal a Stop button. The status dot pulses blue.",
      },
      source: {
        code: `<AgentStatusCard
  name="Research Agent"
  status="running"
  model="claude-opus-4"
  description="Executing step 3 of 7 — extracting entities from the document."
  inputTokens={12400}
  outputTokens={3200}
  onStop={() => abortAgent()}
/>`,
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
    docs: {
      description: {
        story:
          "Agent is in a reasoning/thinking phase — dot pulses in primary colour.",
      },
    },
  },
};

export const Completed: Story = {
  args: {
    status: "completed",
    description:
      "Task completed successfully. Generated a 3-page executive summary.",
    inputTokens: 45_000,
    outputTokens: 12_500,
  },
  parameters: {
    docs: {
      description: {
        story: "Agent has finished its task — badge turns green.",
      },
    },
  },
};

export const Error: Story = {
  args: {
    status: "error",
    errorMessage:
      "Rate limit exceeded on the web_search tool. Retry after 30 s.",
    onRetry: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Error state — shows a red alert with `errorMessage`. Pass `onRetry` to offer a retry button.",
      },
      source: {
        code: `<AgentStatusCard
  name="Research Agent"
  status="error"
  errorMessage="Rate limit exceeded on the web_search tool. Retry after 30 s."
  onRetry={() => retryAgent()}
/>`,
      },
    },
  },
};

export const Variants: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 420,
      }}
    >
      <AgentStatusCard
        name="Research Agent"
        status="running"
        model="claude-opus-4"
        description="Step 3 of 7 — extracting entities."
        inputTokens={12_400}
        outputTokens={3_200}
        variant="tinted"
      />
      <AgentStatusCard
        name="Research Agent"
        status="running"
        model="claude-opus-4"
        description="Step 3 of 7 — extracting entities."
        inputTokens={12_400}
        outputTokens={3_200}
        variant="flat"
      />
      <AgentStatusCard
        name="Research Agent"
        status="running"
        model="claude-opus-4"
        description="Step 3 of 7 — extracting entities."
        inputTokens={12_400}
        outputTokens={3_200}
        variant="outline"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Three visual weights — `tinted` (default, subtle background tint), `flat` (solid background, no tint), `outline` (transparent, coloured border only).",
      },
      source: {
        code: `<AgentStatusCard name="Research Agent" status="running" variant="tinted" />
<AgentStatusCard name="Research Agent" status="running" variant="flat" />
<AgentStatusCard name="Research Agent" status="running" variant="outline" />`,
      },
    },
  },
};

export const CustomColor: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 420,
      }}
    >
      <AgentStatusCard
        name="Marketing Agent"
        status="running"
        model="claude-haiku-4-5"
        description="Drafting campaign copy for Q2 launch."
        color="#f97316"
        variant="tinted"
        inputTokens={4_200}
        outputTokens={800}
      />
      <AgentStatusCard
        name="Finance Agent"
        status="completed"
        model="claude-opus-4"
        description="Q3 reconciliation complete."
        color="#8b5cf6"
        variant="tinted"
        inputTokens={22_000}
        outputTokens={5_400}
      />
      <AgentStatusCard
        name="DevOps Agent"
        status="error"
        model="claude-sonnet-4-5"
        description="Deployment pipeline failed."
        color="#e11d48"
        variant="outline"
        errorMessage="Container image pull failed — registry unreachable."
        onRetry={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `color` to assign a brand or team colour independent of `status`. The badge, background tint, and border all adapt automatically via `color-mix`.",
      },
      source: {
        code: `// Orange accent for marketing team
<AgentStatusCard
  name="Marketing Agent"
  status="running"
  color="#f97316"
  variant="tinted"
  inputTokens={4200}
  outputTokens={800}
/>

// Purple accent for finance team
<AgentStatusCard
  name="Finance Agent"
  status="completed"
  color="#8b5cf6"
  variant="tinted"
/>

// Red accent + outline variant for DevOps error
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

export const WithExtraActions: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <AgentStatusCard
        name="Summarisation Agent"
        status="completed"
        model="claude-haiku-4-5"
        description="Summary generated. 3 pages, 1 240 words."
        inputTokens={18_000}
        outputTokens={4_100}
        extraActions={[
          { label: "View output", onClick: () => {}, variant: "primary" },
          { label: "Download PDF", onClick: () => {} },
          { label: "Re-run", onClick: () => {} },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Use `extraActions` to render additional buttons alongside the built-in Stop/Retry/Reset. Each action accepts `label`, `onClick`, optional `variant` (`"primary"`, `"danger"`, `"default"`), and `ariaLabel`.',
      },
      source: {
        code: `<AgentStatusCard
  name="Summarisation Agent"
  status="completed"
  extraActions={[
    { label: "View output",  onClick: () => openResultPanel(),  variant: "primary" },
    { label: "Download PDF", onClick: () => downloadPdf() },
    { label: "Re-run",       onClick: () => rerunAgent() },
  ]}
/>`,
      },
    },
  },
};

export const WithCustomContent: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 420,
      }}
    >
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
              color: "var(--kite-muted)",
            }}
          >
            <span>Progress</span>
            <span>3 / 7</span>
          </div>
          <div
            style={{
              height: 4,
              background: "var(--kite-border)",
              borderRadius: 9999,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "43%",
                height: "100%",
                background: "var(--kite-primary)",
                borderRadius: 9999,
              }}
            />
          </div>
        </div>
      </AgentStatusCard>

      {/* Step chips injected via children */}
      <AgentStatusCard
        name="Research Agent"
        status="thinking"
        model="claude-opus-4"
        inputTokens={28000}
        outputTokens={0}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Fetch data", "Analyse", "Draft report"].map((s, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                padding: "2px 8px",
                borderRadius: 4,
                background:
                  i < 2
                    ? "var(--kite-success-subtle)"
                    : "var(--kite-primary-subtle)",
                color: i < 2 ? "var(--kite-success)" : "var(--kite-primary)",
                fontWeight: 600,
              }}
            >
              {i < 2 ? `${s} done` : `${s}...`}
            </span>
          ))}
        </div>
      </AgentStatusCard>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Use `children` to inject anything below the built-in rows — progress bars, step chips, custom metrics, or inline timelines.",
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
  {/* Any React content renders below the built-in rows */}
  <ProgressBar value={43} label="3 / 7 documents" />
</AgentStatusCard>`,
      },
    },
  },
};

export const CustomLabelsAndIcon: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        maxWidth: 420,
      }}
    >
      <AgentStatusCard
        name="Build Pipeline"
        status="running"
        model="claude-sonnet-4-5"
        description="Running CI checks..."
        inputTokens={5_200}
        outputTokens={900}
        icon={
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "var(--kite-primary-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          >
            CI
          </div>
        }
        actionLabels={{ stop: "Abort", retry: "Re-run", reset: "Clear" }}
        onStop={() => {}}
      />
      <AgentStatusCard
        name="Data Loader"
        status="error"
        description="Import failed on row 1024."
        errorMessage="CSV parse error: unexpected token at column 8, row 1024."
        actionLabels={{ retry: "Retry import" }}
        onRetry={() => {}}
        cardAriaLabel="Data Loader agent — failed"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Override built-in button labels with `actionLabels`. Supply a custom `icon` ReactNode in the card header. Use `cardAriaLabel` for accessibility in dashboards with multiple cards.",
      },
      source: {
        code: `<AgentStatusCard
  name="Build Pipeline"
  status="running"
  icon={<CIIcon />}
  actionLabels={{ stop: "Abort", retry: "Re-run", reset: "Clear" }}
  onStop={() => abortPipeline()}
/>

<AgentStatusCard
  name="Data Loader"
  status="error"
  errorMessage="CSV parse error at row 1024."
  actionLabels={{ retry: "Retry import" }}
  onRetry={() => retryImport()}
  cardAriaLabel="Data Loader agent — failed"
/>`,
      },
    },
  },
};

export const Themed: Story = {
  args: {
    status: "running",
    description: "Custom theme applied via the `theme` prop.",
    theme: {
      primary: "#16a34a",
      primarySubtle: "#dcfce7",
      foreground: "#14532d",
    },
    onStop: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Per-component colour override via the `theme` prop. No provider needed.",
      },
    },
  },
};

// ─── AgentStepTimeline showcase ───────────────────────────────────────────────

export const AgentStepTimelineShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 560,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Default step types (thought / tool_use / observation / action /
          decision)
        </p>
        <AgentStepTimeline
          steps={[
            {
              id: "1",
              type: "thought",
              content:
                "I need to retrieve the latest sales data before analysing trends.",
              timestamp: "10:00:01",
              durationMs: 120,
            },
            {
              id: "2",
              type: "tool_use",
              content: "Calling database_query tool",
              detail: '{ "table": "sales", "limit": 500, "order": "desc" }',
              timestamp: "10:00:02",
              durationMs: 340,
            },
            {
              id: "3",
              type: "observation",
              content:
                "Retrieved 500 rows. Top product: Widget Pro ($142 k revenue).",
              timestamp: "10:00:03",
            },
            {
              id: "4",
              type: "action",
              content: "Generating trend analysis chart",
              timestamp: "10:00:04",
              isStreaming: true,
            },
            {
              id: "5",
              type: "decision",
              content: "Recommend increasing Widget Pro inventory by 20%.",
              timestamp: "10:00:05",
            },
          ]}
          onStepClick={() => {}}
        />
      </div>

      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Custom icons per step — ReactNode, emoji, or text
        </p>
        <AgentStepTimeline
          steps={[
            {
              id: "a",
              type: "thought",
              icon: (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4m0-4h.01" />
                </svg>
              ),
              content: "Evaluating risk factors from the uploaded contract.",
            },
            {
              id: "b",
              type: "tool_use",
              icon: (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              ),
              content: "Searching legal precedents database",
              detail:
                '{ "query": "force majeure clause", "jurisdiction": "UK" }',
            },
            {
              id: "c",
              type: "observation",
              icon: "found",
              content: "Found 3 relevant precedents from 2019–2023.",
            },
            {
              id: "d",
              type: "decision",
              icon: "clear",
              content: "Clause is standard — no escalation required.",
            },
          ]}
        />
      </div>

      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Custom step type labels + global stepIcons override
        </p>
        <AgentStepTimeline
          steps={[
            {
              id: "x",
              type: "plan",
              content: "Break the task into three sub-tasks.",
            },
            {
              id: "y",
              type: "execute",
              content: "Running sub-task 1: fetch market data.",
              isStreaming: true,
            },
            { id: "z", type: "validate", content: "Verifying output schema…" },
          ]}
          stepTypeLabels={{
            plan: "Plan",
            execute: "Execute",
            validate: "Validate",
          }}
          stepIcons={{ plan: "P", execute: "E", validate: "V" }}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`AgentStepTimeline\` — vertical step trace of agent reasoning.

**Step structure:** each step requires \`id\`, \`type\`, and \`content\`. Optional: \`detail\` (raw JSON shown when expanded), \`timestamp\`, \`durationMs\`, \`icon\`, \`isStreaming\`.

**Key features:**
- Click a step with \`detail\` to expand raw content; pair with \`expandedIds\` + \`onExpandChange\` for controlled expand state
- \`isStreaming: true\` shows a live blinking cursor on the active step
- \`icon\` per step replaces the default type label with any ReactNode, emoji, or text string
- \`stepTypeLabels\` maps custom \`type\` strings to display labels
- \`stepIcons\` provides global icon overrides keyed by step type
- \`onStepClick(step)\` fires when any step row is clicked
- \`defaultAllExpanded\` starts all steps expanded
- \`renderStep(step, expanded, toggle)\` fully replaces a single step row
- \`emptyText\` / \`renderEmpty()\` shown when \`steps\` is empty
        `,
      },
      source: {
        code: `// Default — five step types
<AgentStepTimeline steps={[
  { id: "1", type: "thought",     content: "Need to retrieve data first.", timestamp: "10:00:01", durationMs: 120 },
  { id: "2", type: "tool_use",    content: "Calling database_query", detail: JSON.stringify({ table: "sales" }, null, 2), durationMs: 340 },
  { id: "3", type: "observation", content: "Got 500 rows." },
  { id: "4", type: "action",      content: "Generating chart", isStreaming: true },
  { id: "5", type: "decision",    content: "Recommend 20% inventory increase." },
]} />

// Custom icon per step (ReactNode, emoji, or text)
<AgentStepTimeline steps={[
  { id: "a", type: "thought",  icon: <SearchIcon />, content: "Evaluating risk factors." },
  { id: "b", type: "decision", icon: "clear",        content: "No escalation required." },
]} />

// Custom step types with labels + global icons
<AgentStepTimeline
  steps={[
    { id: "x", type: "plan",     content: "Break into sub-tasks." },
    { id: "y", type: "execute",  content: "Running sub-task 1.", isStreaming: true },
    { id: "z", type: "validate", content: "Verifying schema…" },
  ]}
  stepTypeLabels={{ plan: "Plan", execute: "Execute", validate: "Validate" }}
  stepIcons={{ plan: "P", execute: "E", validate: "V" }}
/>

// Controlled expand state
<AgentStepTimeline
  steps={steps}
  expandedIds={expandedIds}
  onExpandChange={(id, expanded) =>
    setExpandedIds(prev => {
      const next = new Set(prev);
      expanded ? next.add(id) : next.delete(id);
      return next;
    })
  }
/>`,
      },
    },
  },
};

// ─── ToolCallInspector showcase ───────────────────────────────────────────────

export const ToolCallInspectorShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        maxWidth: 560,
      }}
    >
      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
        Completed — with copy buttons
      </p>
      <ToolCallInspector
        toolName="web_search"
        description="Search the web for recent information"
        status="completed"
        input={{ query: "latest Claude API updates 2025", max_results: 5 }}
        output={[
          {
            title: "Claude API v3 released",
            url: "https://example.com",
            snippet: "Anthropic announces...",
          },
        ]}
        latencyMs={412}
        timestamp="10:41:05 AM"
        onCopy={() => {}}
        copyFeedbackLabel="Copied!"
      />
      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
        Running — expanded by default
      </p>
      <ToolCallInspector
        toolName="database_query"
        description="Execute a read-only SQL query"
        status="running"
        input={{
          sql: "SELECT * FROM orders WHERE status = 'pending' LIMIT 100",
        }}
        defaultOpen
      />
      <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
        Error — with retry button and custom input/output labels
      </p>
      <ToolCallInspector
        toolName="send_email"
        description="Send an email notification"
        status="error"
        input={{ to: "manager@company.com", subject: "Weekly Report" }}
        errorMessage="SMTP connection refused. Check firewall rules on port 587."
        latencyMs={5021}
        onRetry={() => {}}
        retryLabel="Retry send"
        inputLabel="Request payload"
        outputLabel="Server response"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ToolCallInspector\` — collapsible card for each tool invocation.

**Statuses:** \`idle\` · \`running\` (pulsing badge) · \`completed\` (green) · \`error\` (red alert)

**Key features:**
- Click the header to toggle the expanded input/output panels
- \`defaultOpen\` starts the card expanded; \`open\` + \`onOpenChange\` give full controlled state
- \`onCopy(section, content)\` shows copy buttons on input and output panels — section is \`"input"\` or \`"output"\`
- \`copyFeedbackLabel\` / \`copyFeedbackDuration\` control the post-copy confirmation text
- \`onRetry\` shows a Retry button in the error state
- \`retryLabel\` overrides the Retry button text
- \`inputLabel\` / \`outputLabel\` override the section headings (defaults: "Input" / "Output")
- \`toolIcon\` overrides the default status dot with a custom icon/badge
- \`headerSlot\` injects content alongside the tool name
- \`children\` renders additional content below the output panel
- \`timestamp\` shown in the header row
        `,
      },
      source: {
        code: `// Completed — with copy buttons
<ToolCallInspector
  toolName="web_search"
  description="Search the web for recent information"
  status="completed"
  input={{ query: "latest Claude API updates 2025", max_results: 5 }}
  output={[{ title: "Claude API v3 released", url: "https://example.com" }]}
  latencyMs={412}
  timestamp="10:41:05 AM"
  onCopy={(section, content) => navigator.clipboard.writeText(content)}
  copyFeedbackLabel="Copied!"
  copyFeedbackDuration={2000}
/>

// Running — starts expanded
<ToolCallInspector
  toolName="database_query"
  status="running"
  input={{ sql: "SELECT * FROM orders LIMIT 100" }}
  defaultOpen
/>

// Error — with retry and custom labels
<ToolCallInspector
  toolName="send_email"
  status="error"
  input={{ to: "manager@company.com", subject: "Report" }}
  errorMessage="SMTP connection refused on port 587."
  latencyMs={5021}
  onRetry={() => retryToolCall()}
  retryLabel="Retry send"
  inputLabel="Request payload"
  outputLabel="Server response"
/>

// Controlled expand state
<ToolCallInspector
  toolName="web_search"
  status="completed"
  input={input}
  output={output}
  open={isOpen}
  onOpenChange={setIsOpen}
/>`,
      },
    },
  },
};

// ─── AgentMemoryPanel showcase ────────────────────────────────────────────────

export const AgentMemoryPanelShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 480,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Full panel — warn/danger thresholds + all actions
        </p>
        <AgentMemoryPanel
          usedTokens={68_000}
          maxTokens={100_000}
          entries={[
            {
              id: "m1",
              type: "short_term",
              content:
                "User asked to analyse Q3 sales data from the uploaded CSV.",
              createdAt: "Just now",
            },
            {
              id: "m2",
              type: "short_term",
              content:
                "Database query returned 500 rows; Widget Pro leads revenue.",
              createdAt: "30 s ago",
            },
            {
              id: "m3",
              type: "long_term",
              content:
                "User prefers concise bullet-point summaries, not prose.",
              createdAt: "5 days ago",
            },
            {
              id: "m4",
              type: "episodic",
              content:
                "Previous session: user analysed Q2 data and found 12% growth.",
              createdAt: "2 wks ago",
            },
          ]}
          onDelete={() => {}}
          onEdit={() => {}}
          onAdd={() => {}}
          warnThreshold={70}
          dangerThreshold={90}
        />
      </div>

      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Custom type labels + near-danger threshold
        </p>
        <AgentMemoryPanel
          usedTokens={92_000}
          maxTokens={100_000}
          entries={[
            {
              id: "x1",
              type: "working",
              content: "Current task: classify 300 support tickets.",
              createdAt: "Now",
            },
            {
              id: "x2",
              type: "persistent",
              content: "Company voice guide: professional, concise, no jargon.",
              createdAt: "1 mo ago",
            },
          ]}
          onDelete={() => {}}
          onEdit={() => {}}
          warnThreshold={70}
          dangerThreshold={90}
          typeLabels={{
            working: "Working memory",
            persistent: "Persistent rules",
            short_term: "Short-term",
            long_term: "Long-term",
          }}
          contextWindowLabel="Context window usage"
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`AgentMemoryPanel\` — context window progress bar + categorised memory store.

**Memory types (colour-coded):**
- \`short_term\` → blue
- \`long_term\` → green
- \`episodic\` → amber
- Custom types → muted grey

**Progress bar colours:**
- Default → primary blue
- ≥ \`warnThreshold\`% (default 70) → amber
- ≥ \`dangerThreshold\`% (default 90) → red

**Key features:**
- \`onDelete(id, entry)\` shows a Delete button per entry
- \`onEdit(id, entry)\` shows an Edit button per entry
- \`onAdd()\` shows an Add button in the header
- \`typeLabels\` maps type keys to display labels (e.g. \`{ short_term: "Working memory" }\`)
- \`contextWindowLabel\` overrides the "Context window" heading above the progress bar
- \`deleteLabel\` / \`editLabel\` / \`addLabel\` override button text
- \`renderEntry(entry)\` fully replaces a single row
- \`renderEmpty()\` / \`emptyText\` shown when \`entries\` is empty
- \`headerSlot\` / \`footerSlot\` inject content above/below the entry list
        `,
      },
      source: {
        code: `<AgentMemoryPanel
  usedTokens={68000}
  maxTokens={100000}
  warnThreshold={70}
  dangerThreshold={90}
  entries={[
    { id: "m1", type: "short_term", content: "User asked to analyse Q3 sales data.", createdAt: "Just now" },
    { id: "m2", type: "long_term",  content: "User prefers concise bullet-point summaries.", createdAt: "5 days ago" },
    { id: "m3", type: "episodic",   content: "Previous session: Q2 analysis found 12% growth.", createdAt: "2 wks ago" },
  ]}
  onDelete={(id) => deleteMemory(id)}
  onEdit={(id, entry) => openEditDialog(entry)}
  onAdd={() => openAddDialog()}
  typeLabels={{ short_term: "Working memory", long_term: "Persistent memory", episodic: "Episode memory" }}
  contextWindowLabel="Context window usage"
  deleteLabel="Remove"
  editLabel="Edit"
  addLabel="Add memory"
/>`,
      },
    },
  },
};

// ─── MultiAgentDiagram showcase ───────────────────────────────────────────────

export const MultiAgentDiagramShowcase: Story = {
  render: () => {
    const [selectedNode, setSelectedNode] = React.useState<string | null>(
      "analyst",
    );
    const [selectedEdge, setSelectedEdge] = React.useState<string | null>(null);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          maxWidth: 640,
        }}
      >
        <div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Click a node to select; click an edge to highlight; drag to
            reposition
          </p>
          <MultiAgentDiagram
            title="Research pipeline"
            nodes={[
              {
                id: "orchestrator",
                label: "Orchestrator",
                status: "running",
                role: "Coordinator",
              },
              {
                id: "researcher",
                label: "Researcher",
                status: "completed",
                role: "Web Search",
              },
              {
                id: "analyst",
                label: "Analyst",
                status: "thinking",
                role: "Data Analysis",
              },
              {
                id: "writer",
                label: "Writer",
                status: "idle",
                role: "Report Generation",
              },
            ]}
            edges={[
              {
                from: "orchestrator",
                to: "researcher",
                label: "search task",
                animated: true,
              },
              {
                from: "orchestrator",
                to: "analyst",
                label: "analyse results",
                animated: true,
              },
              { from: "analyst", to: "writer", label: "findings" },
            ]}
            selectedId={selectedNode ?? undefined}
            onSelectNode={(id) => {
              setSelectedNode(id);
              setSelectedEdge(null);
            }}
            selectedEdgeId={selectedEdge ?? undefined}
            onSelectEdge={(id) => {
              setSelectedEdge(id);
              setSelectedNode(null);
            }}
            onNodeDoubleClick={(id) => alert(`Double-clicked: ${id}`)}
            canvasHeight={240}
          />
        </div>

        <div>
          <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
            Custom node colours + animated edges
          </p>
          <MultiAgentDiagram
            nodes={[
              {
                id: "planner",
                label: "Planner",
                status: "running",
                role: "Planning",
                color: "#8b5cf6",
              },
              {
                id: "coder",
                label: "Coder",
                status: "acting",
                role: "Code Gen",
                color: "#0ea5e9",
              },
              {
                id: "reviewer",
                label: "Reviewer",
                status: "thinking",
                role: "QA Review",
                color: "#f59e0b",
              },
              {
                id: "deployer",
                label: "Deployer",
                status: "idle",
                role: "Deploy",
                color: "#10b981",
              },
            ]}
            edges={[
              { from: "planner", to: "coder", color: "#8b5cf6" },
              {
                from: "coder",
                to: "reviewer",
                color: "#0ea5e9",
                animated: true,
              },
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
        story: `
\`MultiAgentDiagram\` — interactive node canvas with SVG curved connectors.

**Interactions:**
- **Drag** any node to reposition; connectors follow in real time
- **Click** a node → \`onSelectNode(id)\`; click canvas background to deselect
- **Double-click** a node → \`onNodeDoubleClick(id)\`
- **Click** an edge → \`onSelectEdge(id)\`

**Node props:** \`{ id, label, status, role?, color?, icon?, x?, y? }\`
- \`status\` controls badge colour and pulse animation
- \`color\` overrides status colour — tints badge, bg, and border via \`color-mix\`
- \`icon\` replaces the default status dot with any ReactNode

**Edge props:** \`{ from, to, label?, animated?, color? }\`
- \`animated: true\` shows a flowing dash animation — useful for active data flows

**Key features:**
- \`renderNode(node, isSelected)\` fully replaces a node's render
- \`canvasHeight\` fixes canvas height; auto-calculated if omitted
- \`title\` renders a heading above the canvas
- \`emptyText\` / \`renderEmpty()\` shown when \`nodes\` is empty
- \`footerSlot\` injects content below the canvas
        `,
      },
      source: {
        code: `const [selectedNode, setSelectedNode] = useState(null);
const [selectedEdge, setSelectedEdge] = useState(null);

<MultiAgentDiagram
  title="Research pipeline"
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
  selectedId={selectedNode}
  onSelectNode={setSelectedNode}
  selectedEdgeId={selectedEdge}
  onSelectEdge={setSelectedEdge}
  onNodeDoubleClick={(id) => openNodeDetail(id)}
/>

// Custom colours per node
<MultiAgentDiagram
  nodes={[
    { id: "planner", label: "Planner", status: "running", color: "#8b5cf6" },
    { id: "coder",   label: "Coder",   status: "acting",  color: "#0ea5e9" },
  ]}
  edges={[{ from: "planner", to: "coder", animated: true, color: "#8b5cf6" }]}
/>`,
      },
    },
  },
};
