import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";

import { ContentPreview } from "./ContentPreview";
import { PromptEditor } from "./PromptEditor";
import { VariantComparison } from "./VariantComparison";

/** Minimal inline markdown renderer — no external deps required */
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = () => {
    if (listItems.length) {
      nodes.push(
        <ul
          key={`ul-${nodes.length}`}
          style={{ margin: "4px 0", paddingLeft: 20 }}
        >
          {listItems}
        </ul>,
      );
      listItems = [];
    }
  };

  const renderInline = (s: string, key: number): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    let last = 0;
    const combined = /\*\*(.+?)\*\*|_(.+?)_|`([^`]+)`/g;
    let m: RegExpExecArray | null;
    while ((m = combined.exec(s)) !== null) {
      if (m.index > last) parts.push(s.slice(last, m.index));
      if (m[1] !== undefined) parts.push(<strong key={m.index}>{m[1]}</strong>);
      else if (m[2] !== undefined) parts.push(<em key={m.index}>{m[2]}</em>);
      else if (m[3] !== undefined)
        parts.push(
          <code
            key={m.index}
            style={{
              fontFamily: "monospace",
              background: "var(--kite-surface)",
              padding: "1px 4px",
              borderRadius: 3,
              fontSize: "0.9em",
            }}
          >
            {m[3]}
          </code>,
        );
      last = m.index + m[0].length;
    }
    if (last < s.length) parts.push(s.slice(last));
    return <span key={key}>{parts}</span>;
  };

  lines.forEach((line, i) => {
    const heading = line.match(/^(#{1,3}) (.+)/);
    const li = line.match(/^[-*] (.+)/);
    if (heading) {
      flushList();
      const Tag = `h${heading[1].length}` as "h1" | "h2" | "h3";
      const sizes = { h1: 18, h2: 15, h3: 13 } as const;
      nodes.push(
        <Tag key={i} style={{ margin: "4px 0", fontSize: sizes[Tag] }}>
          {renderInline(heading[2], i)}
        </Tag>,
      );
    } else if (li) {
      listItems.push(<li key={i}>{renderInline(li[1], i)}</li>);
    } else {
      flushList();
      if (line.trim())
        nodes.push(
          <p key={i} style={{ margin: "2px 0" }}>
            {renderInline(line, i)}
          </p>,
        );
    }
  });
  flushList();
  return <div style={{ lineHeight: 1.6 }}>{nodes}</div>;
}

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

const SAMPLE_PROMPT = `You are a professional business analyst. Your task is to analyse the provided {{data_source}} and identify the top {{num_insights}} key insights.

