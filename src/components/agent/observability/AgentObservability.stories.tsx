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
    modelName: {
      description: "Model identifier shown in the card header.",
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
      description: "Explicit total — defaults to `inputTokens + outputTokens`.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "inputTokens + outputTokens" } },
    },
    costUsd: {
      description: "Estimated cost in USD. When provided, renders a fourth stat column.",
      control: { type: "number", min: 0, step: 0.0001 },
      table: { defaultValue: { summary: "undefined" } },
    },
    maxTokens: {
      description: "Context window limit. When set, renders a progress bar and a warning at 80%+.",
      control: { type: "number", min: 0 },
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
Observability components for monitoring LLM usage, latency, errors, and API traffic in real time.

---

## Import

\`\`\`tsx
import { TokenUsageCard, ModelMetricsCard, ErrorLogViewer, ApiRequestInspector, PromptVersionHistory } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`TokenUsageCard\` | Input/output/total token counts with optional cost and context-window progress bar |
| \`ModelMetricsCard\` | KPI grid for latency, throughput, error rate, and other model-level metrics |
| \`ErrorLogViewer\` | Filterable, expandable error log with severity badges and stack traces |
| \`ApiRequestInspector\` | Request/response inspector with method badge, status code, latency, and tabbed JSON panels |
| \`PromptVersionHistory\` | Versioned prompt history list with diff view, restore action, and active indicator |

## Usage

\`\`\`tsx
import { TokenUsageCard, ModelMetricsCard, ErrorLogViewer } from "@kitelus/fly-ui";

<TokenUsageCard
  modelName="claude-opus-4"
  inputTokens={24800}
  outputTokens={8350}
  costUsd={0.0142}
  maxTokens={200000}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof TokenUsageCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — adjust token counts, add a cost, and set `maxTokens` to reveal the progress bar.",
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
        story: "Render an estimated cost column by providing `costUsd`.",
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
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `maxTokens` to display a progress bar. At 80%+ a yellow warning appears; at 90%+ the bar turns red.",
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

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const ModelMetricsShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 560 }}>
      <ModelMetricsCard
        title="Model Performance"
        modelName="claude-opus-4"
        metrics={[
          { label: "Avg latency", value: 1.24, unit: "s", trend: "down", trendLabel: "12%" },
          { label: "Throughput", value: 48, unit: " req/m", trend: "up", trendLabel: "8%" },
          { label: "Error rate", value: "0.3", unit: "%", trend: "down", trendLabel: "0.1%" },
          { label: "TTFT", value: 0.38, unit: "s", trend: "stable", trendLabel: "—" },
          { label: "Total calls", value: "12.4k", trend: "up", trendLabel: "23%" },
          { label: "Cache hits", value: "34", unit: "%", trend: "up", trendLabel: "5%" },
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ModelMetricsCard` — auto-grid KPI dashboard. Each metric can display a value, unit, and trend direction with colour coding (↑ red = worse for latency, ↓ green = better).",
      },
      source: {
        code: `<ModelMetricsCard
  title="Model Performance"
  modelName="claude-opus-4"
  metrics={[
    { label: "Avg latency", value: 1.24, unit: "s", trend: "down", trendLabel: "12%" },
    { label: "Error rate", value: "0.3", unit: "%", trend: "down" },
    { label: "Throughput", value: 48, unit: " req/m", trend: "up", trendLabel: "8%" },
  ]}
/>`,
      },
    },
  },
};

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
        ]}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ErrorLogViewer` — filterable log list with `error`, `warning`, and `info` severity badges. Click any row to expand the stack trace, source, and error code.",
      },
      source: {
        code: `<ErrorLogViewer entries={errorEntries} filterValue={filter} onFilterChange={setFilter} />`,
      },
    },
  },
};

export const ApiInspectorShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 620 }}>
      <ApiRequestInspector
        method="POST"
        endpoint="/v1/messages"
        statusCode={200}
        latencyMs={1240}
        requestHeaders={{ "content-type": "application/json", "anthropic-version": "2023-06-01" }}
        requestBody={{ model: "claude-opus-4", max_tokens: 4096, messages: [{ role: "user", content: "Hello" }] }}
        responseBody={{ id: "msg_01", type: "message", role: "assistant", content: [{ type: "text", text: "Hello! How can I help?" }] }}
        responseHeaders={{ "content-type": "application/json", "x-request-id": "req_abc123" }}
      />
      <ApiRequestInspector
        method="POST"
        endpoint="/v1/messages"
        statusCode={429}
        latencyMs={58}
        requestBody={{ model: "claude-opus-4" }}
        responseBody={{ error: { type: "rate_limit_error", message: "Too many requests" } }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`ApiRequestInspector` — full HTTP request/response inspector. Tabs switch between Request body, Response body, and Headers. Status codes are colour-coded: 2xx green, 4xx/5xx red.",
      },
      source: {
        code: `<ApiRequestInspector
  method="POST"
  endpoint="/v1/messages"
  statusCode={200}
  latencyMs={1240}
  requestBody={requestPayload}
  responseBody={responsePayload}
  requestHeaders={headers}
/>`,
      },
    },
  },
};

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
          { id: "v1", version: "v1", description: "Initial system prompt", author: "Alice", createdAt: "Mon 11:00", tokens: 198 },
        ]}
        activeVersionId="v3"
        onSelect={() => {}}
        onRestore={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`PromptVersionHistory` — versioned prompt changelog. The active version is highlighted. Older versions show a **Restore** button. Click any version to expand the inline diff.",
      },
      source: {
        code: `<PromptVersionHistory
  versions={versions}
  activeVersionId={currentVersion}
  onSelect={(id) => loadVersion(id)}
  onRestore={(id) => restoreVersion(id)}
/>`,
      },
    },
  },
};
