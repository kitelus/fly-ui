import type { Meta, StoryObj } from "@storybook/react-vite";

import { ApiRequestInspector } from "./ApiRequestInspector";
import { ErrorLogViewer } from "./ErrorLogViewer";
import { ModelMetricsCard } from "./ModelMetricsCard";
import { PromptVersionHistory } from "./PromptVersionHistory";
import { TokenUsageCard } from "./TokenUsageCard";

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
  title: "Components/Observability",
  component: TokenUsageCard,
  subcomponents: { ModelMetricsCard, ErrorLogViewer, ApiRequestInspector, PromptVersionHistory },
  tags: ["autodocs"],
  args: {
    modelName: "claude-opus-4",
    inputTokens: 24_800,
    outputTokens: 8_350,
  },
  argTypes: {
    title: {
      description: "Card heading shown above the stats grid. Overrides the default \"Token Usage\" heading.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    modelName: {
      description: "Model identifier shown in the card header alongside the title.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    inputTokens: {
      description: "Number of input (prompt) tokens consumed.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "0" } },
    },
    outputTokens: {
      description: "Number of output (completion) tokens generated.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "0" } },
    },
    totalTokens: {
      description: "Explicit total — defaults to `inputTokens + outputTokens` when omitted.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "inputTokens + outputTokens" } },
    },
    costUsd: {
      description: "Estimated cost in USD. When provided, renders a fourth stat column.",
      control: { type: "number", min: 0, step: 0.0001 },
      table: { defaultValue: { summary: "undefined" } },
    },
    maxTokens: {
      description: "Context window limit. Renders a progress bar; bar turns amber at `warnThreshold`% and red at `dangerThreshold`%.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    warnThreshold: {
      description: "Percentage of `maxTokens` at which the progress bar turns amber. Only applies when `maxTokens` is set.",
      control: { type: "number", min: 0, max: 100 },
      table: { defaultValue: { summary: "80" } },
    },
    dangerThreshold: {
      description: "Percentage of `maxTokens` at which the bar turns red and a warning message appears.",
      control: { type: "number", min: 0, max: 100 },
      table: { defaultValue: { summary: "90" } },
    },
    showCost: {
      description: "Force the cost column to render even when `costUsd` is 0.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    currencySymbol: {
      description: "Currency symbol prefix shown in the cost column.",
      control: "text",
      table: { defaultValue: { summary: '"$"' } },
    },
    onStatClick: {
      description:
        "Called with the stat key (`\"input\"`, `\"output\"`, `\"total\"`, `\"cost\"`, or a custom `extraStats` id) when a stat column is clicked.",
      control: false,
    },
    statLabels: {
      description: "Override displayed labels for each stat column. Keys: `input`, `output`, `total`, `cost`, `max`.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    extraStats: {
      description: "Additional stat columns rendered after the built-in ones. Each item: `{ label, value, id? }`. The `id` is passed to `onStatClick`.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    renderWarning: {
      description:
        "Custom renderer for the context-window warning message — receives the usage percentage and returns a ReactNode. Replaces the default amber/red warning text.",
      control: false,
    },
    headerSlot: {
      description: "ReactNode rendered in the card header alongside the model name and title.",
      control: false,
      table: { category: "Slots" },
    },
    footerSlot: {
      description: "ReactNode rendered at the bottom of the card after all stats and the progress bar.",
      control: false,
      table: { category: "Slots" },
    },
    children: {
      description: "ReactNode rendered below the stats grid — use for custom charts, breakdowns, or additional context.",
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
Observability components for monitoring LLM token usage, latency, errors, API traffic, and prompt versions in real time.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import {
  TokenUsageCard,
  ModelMetricsCard,
  ErrorLogViewer,
  ApiRequestInspector,
  PromptVersionHistory,
} from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`TokenUsageCard\` | Input/output/total token counts with optional cost column and context-window progress bar |
| \`ModelMetricsCard\` | KPI grid for latency, throughput, error rate, and other model-level metrics with trend indicators |
| \`ErrorLogViewer\` | Filterable, expandable error log with severity badges, stack traces, and severity filter tabs |
| \`ApiRequestInspector\` | HTTP request/response inspector with method badge, status code, latency, and tabbed JSON panels |
| \`PromptVersionHistory\` | Versioned prompt history list with diff view, restore, duplicate, delete, and compare actions |

---

## Quick start

\`\`\`tsx
// Token usage
<TokenUsageCard
  modelName="claude-opus-4"
  inputTokens={24800}
  outputTokens={8350}
  costUsd={0.0142}
  maxTokens={200000}
  onStatClick={(stat) => openStatDrilldown(stat)}
/>

// Model metrics KPI grid
<ModelMetricsCard
  title="Model Performance"
  modelName="claude-opus-4"
  metrics={[
    { label: "Avg latency", value: 1.24, unit: "s", trend: "down", trendLabel: "12%" },
    { label: "Error rate",  value: "0.3", unit: "%", trend: "down", trendLabel: "0.1%" },
  ]}
  onRefresh={() => reload()}
/>

// Error log
<ErrorLogViewer
  entries={errorEntries}
  filterValue={filter}
  onFilterChange={setFilter}
  onClear={() => clearErrors()}
  onExport={() => downloadCsv()}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof TokenUsageCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── TokenUsageCard stories ───────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — adjust token counts, add a cost, set `maxTokens` to reveal the progress bar, and tweak `warnThreshold` / `dangerThreshold` using the controls panel.",
      },
    },
  },
};

export const WithCost: Story = {
  args: {
    inputTokens: 24_800,
    outputTokens: 8_350,
    costUsd: 0.0142,
    modelName: "claude-opus-4",
  },
  parameters: {
    docs: {
      description: {
        story: "Add `costUsd` to render a fourth cost column. Use `currencySymbol` to change the currency prefix (default `$`).",
      },
      source: {
        code: `<TokenUsageCard
  modelName="claude-opus-4"
  inputTokens={24800}
  outputTokens={8350}
  costUsd={0.0142}
  currencySymbol="$"
/>`,
      },
    },
  },
};

export const WithContextLimit: Story = {
  args: {
    inputTokens: 168_000,
    outputTokens: 12_000,
    maxTokens: 200_000,
    modelName: "claude-opus-4",
    costUsd: 0.086,
    warnThreshold: 80,
    dangerThreshold: 90,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `maxTokens` to display a progress bar. At `warnThreshold`% the bar turns amber; at `dangerThreshold`% it turns red and a warning message appears.",
      },
      source: {
        code: `<TokenUsageCard
  modelName="claude-opus-4"
  inputTokens={168000}
  outputTokens={12000}
  maxTokens={200000}
  costUsd={0.086}
  warnThreshold={80}
  dangerThreshold={90}
/>`,
      },
    },
  },
};

export const ClickableStats: Story = {
  args: {
    inputTokens: 24_800,
    outputTokens: 8_350,
    costUsd: 0.0142,
    onStatClick: () => {},
    extraStats: [
      { id: "cache",   label: "Cache hits", value: "34%" },
      { id: "cached_tokens", label: "Cached tokens", value: "8 420" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `onStatClick` to make each stat column clickable (e.g. to open a cost breakdown panel). Add `extraStats` for custom columns — their `id` is passed to `onStatClick`.",
      },
      source: {
        code: `<TokenUsageCard
  modelName="claude-opus-4"
  inputTokens={24800}
  outputTokens={8350}
  costUsd={0.0142}
  onStatClick={(stat) => openStatDrilldown(stat)}
  extraStats={[
    { id: "cache",         label: "Cache hits",    value: "34%" },
    { id: "cached_tokens", label: "Cached tokens", value: "8 420" },
  ]}
/>`,
      },
    },
  },
};

export const CustomStatLabels: Story = {
  args: {
    inputTokens: 24_800,
    outputTokens: 8_350,
    costUsd: 0.0142,
    title: "Usage Summary",
    statLabels: { input: "Prompt", output: "Completion", total: "Sum", cost: "Cost (USD)" },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `statLabels` to rename the built-in stat columns to match your terminology. Use `title` to override the default card heading.",
      },
      source: {
        code: `<TokenUsageCard
  title="Usage Summary"
  modelName="claude-opus-4"
  inputTokens={24800}
  outputTokens={8350}
  costUsd={0.0142}
  statLabels={{ input: "Prompt", output: "Completion", total: "Sum", cost: "Cost (USD)" }}
/>`,
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: { primary: "#7c3aed", primaryActive: "#5b21b6", foreground: "#1e1b4b" },
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── ModelMetricsCard showcase ────────────────────────────────────────────────

export const ModelMetricsShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 }}>
      <ModelMetricsCard
        title="Model Performance"
        modelName="claude-opus-4"
        metrics={[
          { label: "Avg latency", value: 1.24, unit: "s",      trend: "down",   trendLabel: "12%",  description: "P50 across all requests in the last hour" },
          { label: "Throughput",  value: 48,   unit: " req/m", trend: "up",     trendLabel: "8%" },
          { label: "Error rate",  value: "0.3", unit: "%",     trend: "down",   trendLabel: "0.1%" },
          { label: "TTFT",        value: 0.38, unit: "s",      trend: "stable", trendLabel: "—",    description: "Time to first token" },
          { label: "Total calls", value: "12.4k",              trend: "up",     trendLabel: "23%" },
          { label: "Cache hits",  value: "34", unit: "%",      trend: "up",     trendLabel: "5%" },
        ]}
        onRefresh={() => {}}
        refreshing={false}
        headerSlot={<span style={{ fontSize: 11, color: "#94a3b8" }}>Last updated 30 s ago</span>}
      />
      <ModelMetricsCard
        title="Haiku — Cost-optimised model"
        modelName="claude-haiku-4-5"
        metrics={[
          { label: "Avg latency", value: 0.41, unit: "s",    trend: "down",  trendLabel: "31%" },
          { label: "Error rate",  value: "0.1", unit: "%",   trend: "stable", trendLabel: "—" },
          { label: "Cost / 1k",   value: "$0.00025",         trend: "stable", trendLabel: "—" },
        ]}
        onRefresh={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ModelMetricsCard\` — auto-grid KPI dashboard for model-level metrics.

**Metric structure:** each metric requires \`label\` and \`value\`. Optional: \`unit\`, \`trend\` (\`"up"\` | \`"down"\` | \`"stable"\`), \`trendLabel\`, \`description\`, \`onClick\`.

**Trend colours:**
- \`"up"\` → red (latency/error going up is bad)
- \`"down"\` → green (latency going down is good)
- \`"stable"\` → muted grey
- Use per-metric \`trendIcon\` or global \`trendIcons\` to swap icons

**Key features:**
- \`onRefresh\` shows a Refresh button; \`refreshing={true}\` disables it while loading
- Per-metric \`description\` adds a subtitle line below the label
- Per-metric \`onClick\` makes individual KPI cells clickable
- \`trendIcons\` globally overrides trend indicator icons by direction
- \`headerSlot\` and \`footerSlot\` inject content in the card header/footer
- \`children\` renders custom content below the KPI grid
        `,
      },
      source: {
        code: `<ModelMetricsCard
  title="Model Performance"
  modelName="claude-opus-4"
  metrics={[
    { label: "Avg latency", value: 1.24, unit: "s",    trend: "down",   trendLabel: "12%", description: "P50 across all requests" },
    { label: "Throughput",  value: 48,   unit: " req/m", trend: "up",   trendLabel: "8%" },
    { label: "Error rate",  value: "0.3", unit: "%",   trend: "down",   trendLabel: "0.1%" },
    { label: "TTFT",        value: 0.38, unit: "s",    trend: "stable", trendLabel: "—",   description: "Time to first token" },
    { label: "Total calls", value: "12.4k",            trend: "up",     trendLabel: "23%" },
    { label: "Cache hits",  value: "34", unit: "%",    trend: "up",     trendLabel: "5%" },
  ]}
  onRefresh={() => reloadMetrics()}
  refreshing={isLoading}
  headerSlot={<span style={{ fontSize: 11, color: "gray" }}>Last updated 30 s ago</span>}
/>`,
      },
    },
  },
};