Format your response as a structured JSON object with the following fields:
- summary: A one-sentence executive summary
- insights: Array of insight objects with "title" and "description" fields
- recommendations: Array of actionable next steps`;

const meta = {
  title: "Components/Content",
  component: PromptEditor,
  subcomponents: { ContentPreview, VariantComparison },
  tags: ["autodocs"],
  args: {
    value: SAMPLE_PROMPT,
    label: "System Prompt",
    estimatedTokens: 89,
    maxTokens: 4096,
  },
  argTypes: {
    value: {
      description: "Current prompt text (controlled).",
      control: "text",
      table: { defaultValue: { summary: '""' } },
    },
    label: {
      description: "Label shown in the toolbar above the editor.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    placeholder: {
      description: "Textarea placeholder shown when the prompt is empty.",
      control: "text",
      table: { defaultValue: { summary: '"Enter your prompt…"' } },
    },
    estimatedTokens: {
      description:
        "Estimated token count shown in the toolbar. Turns amber when above 90% of `maxTokens`.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    maxTokens: {
      description:
        "Token limit — shown alongside `estimatedTokens` as `n / max`.",
      control: { type: "number", min: 0 },
      table: { defaultValue: { summary: "undefined" } },
    },
    readOnly: {
      description:
        "Disables editing — useful for displaying a prompt without allowing changes.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    rows: {
      description:
        "Number of visible rows for the textarea. Used to set the default height before scrolling.",
      control: { type: "number", min: 1 },
      table: { defaultValue: { summary: "6" } },
    },
    showLineNumbers: {
      description: "Displays line numbers in the left gutter of the editor.",
      control: "boolean",
      table: { defaultValue: { summary: "false" } },
    },
    minHeight: {
      description:
        'Minimum height of the textarea. Accepts CSS values (e.g. `"120px"`) or a number (treated as px).',
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    maxHeight: {
      description: "Maximum height of the textarea before it scrolls.",
      control: "text",
      table: { defaultValue: { summary: "undefined" } },
    },
    variables: {
      description:
        "Array of `{ name, description? }` objects. Renders clickable chips that call `onVariableInsert(name)` when clicked.",
      control: "object",
      table: { defaultValue: { summary: "undefined" } },
    },
    onSave: {
      description:
        "Callback — shows a Save button when provided. Receives the current prompt text.",
      control: false,
    },
    onFormat: {
      description:
        "Callback — shows a Format button when provided. Receives the current prompt text.",
      control: false,
    },
    saveLabel: {
      description: "Label for the Save button.",
      control: "text",
      table: { defaultValue: { summary: '"Save"' } },
    },
    formatLabel: {
      description: "Label for the Format button.",
      control: "text",
      table: { defaultValue: { summary: '"Format"' } },
    },
    onChange: {
      description:
        "Controlled change callback — receives the updated text string.",
      control: false,
    },
    onVariableInsert: {
      description:
        "Called with the variable name when a variable chip is clicked.",
      control: false,
    },
    toolbarSlot: {
      description: "ReactNode injected into the right side of the toolbar row.",
      control: false,
      table: { category: "Slots" },
    },
    footerSlot: {
      description: "ReactNode rendered below the editor.",
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
Content generation components — prompt editing, output preview, and variant comparison for AI-generated content workflows.

      > Availability: These components are available in '@kitelus/fly-ui' version '0.1.5-rc.0' and later.

---

## Install

\`\`\`bash
npm install @kitelus/fly-ui
\`\`\`

## Import

\`\`\`tsx
import { PromptEditor, ContentPreview, VariantComparison } from "@kitelus/fly-ui";
\`\`\`

## Components

| Component | Description |
|---|---|
| \`PromptEditor\` | Monospace textarea with token counter, variable chips, line numbers, and save/format actions |
| \`ContentPreview\` | Rendered content preview with word count, reading time, quality score, and copy/export actions |
| \`VariantComparison\` | Side-by-side grid to compare multiple generated content variants and select the best one |

---

## Quick start

\`\`\`tsx
import { PromptEditor, ContentPreview, VariantComparison } from "@kitelus/fly-ui";

// Editable prompt with variable chips
<PromptEditor
  value={prompt}
  label="System Prompt"
  estimatedTokens={estimatedTokens}
  maxTokens={4096}
  showLineNumbers
  variables={[
    { name: "data_source",  description: "Source dataset or document" },
    { name: "num_insights", description: "Number of key insights to extract" },
  ]}
  onChange={setPrompt}
  onVariableInsert={(name) => insertAtCursor(name)}
  onSave={(text) => savePrompt(text)}
  onFormat={(text) => formatPrompt(text)}
/>

// Content output preview
<ContentPreview
  title="Generated Summary"
  content={generatedText}
  format="markdown"
  wordCount={wordCount}
  qualityScore={88}
  onCopy={(content) => navigator.clipboard.writeText(content)}
  onExport={() => downloadFile(content)}
/>

// Side-by-side variant comparison
<VariantComparison
  variants={variants}
  selectedId={selectedId}
  onSelect={(id) => setSelectedId(id)}
  onCopy={(content, id) => navigator.clipboard.writeText(content)}
/>
\`\`\`
        `,
      },
    },
  },
} satisfies Meta<typeof PromptEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

// ─── PromptEditor stories ─────────────────────────────────────────────────────

export const Playground: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interactive playground — edit the prompt, adjust `estimatedTokens`, toggle `readOnly` and `showLineNumbers`, and add variables via the controls panel.",
      },
    },
  },
};

