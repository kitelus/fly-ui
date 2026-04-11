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
        "Lifecycle status. Controls badge colour and available action buttons: `queued` grey, `running` pulsing blue (shows Cancel), `completed` green, `failed` red (shows Retry), `cancelled` grey.",
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
    priorityLabel: {
      description: "Override the priority badge label text — useful for i18n.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    progress: {
      description: "Completion percentage (0–100). When provided, renders a progress bar.",
      control: { type: "range", min: 0, max: 100, step: 1 },
      table: { defaultValue: { summary: "undefined" } },
    },
    progressLabel: {
      description: "Custom label shown next to or above the progress bar (e.g. `\"3 / 7 files\"`).",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    eta: {
      description: "Estimated time to completion shown below the progress bar.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    startedAt: {
      description: "Task start time string.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    completedAt: {
      description: "Task completion time string.",
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
    onPause: {
      description: "Callback — shows a **Pause** button when `status === \"running\"` (unless `alwaysShowPauseResume` is false).",
      control: false,
    },
    onResume: {
      description: "Callback — shows a **Resume** button when `status === \"cancelled\"` or a paused state.",
      control: false,
    },
    alwaysShowPauseResume: {
      description: "When `true`, shows Pause/Resume buttons regardless of the current status.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    cancelLabel: {
      description: "Label for the Cancel button.",
      control: "text",
      table: { defaultValue: { summary: '"Cancel"' } },
    },
    retryLabel: {
      description: "Label for the Retry button.",
      control: "text",
      table: { defaultValue: { summary: '"Retry"' } },
    },
    pauseLabel: {
      description: "Label for the Pause button.",
      control: "text",
      table: { defaultValue: { summary: '"Pause"' } },
    },
    resumeLabel: {
      description: "Label for the Resume button.",
      control: "text",
      table: { defaultValue: { summary: '"Resume"' } },
    },
    extraActions: {
      description: "Additional action buttons rendered alongside the built-in ones. Each: `{ label, onClick, variant?, ariaLabel? }`.",
      control: false,
    },
    headerSlot: {
      description: "ReactNode rendered in the card header alongside the task name.",
      control: false,
      table: { category: "Slots" },
    },
    children: {
      description: "ReactNode rendered below all built-in rows — use for custom progress indicators, metadata, or sub-task lists.",
      control: false,
      table: { category: "Slots" },
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

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import { TaskStatusCard, BatchMonitor, TaskResultInspector } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`TaskStatusCard\` | Single-task card with status badge, priority, progress bar, ETA, and action buttons |
| \`BatchMonitor\` | Batch overview with summary counts, an overall progress bar, per-item rows, and per-item retry/cancel |
| \`TaskResultInspector\` | Result viewer with JSON / Text / Markdown format tabs, copy, and download actions |

---

## Quick start

\`\`\`tsx
import { TaskStatusCard, BatchMonitor, TaskResultInspector } from "@kitelus/fly-ui";

// Single task
<TaskStatusCard
  name="Generate Report"
  taskId="task_01"
  status="running"
  priority="high"
  progress={62}
  eta="~2 min"
  onCancel={() => cancelTask("task_01")}
/>

// Batch of tasks
<BatchMonitor
  batchName="Nightly Summarisation"
  items={batchItems}
  onRetryFailed={() => retryAllFailed()}
  onRetryItem={(id) => retryTask(id)}
  onCancelItem={(id) => cancelTask(id)}
  onCancelAll={() => cancelBatch()}
/>

// Task result output
<TaskResultInspector
  result={taskOutput}
  tokenCount={8350}
  durationMs={2840}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onDownload={(text) => downloadFile(text, "result.json")}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof TaskStatusCard>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── TaskStatusCard stories ───────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — change `status`, adjust `progress`, set a `priority`, add an `errorMessage`, and wire up action callbacks using the controls panel.",
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
    progressLabel: "Processing file 3 of 8",
    startedAt: "10:55 AM",
    eta: "~5 min",
    onCancel: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Task is actively running with a progress bar. Urgent priority is highlighted in red. Pass `onCancel` to show a Cancel button.",
      },
      source: {
        code: `<TaskStatusCard
  name="Generate Executive Summary"
  taskId="task_01"
  status="running"
  priority="urgent"
  progress={35}
  progressLabel="Processing file 3 of 8"
  startedAt="10:55 AM"
  eta="~5 min"
  onCancel={() => cancelTask("task_01")}
/>`,
      },
    },
  },
};

export const RunningWithPause: Story = {
  args: {
    status: "running",
    priority: "high",
    progress: 60,
    startedAt: "10:55 AM",
    onCancel: () => {},
    onPause: () => {},
    pauseLabel: "Pause",
    cancelLabel: "Abort",
  },
  parameters: {
    docs: {
      description: {
        story: "Pass `onPause` alongside `onCancel` to show a Pause button for tasks that can be suspended. Labels are overridable via `pauseLabel` and `cancelLabel`.",
      },
      source: {
        code: `<TaskStatusCard
  name="Document Processing"
  status="running"
  progress={60}
  onCancel={() => cancelTask(id)}
  onPause={() => pauseTask(id)}
  pauseLabel="Pause"
  cancelLabel="Abort"
/>`,
      },
    },
  },
};

export const Completed: Story = {
  args: { status: "completed", priority: "normal", progress: 100, startedAt: "10:41 AM", completedAt: "10:43 AM", eta: undefined },
  parameters: {
    docs: { description: { story: "Task completed — progress bar turns green, duration is shown." } },
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
          "Task failed — progress bar turns red, error message is shown in an alert, and a Retry button appears when `onRetry` is provided.",
      },
    },
  },
};

export const Cancelled: Story = {
  args: {
    status: "cancelled",
    priority: "normal",
    progress: 33,
    startedAt: "11:00 AM",
    onResume: () => {},
    resumeLabel: "Resume",
  },
  parameters: {
    docs: {
      description: {
        story: "Task was cancelled — pass `onResume` to show a Resume button so the user can restart from where it left off.",
      },
      source: {
        code: `<TaskStatusCard
  name="Generate Report"
  status="cancelled"
  progress={33}
  onResume={() => resumeTask(id)}
  resumeLabel="Resume"
/>`,
      },
    },
  },
};

export const WithExtraActions: Story = {
  args: {
    status: "completed",
    priority: "normal",
    progress: 100,
    extraActions: [
      { label: "View result",  onClick: () => {}, variant: "primary" },
      { label: "Export",       onClick: () => {} },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `extraActions` to add custom buttons alongside the built-in Cancel/Retry. Each action accepts `label`, `onClick`, and optional `variant` (`\"primary\"`, `\"danger\"`, or `\"default\"`).",
      },
      source: {
        code: `<TaskStatusCard
  name="Generate Report"
  status="completed"
  progress={100}
  extraActions={[
    { label: "View result", onClick: () => openResultPanel(), variant: "primary" },
    { label: "Export",      onClick: () => downloadResult() },
  ]}
/>`,
      },
    },
  },
};

