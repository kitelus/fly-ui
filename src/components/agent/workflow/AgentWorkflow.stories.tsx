import type { Meta, StoryObj } from "@storybook/react-vite";

import { WorkflowParameterForm } from "./WorkflowParameterForm";
import { WorkflowStepList } from "./WorkflowStepList";
import { WorkflowTemplateCard } from "./WorkflowTemplateCard";

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

const DEMO_STEPS = [
  { id: "1", label: "Validate input schema",          status: "completed" as const, durationMs: 42 },
  { id: "2", label: "Fetch external data sources",    status: "completed" as const, durationMs: 820 },
  { id: "3", label: "Run ML classification model",   status: "running" as const,   description: "Classifying 1 240 records…" },
  { id: "4", label: "Generate summary report",        status: "pending" as const },
  { id: "5", label: "Send Slack notification",        status: "pending" as const },
];

const meta = {
  title: "Components/Workflow",
  component: WorkflowStepList,
  subcomponents: { WorkflowParameterForm, WorkflowTemplateCard },
  tags: ["autodocs"],
  args: {
    steps: DEMO_STEPS,
  },
  argTypes: {
    steps: {
      description:
        "Array of `WorkflowStep` objects. Each step: `{ id, label, status, description?, startedAt?, completedAt?, durationMs?, errorMessage?, icon? }`. Status values: `pending` | `running` | `completed` | `failed` | `skipped`.",
      control: "object",
      table: { defaultValue: { summary: "[]" } },
    },
    onStepClick: {
      description: "Called with `(id, step)` when a step row is clicked. Makes the row an interactive button.",
      control: false,
    },
    onStepRetry: {
      description: "Called with `(id, step)` — shows a Retry button on failed steps when provided.",
      control: false,
    },
    onStepSkip: {
      description: "Called with `(id, step)` — shows a Skip button on pending/failed steps when provided.",
      control: false,
    },
    statusIcons: {
      description: "Map of `status → ReactNode` to override the default step status icons. Partial — merged with built-in icons. Keys: `pending`, `running`, `completed`, `failed`, `skipped`.",
      control: false,
    },
    retryLabel: {
      description: "Label for the Retry button on failed steps.",
      control: "text",
      table: { defaultValue: { summary: '"Retry"' } },
    },
    skipLabel: {
      description: "Label for the Skip button on pending/failed steps.",
      control: "text",
      table: { defaultValue: { summary: '"Skip"' } },
    },
    renderStep: {
      description: "Custom render function for a single step row — receives the `WorkflowStep` object.",
      control: false,
    },
    renderEmpty: {
      description: "Custom render function for the empty state — shown when `steps` is empty.",
      control: false,
    },
    emptyText: {
      description: "Text shown when `steps` is empty.",
      control: "text",
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
Workflow configuration and visualisation components — step lists, parameter forms, and template cards.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import { WorkflowStepList, WorkflowParameterForm, WorkflowTemplateCard } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`WorkflowStepList\` | Vertical step list with status indicators (pending / running / completed / failed / skipped) and a connector line |
| \`WorkflowParameterForm\` | Dynamic form for workflow parameters supporting string, number, boolean, textarea, and select types |
| \`WorkflowTemplateCard\` | Template selection card with name, description, tags, complexity badge, and action buttons |

---

## Quick start

\`\`\`tsx
import { WorkflowStepList, WorkflowParameterForm, WorkflowTemplateCard } from "@kitelus/fly-ui";

// Step list — shows current execution progress
<WorkflowStepList
  steps={workflowSteps}
  onStepClick={(id, step) => openStepDetail(id)}
  onStepRetry={(id, step) => retryStep(id)}
/>

// Parameter form — configures a workflow before running
<WorkflowParameterForm
  parameters={schema}
  values={formValues}
  onChange={(key, value) => setFormValues(prev => ({ ...prev, [key]: value }))}
  onSubmit={(values) => startWorkflow(values)}
  submitLabel="Run workflow"
  onReset={() => setFormValues(defaults)}
/>

// Template card — displays an available workflow template
<WorkflowTemplateCard
  name="Data Quality Check"
  description="Scans a dataset for missing values and outliers."
  tags={["data", "validation"]}
  complexity="simple"
  stepCount={4}
  author="Platform Team"
  estimatedRuntime="~2 min"
  onPreview={() => previewTemplate(id)}
  onUse={() => startWorkflow(id)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof WorkflowStepList>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── WorkflowStepList stories ─────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — edit the `steps` array in the controls panel to experiment with different step statuses and content.",
      },
    },
  },
};

export const AllStatuses: Story = {
  args: {
    steps: [
      { id: "1", label: "Completed step",    status: "completed", durationMs: 1200 },
      { id: "2", label: "Currently running", status: "running",   description: "Processing records…" },
      { id: "3", label: "Failed step",       status: "failed",    errorMessage: "Connection refused on port 5432." },
      { id: "4", label: "Pending step",      status: "pending" },
      { id: "5", label: "Skipped step",      status: "skipped" },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: "All five step statuses side by side — the connector line runs between all steps.",
      },
    },
  },
};

export const RunningWorkflow: Story = {
  args: {
    steps: DEMO_STEPS,
    onStepClick: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "A typical mid-execution state — two completed steps, one running (pulsing indicator), two pending. Pass `onStepClick` to make steps interactive.",
      },
    },
  },
};

export const WithErrorsAndRetry: Story = {
  args: {
    steps: [
      { id: "1", label: "Load dataset",       status: "completed", durationMs: 230 },
      { id: "2", label: "Normalise columns",  status: "failed",    errorMessage: "Column 'revenue' contains non-numeric values.", durationMs: 140 },
      { id: "3", label: "Train model",        status: "pending" },
      { id: "4", label: "Evaluate accuracy",  status: "pending" },
    ],
    onStepRetry: () => {},
    onStepSkip: () => {},
    retryLabel: "Try again",
    skipLabel: "Skip step",
  },
  parameters: {
    docs: {
      description: {
        story:
          "A workflow halted at a failed step. Pass `onStepRetry` to show a Retry button, and `onStepSkip` to allow skipping the failed step. Labels are customisable.",
      },
      source: {
        code: `<WorkflowStepList
  steps={steps}
  onStepRetry={(id, step) => retryStep(id)}
  onStepSkip={(id, step) => skipStep(id)}
  retryLabel="Try again"
  skipLabel="Skip step"
/>`,
      },
    },
  },
};

export const WithCustomStatusIcons: Story = {
  args: {
    steps: DEMO_STEPS,
    statusIcons: {
      completed: <span style={{ fontSize: 14 }}>✅</span>,
      running:   <span style={{ fontSize: 14 }}>⚡</span>,
      pending:   <span style={{ fontSize: 14 }}>⏳</span>,
      failed:    <span style={{ fontSize: 14 }}>❌</span>,
      skipped:   <span style={{ fontSize: 14 }}>⏭️</span>,
    },
  },
  parameters: {
    docs: {
      description: {
        story: "Use `statusIcons` to override the default status indicators — accepts a partial map of `status → ReactNode`. Useful for custom icon libraries or brand icons.",
      },
      source: {
        code: `<WorkflowStepList
  steps={steps}
  statusIcons={{
    completed: <CheckCircleIcon />,
    running:   <SpinnerIcon className="animate-spin" />,
    pending:   <ClockIcon />,
    failed:    <XCircleIcon />,
    skipped:   <MinusCircleIcon />,
  }}
/>`,
      },
    },
  },
};

export const EmptyWorkflow: Story = {
  args: {
    steps: [],
    emptyText: "No steps defined. Add steps to build your workflow.",
  },
  parameters: {
    docs: {
      description: {
        story: "Pass `emptyText` (or `renderEmpty()`) to customise the empty state when the steps array is empty.",
      },
      source: {
        code: `<WorkflowStepList
  steps={[]}
  emptyText="No steps defined. Add steps to build your workflow."
/>

// Custom empty state
<WorkflowStepList
  steps={[]}
  renderEmpty={() => (
    <div style={{ padding: "24px", textAlign: "center" }}>
      <p>No workflow steps configured.</p>
      <button onClick={openStepEditor}>Add first step</button>
    </div>
  )}
/>`,
      },
    },
  },
};

export const Themed: Story = {
  args: {
    steps: DEMO_STEPS,
    theme: { primary: "#f97316", success: "#16a34a", danger: "#dc2626" },
  },
  parameters: {
    docs: { description: { story: "Per-component colour override via the `theme` prop." } },
  },
};

// ─── WorkflowParameterForm showcase ──────────────────────────────────────────

export const ParameterFormShowcase: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 480 }}>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>All field types with validation</p>
        <WorkflowParameterForm
          parameters={[
            {
              key: "source",
              label: "Data source",
              type: "select",
              required: true,
              description: "Choose the input data source for this workflow run.",
              options: [
                { label: "Production DB", value: "prod" },
                { label: "Staging DB",    value: "staging" },
                { label: "CSV Upload",    value: "csv" },
              ],
            },
            { key: "limit",  label: "Record limit", type: "number", description: "Maximum number of records to process per batch.", placeholder: "e.g. 1000", min: 1, max: 100000 },
            { key: "model",  label: "Model",         type: "string", description: "AI model to use for classification.",            placeholder: "claude-opus-4" },
            { key: "notes",  label: "Run notes",     type: "textarea", description: "Optional notes for this workflow run.",       placeholder: "e.g. Testing v2 prompt", rows: 3 },
            { key: "notify", label: "Send Slack notification", type: "boolean", description: "Post a summary to #ai-reports when the workflow completes." },
            { key: "tag",    label: "Experiment tag", type: "string", description: "Optional label for tracking runs.", validationError: "Tag cannot contain spaces." },
          ]}
          values={{ source: "prod", limit: 500, model: "claude-opus-4", notes: "", notify: true, tag: "v2 test" }}
          onChange={() => {}}
          onSubmit={() => {}}
          onReset={() => {}}
          submitLabel="Run workflow"
          resetLabel="Reset"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>Read-only mode</p>
        <WorkflowParameterForm
          parameters={[
            { key: "source", label: "Data source", type: "select", options: [{ label: "Production DB", value: "prod" }] },
            { key: "model",  label: "Model",        type: "string" },
            { key: "notify", label: "Send Slack notification", type: "boolean" },
          ]}
          values={{ source: "prod", model: "claude-opus-4", notify: true }}
          onChange={() => {}}
          readOnly
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`WorkflowParameterForm\` — a dynamic form driven by a parameter schema.

**Supported types:**
- \`"string"\` → text input
- \`"number"\` → number input (supports \`min\`, \`max\`, \`step\`)
- \`"boolean"\` → checkbox
- \`"select"\` → dropdown (requires \`options: [{ label, value }]\`)
- \`"textarea"\` → multi-line text area (supports \`rows\`)

**Key features:**
- \`required: true\` marks the field with an asterisk and blocks submit until filled
- \`validationError\` shows an inline error message below the field
- \`disabled: true\` per-parameter disables that field
- \`onSubmit(values)\` shows a Submit button (\`submitLabel\` overrides the label)
- \`onReset()\` shows a Reset button (\`resetLabel\` overrides the label)
- \`readOnly\` disables all fields at once — useful for showing a locked configuration
- \`footerSlot\` injects content below the form fields
        `,
      },
      source: {
        code: `<WorkflowParameterForm
  parameters={[
    { key: "source", label: "Data source", type: "select", required: true,
      options: [{ label: "Production DB", value: "prod" }, { label: "Staging DB", value: "staging" }] },
    { key: "limit",  label: "Record limit", type: "number", min: 1, max: 100000, placeholder: "e.g. 1000" },
    { key: "model",  label: "Model",        type: "string", placeholder: "claude-opus-4" },
    { key: "notes",  label: "Run notes",    type: "textarea", rows: 3 },
    { key: "notify", label: "Send Slack notification", type: "boolean" },
    { key: "tag",    label: "Experiment tag", type: "string", validationError: formErrors.tag },
  ]}
  values={formValues}
  onChange={(key, value) => setFormValues(prev => ({ ...prev, [key]: value }))}
  onSubmit={(values) => startWorkflow(values)}
  onReset={() => setFormValues(defaults)}
  submitLabel="Run workflow"
  resetLabel="Reset to defaults"
/>

// Read-only — locked configuration
<WorkflowParameterForm
  parameters={schema}
  values={savedValues}
  onChange={() => {}}
  readOnly
/>`,
      },
    },
  },
};