export const WithVariables: Story = {
  args: {
    value:
      "Analyse the {{data_source}} and summarise the top {{num_insights}} findings in a {{output_format}} format.",
    label: "Prompt Template",
    variables: [
      {
        name: "data_source",
        description: "Source dataset or document to analyse",
      },
      {
        name: "num_insights",
        description: "Number of key insights to extract",
      },
      {
        name: "output_format",
        description: "Response format: JSON, markdown, or plain text",
      },
    ],
    estimatedTokens: 32,
    onVariableInsert: () => {},
  },
  parameters: {
    docs: {
      description: {
        story:
          "Template mode — variable chips are rendered below the editor. Clicking a chip calls `onVariableInsert(name)`. Use this to insert `{{variable}}` placeholders at the cursor position.",
      },
      source: {
        code: `<PromptEditor
  value={prompt}
  label="Prompt Template"
  variables={[
    { name: "data_source",   description: "Source dataset or document" },
    { name: "num_insights",  description: "Number of key insights to extract" },
    { name: "output_format", description: "Response format: JSON, markdown, or plain text" },
  ]}
  estimatedTokens={tokenCount}
  onChange={setPrompt}
  onVariableInsert={(name) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart, selectionEnd } = textarea;
    const next = prompt.slice(0, selectionStart) + "{{" + name + "}}" + prompt.slice(selectionEnd);
    setPrompt(next);
  }}
/>`,
      },
    },
  },
};

export const WithLineNumbers: Story = {
  args: {
    label: "System Prompt",
    showLineNumbers: true,
    minHeight: 140,
    rows: 8,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `showLineNumbers` to display a line number gutter on the left. Use `rows` to set the initial height, and `minHeight` / `maxHeight` for finer control.",
      },
      source: {
        code: `<PromptEditor
  value={prompt}
  label="System Prompt"
  showLineNumbers
  rows={8}
  minHeight={140}
  maxHeight={400}
  onChange={setPrompt}
/>`,
      },
    },
  },
};

export const WithSaveAndFormat: Story = {
  args: {
    label: "System Prompt",
    onSave: () => {},
    onFormat: () => {},
    saveLabel: "Save version",
    formatLabel: "Auto-format",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Provide `onSave` and/or `onFormat` to show action buttons in the toolbar. Labels are customisable via `saveLabel` and `formatLabel`.",
      },
      source: {
        code: `<PromptEditor
  value={prompt}
  label="System Prompt"
  onSave={(text) => savePromptVersion(text)}
  onFormat={(text) => formatAndSetPrompt(text)}
  saveLabel="Save version"
  formatLabel="Auto-format"
  onChange={setPrompt}
/>`,
      },
    },
  },
};

export const NearTokenLimit: Story = {
  args: {
    label: "System Prompt",
    estimatedTokens: 3_900,
    maxTokens: 4_096,
    value: SAMPLE_PROMPT + "\n\n// Additional instructions...",
  },
  parameters: {
    docs: {
      description: {
        story:
          "When `estimatedTokens` exceeds 90% of `maxTokens`, the counter turns amber to warn the author that the prompt is approaching the model's context limit.",
      },
    },
  },
};

export const ReadOnly: Story = {
  args: { readOnly: true, label: "Active Prompt (read-only)" },
  parameters: {
    docs: {
      description: {
        story:
          "Pass `readOnly` to display the prompt without allowing edits — the textarea is non-interactive.",
      },
    },
  },
};

export const WithFooterSlot: Story = {
  args: {
    label: "System Prompt",
    onSave: () => {},
    footerSlot: (
      <div
        style={{
          marginTop: 8,
          padding: "8px 10px",
          background: "#f8fafc",
          borderRadius: 6,
          fontSize: 11,
          color: "#64748b",
          border: "1px solid #e2e8f0",
        }}
      >
        ℹ️ Changes will take effect on the next agent run.
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Use `footerSlot` to inject additional content below the editor — for help text, save status, or validation messages.",
      },
      source: {
        code: `<PromptEditor
  value={prompt}
  label="System Prompt"
  onSave={(text) => savePromptVersion(text)}
  onChange={setPrompt}
  footerSlot={
    <p style={{ fontSize: 11, color: "#64748b" }}>
      Changes will take effect on the next agent run.
    </p>
  }
/>`,
      },
    },
  },
};