export const WithCustomLabels: Story = {
  args: {
    status: "running",
    priority: "high",
    priorityLabel: "ALTA PRIORIDAD",
    progress: 50,
    onCancel: () => {},
    cancelLabel: "Cancelar",
    onPause: () => {},
    pauseLabel: "Pausar",
  },
  parameters: {
    docs: {
      description: {
        story: "Override all labels for i18n support — `priorityLabel`, `cancelLabel`, `pauseLabel`, `resumeLabel`, `retryLabel` all accept custom strings.",
      },
      source: {
        code: `<TaskStatusCard
  name="Generar Resumen"
  status="running"
  priority="high"
  priorityLabel="ALTA PRIORIDAD"
  progress={50}
  onCancel={() => cancelTask(id)}
  cancelLabel="Cancelar"
  onPause={() => pauseTask(id)}
  pauseLabel="Pausar"
/>`,
      },
    },
  },
};

export const WithChildrenSlot: Story = {
  args: {
    status: "running",
    priority: "normal",
    progress: 40,
    children: (
      <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
        <div>✓ Step 1: Data validation</div>
        <div>✓ Step 2: Schema mapping</div>
        <div style={{ color: "#3b82f6" }}>⟳ Step 3: Model inference (running…)</div>
        <div style={{ color: "#94a3b8" }}>○ Step 4: Report generation</div>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: "Use the `children` slot to render a sub-task list, custom progress indicator, or any metadata below the built-in rows.",
      },
      source: {
        code: `<TaskStatusCard
  name="Data Pipeline"
  status="running"
  progress={40}
>
  <SubTaskList steps={workflowSteps} />
</TaskStatusCard>`,
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

// ─── BatchMonitor showcase ────────────────────────────────────────────────────

export const BatchMonitorShowcase: Story = {
  render: () => (
    <div style={{ maxWidth: 540 }}>
      <BatchMonitor
        batchName="Nightly Document Summarisation"
        items={[
          { id: "t1", name: "Q3 Financial Report.pdf",        status: "completed", progress: 100 },
          { id: "t2", name: "Product Roadmap 2025.docx",      status: "completed", progress: 100 },
          { id: "t3", name: "Customer Feedback June.xlsx",    status: "running",   progress: 67 },
          { id: "t4", name: "Board Meeting Minutes.pdf",      status: "running",   progress: 22 },
          { id: "t5", name: "Legal Contract v4.docx",         status: "queued" },
          { id: "t6", name: "Competitor Analysis.pptx",       status: "failed",    errorMessage: "File parse error: unsupported format." },
          { id: "t7", name: "HR Policy Update.pdf",           status: "queued" },
        ]}
        onRetryFailed={() => {}}
        onRetryItem={() => {}}
        onCancelItem={() => {}}
        onCancelAll={() => {}}
        retryFailedLabel="Retry all failed"
        cancelAllLabel="Cancel batch"
        retryItemLabel="Retry"
        cancelItemLabel="Cancel"
        statLabels={{ total: "Files", done: "Done", running: "Running", queued: "Queued", failed: "Failed" }}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`BatchMonitor\` — overview panel for parallel batch task execution.

**Summary row:** shows total count, done, running, queued, and failed — auto-calculated from \`items\`.

**Key features:**
- \`onRetryFailed()\` shows a "Retry failed" button when there are failed items (\`retryFailedLabel\` overrides the label)
- \`onRetryItem(id, item)\` shows a per-item Retry button on failed rows (\`retryItemLabel\` overrides the label)
- \`onCancelItem(id, item)\` shows a per-item Cancel button on running/queued rows (\`cancelItemLabel\` overrides the label)
- \`onCancelAll()\` shows a Cancel all button in the header (\`cancelAllLabel\` overrides the label)
- \`statLabels\` overrides the summary stat labels (Total, Done, Running, Queued, Failed)
- Failed items show their \`errorMessage\` inline
- \`renderItem(item)\` fully replaces a single item row
- \`emptyText\` / \`renderEmpty()\` shown when \`items\` is empty
- \`headerSlot\` / \`footerSlot\` inject content at the top/bottom of the card
        `,
      },
      source: {
        code: `<BatchMonitor
  batchName="Nightly Document Summarisation"
  items={batchItems}
  onRetryFailed={() => retryAllFailed()}
  onRetryItem={(id) => retryTask(id)}
  onCancelItem={(id) => cancelTask(id)}
  onCancelAll={() => cancelBatch()}
  retryFailedLabel="Retry all failed"
  cancelAllLabel="Cancel batch"
  retryItemLabel="Retry"
  cancelItemLabel="Stop"
  statLabels={{ total: "Files", done: "Done", running: "Running", queued: "Queued", failed: "Failed" }}
/>`,
      },
    },
  },
};

export const BatchMonitorEmpty: Story = {
  render: () => (
    <div style={{ maxWidth: 540 }}>
      <BatchMonitor
        batchName="Empty Batch"
        items={[]}
        emptyText="No items queued. Add documents to start processing."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Pass `emptyText` (or `renderEmpty()`) to customise the empty state when there are no batch items.",
      },
      source: {
        code: `<BatchMonitor
  batchName="Empty Batch"
  items={[]}
  emptyText="No items queued. Add documents to start processing."
/>

// Custom empty state with a call-to-action
<BatchMonitor
  batchName="Empty Batch"
  items={[]}
  renderEmpty={() => (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <p>No items queued.</p>
      <button onClick={() => openUploadDialog()}>Upload documents</button>
    </div>
  )}
/>`,
      },
    },
  },
};