// ─── WorkflowTemplateCard showcase ───────────────────────────────────────────

export const TemplateCardShowcase: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, maxWidth: 680 }}>
      <WorkflowTemplateCard
        name="Data Quality Check"
        description="Scans a dataset for missing values, type mismatches, and statistical outliers. Generates a detailed report."
        tags={["data", "validation", "reporting"]}
        complexity="simple"
        complexityLabel="Simple"
        stepCount={4}
        author="Platform Team"
        estimatedRuntime="~2 min"
        onPreview={() => {}}
        onUse={() => {}}
        onFavorite={() => {}}
        isFavorited={false}
        useLabel="Use Template"
        previewLabel="Preview"
      />
      <WorkflowTemplateCard
        name="Multi-Agent Research"
        description="Orchestrates a researcher, analyst, and writer agent to produce a fully cited research report from a topic."
        tags={["multi-agent", "research", "report"]}
        complexity="complex"
        stepCount={12}
        author="AI Team"
        estimatedRuntime="~8 min"
        badge={<span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: "#fef3c7", color: "#d97706" }}>Popular</span>}
        onPreview={() => {}}
        onUse={() => {}}
        onFavorite={() => {}}
        isFavorited
      />
      <WorkflowTemplateCard
        name="Document Summarisation"
        description="Extracts key points from uploaded PDFs or URLs and delivers a structured executive summary."
        tags={["NLP", "summarisation"]}
        complexity="medium"
        stepCount={6}
        author="Community"
        estimatedRuntime="~3 min"
        onUse={() => {}}
        headerSlot={
          <span style={{ fontSize: 10, color: "#64748b" }}>Last updated 2 days ago</span>
        }
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`WorkflowTemplateCard\` — a clickable card for selecting workflow templates.

**Complexity colour-coding:**
- \`"simple"\` → green badge
- \`"medium"\` → amber badge
- \`"complex"\` → red badge

**Key features:**
- \`onPreview()\` shows a Preview button (\`previewLabel\` overrides the label)
- \`onUse()\` shows a Use Template button (\`useLabel\` overrides the label)
- \`onFavorite()\` shows a favourite toggle; \`isFavorited\` controls its state
- \`estimatedRuntime\` shows a time estimate (e.g. "~2 min")
- \`stepCount\` shows the number of steps in the workflow
- \`tags\` renders small chips
- \`badge\` renders a fully custom badge next to the title (e.g. "Popular", "New")
- \`complexityLabel\` overrides the complexity badge text (for i18n)
- \`headerSlot\` / \`footerSlot\` inject content at the top/bottom of the card
- The card itself is clickable via \`onClick\` (HTML div event)
        `,
      },
      source: {
        code: `<WorkflowTemplateCard
  name="Data Quality Check"
  description="Scans a dataset for missing values, type mismatches, and statistical outliers."
  tags={["data", "validation", "reporting"]}
  complexity="simple"
  stepCount={4}
  author="Platform Team"
  estimatedRuntime="~2 min"
  onPreview={() => previewTemplate(id)}
  onUse={() => startWorkflow(id)}
  onFavorite={() => toggleFavorite(id)}
  isFavorited={isFavorited}
  useLabel="Use Template"
  previewLabel="Preview"
/>

// With a custom badge
<WorkflowTemplateCard
  name="Multi-Agent Research"
  description="Orchestrates a researcher, analyst, and writer agent."
  tags={["multi-agent", "research"]}
  complexity="complex"
  stepCount={12}
  estimatedRuntime="~8 min"
  badge={<PopularBadge />}
  onUse={() => startWorkflow(id)}
/>`,
      },
    },
  },
};