// ─── ErrorLogViewer showcase ──────────────────────────────────────────────────

export const ErrorLogShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 620 }}>
      <ErrorLogViewer
        entries={[
          {
            id: "e1",
            severity: "error",
            message: "Tool call timeout: web_search exceeded 30 s limit",
            timestamp: "10:42:03",
            source: "ToolExecutor",
            code: "TOOL_TIMEOUT",
            stack: "ToolExecutor.call (executor.ts:142)\nAgent.step (agent.ts:89)\nAgent.run (agent.ts:54)",
          },
          {
            id: "e2",
            severity: "warning",
            message: "Context window at 87% capacity — consider summarising",
            timestamp: "10:41:58",
            source: "ContextManager",
            code: "CONTEXT_WARN",
          },
          {
            id: "e3",
            severity: "info",
            message: "Retrying web_search with exponential backoff (attempt 2/3)",
            timestamp: "10:42:05",
            source: "RetryPolicy",
          },
          {
            id: "e4",
            severity: "error",
            message: "LLM returned malformed JSON — failed to parse tool call",
            timestamp: "10:42:09",
            source: "JSONParser",
            code: "PARSE_FAIL",
            stack: "JSON.parse (native)\nToolCallParser.parse (parser.ts:22)",
          },
        ]}
        onClear={() => {}}
        onExport={() => {}}
        onEntryClick={() => {}}
        filterPlaceholder="Filter by message, source, or code…"
        severityLabels={{ all: "All", error: "Errors", warning: "Warnings", info: "Info" }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ErrorLogViewer\` — filterable log list with severity badges and expandable rows.

**Entry structure:** \`{ id, severity, message, timestamp, source?, code?, stack? }\`
- \`severity\` values: \`"error"\` (red) · \`"warning"\` (amber) · \`"info"\` (muted)

**Key features:**
- Click any row to expand the stack trace, source, and error code — also fires \`onEntryClick(id, entry)\`
- Severity filter tabs: All / Error / Warning / Info — controlled via \`severityFilter\` + \`onSeverityFilterChange\`
- Free-text filter: \`filterValue\` + \`onFilterChange\`
- \`filterPlaceholder\` customises the search box placeholder
- \`onClear\` shows a Clear button; \`onExport\` shows an Export button
- \`clearLabel\` / \`exportLabel\` override the button text
- \`severityLabels\` overrides the tab label text
- \`emptyText\` / \`renderEmpty()\` shown when the filtered list is empty
- \`renderEntry(entry, isExpanded, toggle)\` fully replaces a single row
- \`headerSlot\` and \`footerSlot\` inject content at the top/bottom
        `,
      },
      source: {
        code: `<ErrorLogViewer
  entries={errorEntries}
  filterValue={filter}
  onFilterChange={setFilter}
  severityFilter={severityFilter}
  onSeverityFilterChange={setSeverityFilter}
  filterPlaceholder="Filter by message, source, or code…"
  onEntryClick={(id, entry) => openEntryDetail(entry)}
  onClear={() => clearErrors()}
  onExport={() => downloadCsv(errorEntries)}
  clearLabel="Clear all"
  exportLabel="Export CSV"
  severityLabels={{ all: "All", error: "Errors", warning: "Warnings", info: "Info" }}
  emptyText="No errors recorded."
  headerSlot={<span style={{ fontSize: 11 }}>Showing last 100 entries</span>}
/>`,
      },
    },
  },
};

