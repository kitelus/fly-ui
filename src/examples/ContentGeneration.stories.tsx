import type { Meta, StoryObj } from "@storybook/react-vite";

import { ContentPreview } from "../components/agent/content/ContentPreview";
import { PromptEditor } from "../components/agent/content/PromptEditor";
import { VariantComparison } from "../components/agent/content/VariantComparison";
import { TokenUsageCard } from "../components/agent/observability/TokenUsageCard";

// ─── App shell ─────────────────────────────────────────────────────────────────

const APP: React.CSSProperties = {
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  display: "grid",
  gridTemplateRows: "48px 48px 1fr",
  gridTemplateColumns: "1fr",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const TOPBAR: React.CSSProperties = { background: "#0f172a", display: "flex", alignItems: "center", padding: "0 20px", gap: 16 };
const TOPBAR_LOGO: React.CSSProperties = { color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", marginRight: 24 };
const TOPBAR_SPACER: React.CSSProperties = { flex: 1 };
const TOPBAR_AVATAR: React.CSSProperties = { width: 28, height: 28, borderRadius: "50%", background: "#8b5cf6", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const T_NAV = (a: boolean): React.CSSProperties => ({ color: a ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: a ? 600 : 400, padding: "4px 10px", borderRadius: 6, background: a ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer" });

const SUBBAR: React.CSSProperties = {
  background: "#ffffff",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  alignItems: "center",
  padding: "0 28px",
  gap: 12,
};

const SUBBAR_TITLE: React.CSSProperties = { fontSize: 14, fontWeight: 600, color: "#0f172a" };
const SUBBAR_SEP: React.CSSProperties = { color: "#cbd5e1", fontSize: 14 };
const SUBBAR_CRUMB: React.CSSProperties = { fontSize: 13, color: "#64748b" };
const SUBBAR_SPACER: React.CSSProperties = { flex: 1 };

const STATUS_PILL = (color: string, bg: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: bg, color: color, border: `1px solid ${color}30` });

const WORKSPACE: React.CSSProperties = { display: "grid", gridTemplateColumns: "380px 1fr", overflow: "hidden" };
const LEFT_PANEL: React.CSSProperties = { borderRight: "1px solid #e2e8f0", background: "#ffffff", display: "flex", flexDirection: "column", overflow: "hidden" };
const PANEL_HEADER: React.CSSProperties = { padding: "12px 16px 10px", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", alignItems: "center", gap: 8 };
const PANEL_TITLE: React.CSSProperties = { fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase" as const, letterSpacing: "0.06em", flex: 1 };
const PANEL_BODY: React.CSSProperties = { flex: 1, overflow: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 14 };
const RIGHT_PANEL: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden", background: "#f8fafc" };
const RIGHT_HEADER: React.CSSProperties = { padding: "12px 20px 10px", borderBottom: "1px solid #e2e8f0", background: "#ffffff", display: "flex", alignItems: "center", gap: 8 };
const RIGHT_BODY: React.CSSProperties = { flex: 1, overflow: "auto", padding: 20, display: "flex", flexDirection: "column", gap: 16 };

// ─── Sample data ───────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a professional B2B copywriter specialising in SaaS products. Write a compelling product description for {{product_name}} targeting {{audience}}.

The copy should:
- Open with the core value proposition in the first sentence
- Highlight 3 key differentiators using concrete metrics
- Close with a clear call to action
- Tone: {{tone}}
- Maximum length: {{max_words}} words`;

const VARIABLES = [
  { name: "product_name", description: "Product or feature name" },
  { name: "audience", description: "Target persona (e.g. CTOs, marketers)" },
  { name: "tone", description: "professional | conversational | bold" },
  { name: "max_words", description: "Maximum output word count" },
];

const VARIANTS = [
  {
    id: "v1",
    label: "Variant A — Value-led",
    content: "FlyUI cuts AI product development time in half. Built for teams shipping LLM-powered applications, it provides 30+ production-ready components — chat interfaces, agent dashboards, approval flows — that compose seamlessly with your stack. Ship your first AI feature in a day, not a sprint.",
    score: 82,
    tags: ["concise", "metric-driven"],
  },
  {
    id: "v2",
    label: "Variant B — Problem-led",
    content: "Building AI product UI from scratch is slow and inconsistent. FlyUI solves this with a complete React component library designed specifically for AI agent applications. From streaming chat bubbles to human-in-the-loop approval flows, every component is accessible, fully themeable, and production-ready.",
    score: 76,
    tags: ["empathetic", "feature-rich"],
  },
  {
    id: "v3",
    label: "Variant C — Bold",
    content: "Your AI is smart. Your UI shouldn't hold it back. FlyUI is the design system built for the age of agents — 30+ components for chat, observability, approvals, and data pipelines. TypeScript-first. Accessible. Ships in minutes.",
    score: 89,
    tags: ["bold", "memorable"],
  },
];

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Content Generation",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## AI Content Generation Workspace — Full Application Screen

A split-panel content studio. The left panel holds the prompt template and token budget; the right panel shows the generated variants and final selected content. Covers the full content generation cycle: engineer a template prompt, monitor token cost, compare AI variants, select the best, and preview it formatted.

**Scenario**: A B2B marketing team uses this workspace to generate product copy variations with Claude. A copywriter writes a reusable template with \`{{variables}}\`, triggers generation, compares variants by quality score, and exports the winner.

### Components used

| Component | Role |
|---|---|
| \`PromptEditor\` | Template editor with variable chips, token counter, and read-only mode |
| \`TokenUsageCard\` | Real-time token budget — input/output split, cost estimate, context-window bar |
| \`VariantComparison\` | Side-by-side AI output cards with quality scores and Select button |
| \`ContentPreview\` | Rendered output — word count, reading time, quality score, Copy/Edit actions |

### Best practices demonstrated

- Left panel is fixed-width (380px) — the prompt stays compact and the author stays focused on it
- Variable chips insert \`{{placeholder}}\` at cursor — safe templating without string concatenation
- Token card sits directly below the editor — cost is visible as the prompt grows
- \`VariantComparison\` appears before \`ContentPreview\` — avoids anchoring bias from the first result
- \`ContentPreview\` only appears after a variant is selected, reducing visual noise
- Token counter turns amber when approaching the context limit
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const ComparingVariants: Story = {
  render: () => (
    <div style={APP}>
      <div style={TOPBAR}>
        <span style={TOPBAR_LOGO}>✎ CopyStudio</span>
        {["Workspace", "Templates", "History", "Brand Kit"].map((l) => (
          <span key={l} style={T_NAV(l === "Workspace")}>{l}</span>
        ))}
        <div style={TOPBAR_SPACER} />
        <span style={{ color: "#64748b", fontSize: 12 }}>FlyUI — Product Description</span>
        <div style={TOPBAR_AVATAR}>SP</div>
      </div>
      <div style={SUBBAR}>
        <span style={SUBBAR_CRUMB}>Templates</span>
        <span style={SUBBAR_SEP}>›</span>
        <span style={SUBBAR_TITLE}>B2B SaaS Product Description</span>
        <span style={SUBBAR_SEP}>·</span>
        <span style={SUBBAR_CRUMB}>3 variants generated</span>
        <div style={SUBBAR_SPACER} />
        <span style={STATUS_PILL("#f59e0b", "#f59e0b15")}>Comparing</span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>claude-opus-4 · 128 tokens</span>
      </div>
      <div style={WORKSPACE}>
        <div style={LEFT_PANEL}>
          <div style={PANEL_HEADER}>
            <span style={PANEL_TITLE}>Prompt Template</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>4 variables</span>
          </div>
          <div style={PANEL_BODY}>
            <PromptEditor
              label="System Prompt"
              value={SYSTEM_PROMPT}
              estimatedTokens={128}
              maxTokens={4_096}
              variables={VARIABLES}
              onChange={() => {}}
              onVariableInsert={() => {}}
            />
            <TokenUsageCard
              modelName="claude-opus-4"
              inputTokens={2_840}
              outputTokens={1_260}
              costUsd={0.0032}
              maxTokens={4_096}
            />
          </div>
        </div>
        <div style={RIGHT_PANEL}>
          <div style={RIGHT_HEADER}>
            <span style={PANEL_TITLE}>Generated Variants</span>
            <div style={SUBBAR_SPACER} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Select a variant to preview and export</span>
          </div>
          <div style={RIGHT_BODY}>
            <VariantComparison variants={VARIANTS} onSelect={() => {}} onCopy={() => {}} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Three variants generated, none selected yet. The copywriter is comparing quality scores and reading each card before committing. Variant C has the highest score (89) — bold tone.",
      },
      source: {
        code: `import { PromptEditor, TokenUsageCard, VariantComparison } from "@kitelus/fly-ui";

<PromptEditor
  label="System Prompt"
  value={promptText}
  estimatedTokens={estimatedTokens}
  maxTokens={4096}
  variables={templateVars}
  onChange={setPromptText}
  onVariableInsert={(name) => insertAtCursor(\`{{\${name}}}\`)}
/>
<TokenUsageCard modelName="claude-opus-4" inputTokens={inputTokens} outputTokens={outputTokens} costUsd={cost} />
<VariantComparison
  variants={generatedVariants}
  selectedId={selectedId}
  onSelect={setSelectedId}
  onCopy={(content) => navigator.clipboard.writeText(content)}
/>`,
      },
    },
  },
};

export const VariantSelected: Story = {
  render: () => (
    <div style={APP}>
      <div style={TOPBAR}>
        <span style={TOPBAR_LOGO}>✎ CopyStudio</span>
        {["Workspace", "Templates", "History", "Brand Kit"].map((l) => (
          <span key={l} style={T_NAV(l === "Workspace")}>{l}</span>
        ))}
        <div style={TOPBAR_SPACER} />
        <span style={{ color: "#64748b", fontSize: 12 }}>FlyUI — Product Description</span>
        <div style={TOPBAR_AVATAR}>SP</div>
      </div>
      <div style={SUBBAR}>
        <span style={SUBBAR_CRUMB}>Templates</span>
        <span style={SUBBAR_SEP}>›</span>
        <span style={SUBBAR_TITLE}>B2B SaaS Product Description</span>
        <span style={SUBBAR_SEP}>·</span>
        <span style={SUBBAR_CRUMB}>Variant C selected</span>
        <div style={SUBBAR_SPACER} />
        <span style={STATUS_PILL("#10b981", "#10b98115")}>✓ Selected</span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>Score 89 · 52 words</span>
      </div>
      <div style={WORKSPACE}>
        <div style={LEFT_PANEL}>
          <div style={PANEL_HEADER}>
            <span style={PANEL_TITLE}>Prompt Template</span>
            <span style={{ fontSize: 11, color: "#94a3b8" }}>4 variables</span>
          </div>
          <div style={PANEL_BODY}>
            <PromptEditor
              label="System Prompt"
              value={SYSTEM_PROMPT}
              estimatedTokens={128}
              maxTokens={4_096}
              variables={VARIABLES}
              onChange={() => {}}
              onVariableInsert={() => {}}
            />
            <TokenUsageCard
              modelName="claude-opus-4"
              inputTokens={2_840}
              outputTokens={1_260}
              costUsd={0.0032}
              maxTokens={4_096}
            />
          </div>
        </div>
        <div style={RIGHT_PANEL}>
          <div style={RIGHT_HEADER}>
            <span style={PANEL_TITLE}>Generated Variants</span>
            <div style={SUBBAR_SPACER} />
            <span style={STATUS_PILL("#10b981", "#10b98115")}>✓ Variant C selected</span>
          </div>
          <div style={RIGHT_BODY}>
            <VariantComparison variants={VARIANTS} selectedId="v3" onSelect={() => {}} onCopy={() => {}} />
            <ContentPreview
              title="Selected: Variant C — Bold"
              content={VARIANTS[2].content}
              format="text"
              wordCount={52}
              readingTimeMin={1}
              qualityScore={89}
              onCopy={() => {}}
              onEdit={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Variant C selected (highlighted in the grid). ContentPreview appears below with word count, reading time, quality score, and Copy/Edit action buttons. The breadcrumb in the subbar updates to reflect the selection.",
      },
      source: {
        code: `// Only render ContentPreview once a variant is selected
{selectedId && (
  <ContentPreview
    title="Selected variant"
    content={selectedVariant.content}
    format="text"
    qualityScore={selectedVariant.score}
    onCopy={(text) => navigator.clipboard.writeText(text)}
    onEdit={() => openEditor(selectedId)}
  />
)}`,
      },
    },
  },
};

export const AtTokenLimit: Story = {
  render: () => (
    <div style={APP}>
      <div style={TOPBAR}>
        <span style={TOPBAR_LOGO}>✎ CopyStudio</span>
        {["Workspace", "Templates", "History", "Brand Kit"].map((l) => (
          <span key={l} style={T_NAV(l === "Workspace")}>{l}</span>
        ))}
        <div style={TOPBAR_SPACER} />
        <span style={{ color: "#64748b", fontSize: 12 }}>FlyUI — Product Description</span>
        <div style={TOPBAR_AVATAR}>SP</div>
      </div>
      <div style={SUBBAR}>
        <span style={SUBBAR_CRUMB}>Templates</span>
        <span style={SUBBAR_SEP}>›</span>
        <span style={SUBBAR_TITLE}>B2B SaaS Product Description</span>
        <span style={SUBBAR_SEP}>·</span>
        <span style={SUBBAR_CRUMB}>Variant C selected</span>
        <div style={SUBBAR_SPACER} />
        <span style={STATUS_PILL("#f59e0b", "#f59e0b15")}>⚠ Near token limit</span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>3 820 / 4 096 tokens</span>
      </div>
      <div style={WORKSPACE}>
        <div style={LEFT_PANEL}>
          <div style={PANEL_HEADER}>
            <span style={PANEL_TITLE}>Prompt Template</span>
            <span style={{ fontSize: 11, color: "#f59e0b", fontWeight: 600 }}>93% of limit</span>
          </div>
          <div style={PANEL_BODY}>
            <PromptEditor
              label="System Prompt"
              value={
                SYSTEM_PROMPT +
                "\n\n// Brand guidelines:\n// Always mention the 30-day free trial.\n// Avoid competitor names.\n// Include social proof when available.\n// Use Oxford comma throughout.\n// Preferred CTA: 'Start building for free'"
              }
              estimatedTokens={3_820}
              maxTokens={4_096}
              variables={VARIABLES}
              onChange={() => {}}
              onVariableInsert={() => {}}
            />
            <TokenUsageCard
              modelName="claude-opus-4"
              inputTokens={3_820}
              outputTokens={890}
              costUsd={0.0038}
              maxTokens={4_096}
            />
          </div>
        </div>
        <div style={RIGHT_PANEL}>
          <div style={RIGHT_HEADER}>
            <span style={PANEL_TITLE}>Generated Variants</span>
            <div style={SUBBAR_SPACER} />
            <span style={{ fontSize: 12, color: "#94a3b8" }}>Trim the prompt or switch to a larger-context model</span>
          </div>
          <div style={RIGHT_BODY}>
            <VariantComparison variants={VARIANTS} selectedId="v3" onSelect={() => {}} onCopy={() => {}} />
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Prompt grown to 3 820 tokens — 93% of the 4 096-token limit. The PromptEditor token counter turns amber. The TokenUsageCard context-window bar shows the warning state. Time to trim the brand guidelines or switch to a larger-context model.",
      },
    },
  },
};