// ─── TaskResultInspector showcase ────────────────────────────────────────────

export const TaskResultShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 580 }}>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>JSON result with copy and download</p>
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
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Custom format labels + extra format tab</p>
        <TaskResultInspector
          result={{ status: "ok", data: [1, 2, 3] }}
          tokenCount={120}
          durationMs={340}
          formatLabels={{ json: "Raw JSON", text: "Readable", markdown: "Markdown" }}
          extraFormats={[
            { id: "csv", label: "CSV", render: (r) => Object.values(r as object).join(",") },
          ]}
          toolbarSlot={
            <span style={{ fontSize: 11, color: "#64748b" }}>v1.2.0</span>
          }
          onCopy={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`TaskResultInspector\` — structured result viewer with format tabs.

**Built-in format tabs:** JSON · Text · Markdown

**Key features:**
- \`format\` + \`onFormatChange\` give controlled format tab state
- \`onCopy(content)\` shows a Copy button in the toolbar
- \`onDownload(content)\` shows a Download button in the toolbar
- \`tokenCount\` and \`durationMs\` are shown as metadata chips in the footer
- \`formatLabels\` overrides the tab label text (e.g. \`{ json: "Raw JSON" }\`)
- \`extraFormats\` adds custom format tabs: \`[{ id, label, render: (result) => string }]\`
- \`renderOutput(content, format)\` fully replaces the output area for custom rendering
- \`toolbarSlot\` injects content in the toolbar row
        `,
      },
      source: {
        code: `<TaskResultInspector
  result={taskOutput}
  tokenCount={8350}
  durationMs={2840}
  onCopy={(text) => navigator.clipboard.writeText(text)}
  onDownload={(text) => downloadFile(text, "result.json")}
/>

// Controlled format tab
<TaskResultInspector
  result={taskOutput}
  format={activeFormat}
  onFormatChange={setActiveFormat}
  formatLabels={{ json: "Raw JSON", text: "Readable", markdown: "Markdown" }}
  onCopy={(text) => navigator.clipboard.writeText(text)}
/>

// Custom extra format tab
<TaskResultInspector
  result={taskOutput}
  extraFormats={[
    {
      id: "table",
      label: "Table",
      render: (result) => renderAsTable(result as MyData),
    },
  ]}
  onCopy={(text) => navigator.clipboard.writeText(text)}
/>

// With toolbar slot
<TaskResultInspector
  result={taskOutput}
  toolbarSlot={<span>Model: claude-opus-4</span>}
  onCopy={(text) => navigator.clipboard.writeText(text)}
/>`,
      },
    },
  },
};