// ─── ApiRequestInspector showcase ────────────────────────────────────────────

export const ApiInspectorShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 620 }}>
      <ApiRequestInspector
        method="POST"
        endpoint="/v1/messages"
        statusCode={200}
        latencyMs={1240}
        requestHeaders={{ "content-type": "application/json", "anthropic-version": "2023-06-01", "x-api-key": "sk-ant-***" }}
        requestBody={{ model: "claude-opus-4", max_tokens: 4096, messages: [{ role: "user", content: "Hello" }] }}
        responseBody={{ id: "msg_01", type: "message", role: "assistant", content: [{ type: "text", text: "Hello! How can I help?" }] }}
        responseHeaders={{ "content-type": "application/json", "x-request-id": "req_abc123", "request-id": "req_abc123" }}
        defaultTab="response"
        onCopy={() => {}}
        copyFeedbackLabel="Copied!"
        tabLabels={{ request: "Request body", response: "Response body", headers: "Headers" }}
      />
      <ApiRequestInspector
        method="POST"
        endpoint="/v1/messages"
        statusCode={429}
        latencyMs={58}
        requestBody={{ model: "claude-opus-4", max_tokens: 4096 }}
        responseBody={{ error: { type: "rate_limit_error", message: "Too many requests. Please retry after 30 s." } }}
        onRetry={() => {}}
        retryLabel="Retry request"
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ApiRequestInspector\` — full HTTP request/response inspector with tabbed panels.

**Built-in tabs:** Request body · Response body · Headers (only shown when headers are provided)

**Status code colours:** 2xx → green · 4xx/5xx → red · others → muted

**Key features:**
- \`defaultTab\` selects the initially active tab (\`"request"\`, \`"response"\`, \`"headers"\`, or an \`extraTabs\` id)
- \`onCopy(section, content)\` shows a copy button on each panel — section is the tab id
- \`copyFeedbackLabel\` / \`copyFeedbackDuration\` control the copy confirmation; set \`copyFeedbackLabel={null}\` to disable
- \`onRetry\` shows a Retry button in the header; \`retryLabel\` overrides the label
- \`extraTabs\` adds custom panels: \`[{ id, label, content: ReactNode }]\`
- \`tabLabels\` overrides the built-in tab label text
- \`headerSlot\` injects content in the card header (e.g. a timestamp or badge)
        `,
      },
      source: {
        code: `// Successful request with copy buttons and default tab
<ApiRequestInspector
  method="POST"
  endpoint="/v1/messages"
  statusCode={200}
  latencyMs={1240}
  requestHeaders={{ "content-type": "application/json", "anthropic-version": "2023-06-01" }}
  requestBody={{ model: "claude-opus-4", max_tokens: 4096, messages: [{ role: "user", content: "Hello" }] }}
  responseBody={{ id: "msg_01", role: "assistant", content: [{ type: "text", text: "Hello!" }] }}
  responseHeaders={{ "content-type": "application/json" }}
  defaultTab="response"
  onCopy={(section, content) => navigator.clipboard.writeText(content)}
  copyFeedbackLabel="Copied!"
  tabLabels={{ request: "Request body", response: "Response body", headers: "Headers" }}
/>

// Rate-limited request with retry button
<ApiRequestInspector
  method="POST"
  endpoint="/v1/messages"
  statusCode={429}
  latencyMs={58}
  requestBody={{ model: "claude-opus-4" }}
  responseBody={{ error: { type: "rate_limit_error", message: "Too many requests." } }}
  onRetry={() => retryRequest()}
  retryLabel="Retry request"
/>

// Custom extra tab
<ApiRequestInspector
  method="GET"
  endpoint="/v1/models"
  statusCode={200}
  latencyMs={42}
  responseBody={modelsData}
  extraTabs={[
    { id: "timing", label: "Timing", content: <TimingBreakdown data={timing} /> },
  ]}
/>`,
      },
    },
  },
};