export const Themed: Story = {
  args: {
    theme: { primary: "#7c3aed", border: "#ddd6fe", background: "#fafafa" },
  },
  parameters: {
    docs: {
      description: {
        story: "Per-component colour override via the `theme` prop.",
      },
    },
  },
};

// ─── ContentPreview showcase ──────────────────────────────────────────────────

export const ContentPreviewShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        maxWidth: 600,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Text format — full action bar
        </p>
        <ContentPreview
          title="Generated Executive Summary"
          content="Q3 2025 revenue reached $4.2M, representing 23% year-over-year growth. The enterprise segment was the primary driver, contributing 61% of total revenue. Customer retention improved to 97.2%, the highest recorded level. Key wins include three Fortune 500 expansions and entry into the APAC market."
          format="text"
          wordCount={52}
          readingTimeMin={1}
          qualityScore={88}
          qualityLabel="Quality score"
          onCopy={() => {}}
          onEdit={() => {}}
          onExport={() => {}}
          editLabel="Edit"
          copyLabel="Copy"
          exportLabel="Export .txt"
          copyFeedbackLabel="Copied!"
          copyFeedbackDuration={2000}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Markdown format — renderContent with inline parser
        </p>
        <ContentPreview
          title="Product Description Draft"
          content={`# FlyUI Component Library\n\nA modern, accessible React component library designed for AI-powered enterprise applications.\n\n## Features\n- 30+ production-ready components\n- Automatic dark mode\n- Full keyboard navigation`}
          format="markdown"
          wordCount={38}
          readingTimeMin={1}
          qualityScore={92}
          onCopy={() => {}}
          renderContent={(content) => renderMarkdown(content)}
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Low quality score + custom format label
        </p>
        <ContentPreview
          content="Short draft."
          format="text"
          qualityScore={34}
          qualityLabel="Score"
          formatLabel="Plain text"
          onCopy={() => {}}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`ContentPreview\` — renders AI-generated text with a metadata toolbar.

**Key features:**
- \`format\` label (\`"text"\`, \`"markdown"\`, \`"html"\`) is shown in the toolbar as a badge; override with \`formatLabel\`
- \`wordCount\` and \`readingTimeMin\` are shown as metadata chips
- \`qualityScore\` (0–100) renders a colour-coded pill: green ≥ 80, amber ≥ 60, red below 60; \`qualityLabel\` overrides "Quality"
- \`onCopy(content)\` shows a Copy button; \`copyLabel\` overrides the label; \`copyFeedbackLabel\` shows briefly after copy (set \`null\` to disable)
- \`onEdit()\` shows an Edit button (\`editLabel\` overrides the label)
- \`onExport()\` shows an Export button (\`exportLabel\` overrides the label)
- \`renderContent(content, format)\` fully replaces the content area — use for real markdown rendering
- \`toolbarSlot\` injects custom content in the toolbar
        `,
      },
      source: {
        code: `// Text format with all actions
<ContentPreview
  title="Generated Executive Summary"
  content="Q3 2025 revenue reached $4.2M..."
  format="text"
  wordCount={52}
  readingTimeMin={1}
  qualityScore={88}
  qualityLabel="Quality score"
  onCopy={(content) => navigator.clipboard.writeText(content)}
  onEdit={() => openEditor()}
  onExport={() => downloadFile(content, "summary.txt")}
  editLabel="Edit"
  copyLabel="Copy"
  exportLabel="Export .txt"
  copyFeedbackLabel="Copied!"
  copyFeedbackDuration={2000}
/>

// Markdown with custom content renderer
<ContentPreview
  title="Product Description"
  content={markdownContent}
  format="markdown"
  renderContent={(content) => <ReactMarkdown>{content}</ReactMarkdown>}
  onCopy={(content) => navigator.clipboard.writeText(content)}
/>

// No copy feedback
<ContentPreview
  content={text}
  onCopy={(content) => navigator.clipboard.writeText(content)}
  copyFeedbackLabel={null}
/>`,
      },
    },
  },
};

// ─── VariantComparison showcase ───────────────────────────────────────────────

