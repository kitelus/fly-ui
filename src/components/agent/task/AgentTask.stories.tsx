import type { Meta, StoryObj } from "@storybook/react-vite";

import { BatchMonitor } from "./BatchMonitor";
import { TaskResultInspector } from "./TaskResultInspector";
import { TaskStatusCard } from "./TaskStatusCard";

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
  title: "Components/Task Management",
  component: TaskStatusCard,
  subcomponents: { BatchMonitor, TaskResultInspector },
  tags: ["autodocs"],
  args: {
    name: "Generate Executive Summary",
    taskId: "task_01JXYZ",
    status: "running",
    priority: "high",
    progress: 62,
    startedAt: "10:41 AM",
    eta: "~2 min",
  },
  argTypes: {
    name: {
      description: "Human-readable task name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    taskId: {
      description: "Unique task identifier shown in monospace below the name.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    status: {
      description:
        "Lifecycle status. Controls badge colour: `queued` grey, `running` pulsing blue, `completed` green, `failed` red, `cancelled` grey.",
      options: ["queued", "running", "completed", "failed", "cancelled"],
      control: { type: "select" },
      table: { defaultValue: { summary: "queued" } },
    },
    priority: {
      description: "Priority label shown with colour coding: `low` muted, `normal` primary, `high` warning, `urgent` danger.",
      options: ["low", "normal", "high", "urgent"],
      control: { type: "inline-radio" },
      table: { defaultValue: { summary: "undefined" } },
    },
    progress: {
      description: "Completion percentage (0–100). When provided renders a progress bar.",
      control: { type: "range", min: 0, max: 100, step: 1 },
      table: { defaultValue: { summary: "undefined" } },
    },
    eta: {
      description: "Estimated time to completion shown below the progress bar.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    startedAt: {
      description: "Task start time string shown below the progress bar.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    errorMessage: {
      description: "Error description shown in a red alert box when `status === \"failed\"`.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    onCancel: {
      description: "Callback — shows a **Cancel** button when `status === \"running\"`.",
      control: false,
    },
    onRetry: {
      description: "Callback — shows a **Retry** button when `status === \"failed\"`.",
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
Task management components for tracking individual tasks, monitoring batch jobs, and inspecting results.

---

## Import

\`\`\`tsx
import { TaskStatusCard, BatchMonitor, TaskResultInspector } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`TaskStatusCard\` | Single-task card with status badge, priority, progress bar, ETA, and action buttons |
| \`BatchMonitor\` | Batch overview with summary stats, overall progress bar, and per-item status rows |
| \`TaskResultInspector\` | Result viewer with JSON/text/markdown format tabs, copy, and download actions |

## Usage

\`\`\`tsx
import { TaskStatusCard, BatchMonitor, TaskResultInspector } from "@kitelus/fly-ui";

<TaskStatusCard
  name="Generate Report"
  taskId="task_01"
  status="running"
  priority="high"
  progress={62}
  onCancel={() => cancelTask("task_01")}
/>

<BatchMonitor
  batchName="Nightly Summarisation"
  items={batchItems}
  onRetryFailed={() => retryFailedTasks()}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof TaskStatusCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — change `status`, adjust `progress`, set a `priority`, and add an `errorMessage` using the controls panel.",
      },
    },
  },
};

export const Queued: Story = {
  args: { status: "queued", progress: undefined, startedAt: undefined, eta: undefined, priority: "normal" },
  parameters: {
    docs: { description: { story: "Task is queued and waiting to be picked up by an executor." } },
  },
};

export const Running: Story = {
  args: {
    status: "running",
    priority: "urgent",
    progress: 35,
    startedAt: "10:55 AM",
    eta: "~5 min",
    onCancel: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Task is actively running with a progress bar and cancel button. Urgent priority is highlighted in red.",
      },
    },
  },
};

export const Completed: Story = {
  args: { status: "completed", priority: "normal", progress: 100, startedAt: "10:41 AM", eta: undefined },
  parameters: {
    docs: { description: { story: "Task completed — progress bar turns green." } },
  },
};

export const Failed: Story = {
  args: {
    status: "failed",
    priority: "high",
    progress: 48,
    errorMessage: "LLM API returned 503 Service Unavailable after 3 retries.",
    onRetry: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Task failed — progress bar turns red, error message is shown in an alert, and a Retry button appears.",
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: { primary: "#0d9488", success: "#16a34a", danger: "#dc2626", warning: "#d97706" },
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── SHOWCASES ──────────────────────────────────────────────────────────────────

export const BatchMonitorShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 540 }}>
      <BatchMonitor
        batchName="Nightly Document Summarisation"
        items={[
          { id: "t1", name: "Q3 Financial Report.pdf", status: "completed", progress: 100 },
          { id: "t2", name: "Product Roadmap 2025.docx", status: "completed", progress: 100 },
          { id: "t3", name: "Customer Feedback June.xlsx", status: "running", progress: 67 },
          { id: "t4", name: "Board Meeting Minutes.pdf", status: "running", progress: 22 },
          { id: "t5", name: "Legal Contract v4.docx", status: "queued" },
          { id: "t6", name: "Competitor Analysis.pptx", status: "failed" },
          { id: "t7", name: "HR Policy Update.pdf", status: "queued" },
        ]}
        onRetryFailed={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`BatchMonitor` — overview for parallel task execution. Shows summary counts (total / done / running / failed), an overall progress bar, and per-item rows. Pass `onRetryFailed` to show a retry button.",
      },
      source: {
        code: `<BatchMonitor
  batchName="Nightly Summarisation"
  items={batchItems}
  onRetryFailed={() => retryFailedTasks()}
/>`,
      },
    },
  },
};

export const TaskResultShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 580 }}>
      <TaskResultInspector
        result={{
          summary: "Q3 revenue grew 23% YoY driven by enterprise segment expansion.",
          keyFindings: [
            "Widget Pro contributed $142k — 34% of total revenue",
            "Churn rate decreased from 4.2% to 2.8%",
            "APAC region showed 41% growth",
          ],
          recommendations: ["Increase Widget Pro inventory by 20%", "Invest in APAC marketing"],
          generatedAt: "2025-01-14T10:45:00Z",
          modelUsed: "claude-opus-4",
          tokenCount: 8350,
        }}
        tokenCount={8350}
        durationMs={2840}
        onCopy={() => {}}
        onDownload={() => {}}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`TaskResultInspector` — structured result viewer with **JSON**, **Text**, and **Markdown** format tabs. Shows token count and execution duration in the footer. Pass `onCopy` and `onDownload` for action buttons.",
      },
      source: {
        code: `<TaskResultInspector
  result={taskOutput}
  tokenCount={8350}
  durationMs={2840}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onDownload={(text) => downloadFile(text, "result.json")}
/>`,
      },
    },
  },
};