// ─── PromptVersionHistory showcase ───────────────────────────────────────────

export const PromptVersionShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 540 }}>
      <PromptVersionHistory
        versions={[
          {
            id: "v3",
            version: "v3",
            description: "Added chain-of-thought reasoning instruction",
            author: "Alice",
            createdAt: "Today 09:12",
            tokens: 312,
            isActive: true,
            diffAdded: ["Think step-by-step before answering."],
            diffRemoved: [],
          },
          {
            id: "v2",
            version: "v2",
            description: "Tightened output format to JSON only",
            author: "Bob",
            createdAt: "Yesterday 16:40",
            tokens: 287,
            diffAdded: ["Respond only with valid JSON."],
            diffRemoved: ["Respond in plain text."],
          },
          {
            id: "v1",
            version: "v1",
            description: "Initial system prompt",
            author: "Alice",
            createdAt: "Mon 11:00",
            tokens: 198,
          },
        ]}
        activeVersionId="v3"
        onSelect={() => {}}
        onRestore={() => {}}
        onDuplicate={() => {}}
        onDelete={() => {}}
        onCompare={() => {}}
        restoreLabel="Set as active"
        deleteLabel="Remove"
        duplicateLabel="Duplicate"
        compareLabel="Compare with active"
        activeLabel="Active"
        emptyText="No prompt versions yet."
        footerSlot={
          <div style={{ paddingTop: 8 }}>
            <button style={{ fontSize: 12, color: "var(--kite-primary)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              + Save current as new version
            </button>
          </div>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`PromptVersionHistory\` — versioned prompt changelog with diff view and CRUD actions.

**Version structure:** \`{ id, version, description, author, createdAt, tokens?, isActive?, diffAdded?, diffRemoved? }\`

**Key features:**
- The active version is highlighted with a left accent border; its label is controlled by \`activeLabel\`
- Click a non-active version to select it (\`onSelect(id, version)\`)
- Expand any version to see the inline diff (\`diffAdded\`, \`diffRemoved\` string arrays)
- \`onRestore(id, version)\` shows a Restore button on non-active versions; \`restoreLabel\` overrides the label
- \`onDelete(id, version)\` shows a Delete button; \`deleteLabel\` overrides the label
- \`onDuplicate(id, version)\` shows a Duplicate button; \`duplicateLabel\` overrides the label
- \`onCompare(idA, idB)\` shows a Compare button (compares with active); \`compareLabel\` overrides the label
- \`renderVersion(version, isSelected)\` fully replaces a single row
- \`emptyText\` / \`renderEmpty()\` shown when \`versions\` is empty
- \`headerSlot\` / \`footerSlot\` inject content at the top/bottom
        `,
      },
      source: {
        code: `<PromptVersionHistory
  versions={versions}
  activeVersionId={currentVersionId}
  onSelect={(id, version) => loadVersion(id)}
  onRestore={(id, version) => restoreVersion(id)}
  onDelete={(id, version) => deleteVersion(id)}
  onDuplicate={(id, version) => duplicateVersion(id)}
  onCompare={(idA, idB) => openDiffView(idA, idB)}
  restoreLabel="Set as active"
  deleteLabel="Remove"
  duplicateLabel="Duplicate"
  compareLabel="Compare with active"
  activeLabel="Active"
  emptyText="No versions saved yet."
  footerSlot={
    <button onClick={saveCurrentVersion}>Save current as new version</button>
  }
/>`,
      },
    },
  },
};