export const VariantComparisonShowcase: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        maxWidth: 720,
      }}
    >
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          3 variants — Variant B pre-selected
        </p>
        <VariantComparison
          variants={[
            {
              id: "v1",
              label: "Variant A — Formal",
              content:
                "Our Q3 financial results demonstrate robust growth across all business segments, with total revenue increasing 23% year-over-year to $4.2 million.",
              score: 74,
              tags: ["formal", "concise"],
              meta: "GPT-4o · 82 tokens",
            },
            {
              id: "v2",
              label: "Variant B — Conversational",
              content:
                "Great news: Q3 was our best quarter yet! Revenue hit $4.2M — that's 23% more than last year — and every part of the business grew.",
              score: 82,
              tags: ["conversational", "engaging"],
              meta: "claude-opus-4 · 78 tokens",
            },
            {
              id: "v3",
              label: "Variant C — Data-first",
              content:
                "Q3 2025: $4.2M revenue (+23% YoY). Enterprise: 61% share. Retention: 97.2%. APAC expansion: complete.",
              score: 68,
              tags: ["data-dense", "brief"],
              meta: "claude-haiku-4-5 · 42 tokens",
            },
          ]}
          selectedId="v2"
          onSelect={() => {}}
          onCopy={() => {}}
          onScoreClick={() => {}}
          selectLabel="Use this"
          selectedLabel="Selected ✓"
          copyLabel="Copy"
          copyFeedbackLabel="Copied!"
        />
      </div>
      <div>
        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
          Empty state with custom message
        </p>
        <VariantComparison
          variants={[]}
          onSelect={() => {}}
          emptyText="No variants generated yet. Run the workflow to generate variants."
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
\`VariantComparison\` — side-by-side grid for comparing AI-generated content variants.

**Key features:**
- Cards are arranged in a responsive auto-grid (min 260px wide per card)
- \`selectedId\` highlights the chosen variant; click the select button to change it (\`onSelect(id, variant)\`)
- \`selectLabel\` / \`selectedLabel\` override the Select / Selected button text
- \`onCopy(content, id, variant)\` shows a Copy button per card; \`copyLabel\` overrides the label
- \`copyFeedbackLabel\` / \`copyFeedbackDuration\` control the post-copy confirmation (set \`null\` to disable)
- \`onScoreClick(id, variant)\` makes the quality score badge clickable (e.g. to show scoring details)
- \`meta\` per variant shows a subtitle below the label (e.g. model name + token count)
- \`tags\` per variant renders small chips below the content
- \`emptyText\` / \`renderEmpty()\` shown when \`variants\` is empty
- \`renderContent(variant, isSelected)\` fully replaces the card content area
- \`cardFooterSlot(variant)\` injects custom content at the bottom of each card
        `,
      },
      source: {
        code: `<VariantComparison
  variants={[
    { id: "v1", label: "Variant A — Formal",         content: "Our Q3 financial results...", score: 74, tags: ["formal", "concise"],         meta: "GPT-4o · 82 tokens" },
    { id: "v2", label: "Variant B — Conversational", content: "Great news: Q3 was our best...", score: 82, tags: ["conversational", "engaging"], meta: "claude-opus-4 · 78 tokens" },
    { id: "v3", label: "Variant C — Data-first",     content: "Q3 2025: $4.2M...",           score: 68, tags: ["data-dense", "brief"],        meta: "claude-haiku-4-5 · 42 tokens" },
  ]}
  selectedId={selectedVariantId}
  onSelect={(id, variant) => setSelectedVariantId(id)}
  onCopy={(content, id) => navigator.clipboard.writeText(content)}
  onScoreClick={(id, variant) => openScoreBreakdown(id)}
  selectLabel="Use this"
  selectedLabel="Selected ✓"
  copyFeedbackLabel="Copied!"
  emptyText="No variants generated yet."
/>

// Custom card footer slot (e.g. show model info per card)
<VariantComparison
  variants={variants}
  onSelect={setSelectedId}
  cardFooterSlot={(variant) => (
    <span style={{ fontSize: 11, color: "#64748b" }}>{variant.meta}</span>
  )}
/>`,
      },
    },
  },
};
