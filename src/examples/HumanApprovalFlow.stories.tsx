import type { Meta, StoryObj } from "@storybook/react-vite";

import { ApprovalCard } from "../components/agent/approval/ApprovalCard";
import { AuditLog } from "../components/agent/approval/AuditLog";
import { ConfidenceScore } from "../components/agent/approval/ConfidenceScore";
import { DiffViewer } from "../components/agent/approval/DiffViewer";
import { MultiStageApproval } from "../components/agent/approval/MultiStageApproval";

// ─── App shell ─────────────────────────────────────────────────────────────────

const APP: React.CSSProperties = {
  fontFamily: '"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif',
  display: "grid",
  gridTemplateRows: "48px 1fr",
  gridTemplateColumns: "220px 1fr",
  minHeight: "100vh",
  background: "#f1f5f9",
};

const TOPBAR: React.CSSProperties = { gridColumn: "1 / -1", background: "#0f172a", display: "flex", alignItems: "center", padding: "0 20px", gap: 16 };
const TOPBAR_LOGO: React.CSSProperties = { color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em", marginRight: 24 };
const TOPBAR_SPACER: React.CSSProperties = { flex: 1 };
const TOPBAR_AVATAR: React.CSSProperties = { width: 28, height: 28, borderRadius: "50%", background: "#f59e0b", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" };
const T_NAV = (a: boolean): React.CSSProperties => ({ color: a ? "#fff" : "#94a3b8", fontSize: 13, fontWeight: a ? 600 : 400, padding: "4px 10px", borderRadius: 6, background: a ? "rgba(255,255,255,0.08)" : "transparent", cursor: "pointer" });

const LEFT_NAV: React.CSSProperties = { background: "#1e293b", color: "#cbd5e1", display: "flex", flexDirection: "column", padding: "16px 12px", gap: 2, overflowY: "auto" };
const SECTION_LABEL: React.CSSProperties = { fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "#475569", padding: "12px 8px 4px" };
const S_ITEM = (a: boolean): React.CSSProperties => ({ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 6, fontSize: 13, fontWeight: a ? 600 : 400, color: a ? "#fff" : "#94a3b8", background: a ? "rgba(245,158,11,0.25)" : "transparent", cursor: "pointer" });

const MAIN: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden" };

const PAGE_HEADER: React.CSSProperties = { padding: "16px 28px 14px", background: "#ffffff", borderBottom: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 16 };
const BREADCRUMB: React.CSSProperties = { fontSize: 12, color: "#64748b", display: "flex", alignItems: "center", gap: 6, marginBottom: 4 };
const PAGE_TITLE: React.CSSProperties = { fontSize: 18, fontWeight: 700, color: "#0f172a", margin: 0 };
const PAGE_META: React.CSSProperties = { fontSize: 13, color: "#64748b", margin: "2px 0 0" };
const STATUS_PILL = (color: string, bg: string): React.CSSProperties => ({ fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99, background: bg, color: color, border: `1px solid ${color}30` });

const CONTENT: React.CSSProperties = { flex: 1, overflow: "auto", padding: "20px 28px", display: "flex", flexDirection: "column", gap: 16 };
const TOP_GRID: React.CSSProperties = { display: "grid", gridTemplateColumns: "1fr 400px", gap: 16, alignItems: "start" };
const LEFT: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };
const RIGHT: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 14 };

const BEFORE = `You are a customer support agent.
Answer customer questions politely and concisely.
Escalate complex issues to a human agent.
Do not offer refunds without manager approval.`;

const AFTER = `You are a senior customer support agent with authority to resolve billing disputes.
Answer customer questions politely and concisely.
You may approve refunds up to $500 without manager approval.
Escalate issues above $500 or involving legal threats to a human agent.
Always confirm resolution with the customer before closing a ticket.`;

function TopBar({ statusLabel, statusColor }: { statusLabel: string; statusColor: string }) {
  return (
    <div style={TOPBAR}>
      <span style={TOPBAR_LOGO}>⚖ ReviewHub</span>
      {["Pending", "Approved", "Rejected", "Audit Trail"].map((l) => (
        <span key={l} style={T_NAV(l === "Pending")}>{l}</span>
      ))}
      <div style={TOPBAR_SPACER} />
      <span style={{ ...STATUS_PILL(statusColor, `${statusColor}18`) }}>{statusLabel}</span>
      <div style={TOPBAR_AVATAR}>JP</div>
    </div>
  );
}

function LeftNav({ active }: { active: string }) {
  return (
    <div style={LEFT_NAV}>
      <div style={SECTION_LABEL}>Review Queue</div>
      {[
        { icon: "🕐", label: "Pending Review", count: "3" },
        { icon: "✅", label: "Approved" },
        { icon: "✕", label: "Rejected" },
      ].map(({ icon, label, count }) => (
        <div key={label} style={{ ...S_ITEM(label === active), justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span>{icon}</span><span>{label}</span>
          </div>
          {count && <span style={{ fontSize: 11, background: "#f59e0b", color: "#fff", borderRadius: 99, padding: "1px 6px", fontWeight: 700 }}>{count}</span>}
        </div>
      ))}
      <div style={SECTION_LABEL}>Filters</div>
      {[{ icon: "🤖", label: "Agent Changes" }, { icon: "📤", label: "Bulk Actions" }, { icon: "💰", label: "Financial" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(false)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
      <div style={SECTION_LABEL}>Settings</div>
      {[{ icon: "👥", label: "Approvers" }, { icon: "🔔", label: "Notifications" }].map(({ icon, label }) => (
        <div key={label} style={S_ITEM(false)}>
          <span>{icon}</span><span>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Meta ──────────────────────────────────────────────────────────────────────

const meta = {
  title: "Examples/Human Approval Flow",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component: `
## Human-in-the-Loop Approval Flow — Full Application Screen

A complete review platform screen. The ReviewHub application surfaces AI agent actions that require human sign-off before execution. Reviewers see the agent's confidence score, a before/after diff of the proposed change, the approval card, a multi-reviewer pipeline, and a full audit log — all in one screen.

**Scenario**: A support optimisation agent has analysed 30 days of tickets and proposes updating the system prompt to grant refund authority up to $500. Because this is a permission elevation, it requires review from Product and Legal before the change goes live.

### Components used

| Component | Role |
|---|---|
| \`ConfidenceScore\` | How certain the agent is — low scores automatically trigger a review request |
| \`DiffViewer\` | Exact before/after diff of the proposed prompt change |
| \`ApprovalCard\` | Primary review UI — context, action description, comment box, Approve/Reject |
| \`MultiStageApproval\` | Multi-reviewer pipeline — Product first, then Legal |
| \`AuditLog\` | Immutable timeline of every event in the approval lifecycle |

### Best practices demonstrated

- \`ConfidenceScore\` is shown first — a low score signals that the reviewer should scrutinise the diff carefully
- \`DiffViewer\` makes the exact change visible without requiring the reviewer to hold full context
- Left column (confidence + diff) gives the *why*; right column (approval + pipeline) gives the *action*
- \`AuditLog\` is always visible at the bottom — every decision is traceable, not just the final outcome
- \`MultiStageApproval\` enforces sequential sign-off — Legal only sees the request after Product approves
        `,
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Stories ───────────────────────────────────────────────────────────────────

export const PendingReview: Story = {
  render: () => (
    <div style={APP}>
      <TopBar statusLabel="● 3 Pending" statusColor="#f59e0b" />
      <LeftNav active="Pending Review" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Pending Review</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>req_support_agent_20250111</span>
            </div>
            <p style={PAGE_TITLE}>Elevate support agent permissions</p>
            <p style={PAGE_META}>Requested by Support Optimisation Agent · 11:02 AM · Expires 12:02 PM</p>
          </div>
          <span style={STATUS_PILL("#f59e0b", "#f59e0b15")}>🕐 Awaiting Product Review</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Confidence: 62%</span>
        </div>
        <div style={CONTENT}>
          <div style={TOP_GRID}>
            <div style={LEFT}>
              <ConfidenceScore
                score={62}
                label="Change confidence"
                reason="Permission elevation (refund authority) is a significant behavioural change. Human review recommended before deploying."
                threshold={80}
                onRequestVerification={() => {}}
              />
              <DiffViewer
                beforeLabel="Current system prompt (v4)"
                afterLabel="Proposed system prompt (v5)"
                before={BEFORE}
                after={AFTER}
              />
            </div>
            <div style={RIGHT}>
              <ApprovalCard
                title="Elevate support agent permissions"
                description="The AI agent proposes updating the system prompt to grant refund authority up to $500 — removing the current 'no refunds without manager approval' constraint."
                actionDescription="Replace system prompt v4 with v5 in the production environment."
                requesterName="Support Optimisation Agent"
                requestedAt="11:02 AM"
                expiresAt="12:02 PM"
                status="pending"
                onApprove={() => {}}
                onReject={() => {}}
              />
              <MultiStageApproval
                title="Approval Pipeline"
                stages={[
                  { id: "s1", name: "Product Review", status: "in_progress", requiredCount: 1, dueAt: "Today 11:30", approvers: [{ id: "a1", name: "Sarah Park", status: "pending" }] },
                  { id: "s2", name: "Legal Sign-off", status: "pending", requiredCount: 1, approvers: [{ id: "a2", name: "James Liu", status: "pending" }] },
                ]}
              />
            </div>
          </div>
          <AuditLog
            entries={[
              { id: "e1", action: "created", actor: "Support Optimisation Agent", timestamp: "11:02 AM", details: "Approval request created. Reason: refund authority elevation based on 30-day ticket analysis. 1 842 tickets reviewed." },
              { id: "e2", action: "commented", actor: "Sarah Park", timestamp: "11:04 AM", details: "Reviewing the diff. Will confirm the $500 threshold with legal before approving." },
            ]}
            onExport={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Initial review state. Confidence score 62% (below 80% threshold) automatically triggered a review request. The diff shows the permission change clearly. Sarah Park from Product is reviewing — she has left a comment indicating she will check with Legal.",
      },
      source: {
        code: `import { ConfidenceScore, DiffViewer, ApprovalCard, MultiStageApproval, AuditLog } from "@kitelus/fly-ui";

<ConfidenceScore score={62} threshold={80} onRequestVerification={flagForReview} />
<DiffViewer beforeLabel="v4 (current)" afterLabel="v5 (proposed)" before={currentPrompt} after={proposedPrompt} />
<ApprovalCard
  title="Elevate support agent permissions"
  actionDescription="Deploy v5 system prompt to production"
  status="pending"
  onApprove={(comment) => approve(requestId, comment)}
  onReject={(comment) => reject(requestId, comment)}
/>
<MultiStageApproval stages={approvalStages} />
<AuditLog entries={auditEntries} onExport={exportCsv} />`,
      },
    },
  },
};

export const ApprovedWithComment: Story = {
  render: () => (
    <div style={APP}>
      <TopBar statusLabel="✓ Approved · Deployed" statusColor="#10b981" />
      <LeftNav active="Approved" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Approved</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>req_support_agent_20250111</span>
            </div>
            <p style={PAGE_TITLE}>Elevate support agent permissions</p>
            <p style={PAGE_META}>Approved by Sarah Park · Deployed to production at 11:18 AM</p>
          </div>
          <span style={STATUS_PILL("#10b981", "#10b98115")}>✓ Approved & Deployed</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>v5 live in EU + US</span>
        </div>
        <div style={CONTENT}>
          <div style={TOP_GRID}>
            <div style={LEFT}>
              <ConfidenceScore
                score={62}
                label="Change confidence"
                reason="Change reviewed and approved by Product and Legal."
                threshold={80}
              />
              <DiffViewer
                beforeLabel="Previous system prompt (v4)"
                afterLabel="Deployed system prompt (v5)"
                before={BEFORE}
                after={AFTER}
              />
            </div>
            <div style={RIGHT}>
              <ApprovalCard
                title="Elevate support agent permissions"
                description="The AI agent proposed updating the system prompt to grant refund authority up to $500."
                actionDescription="Replace system prompt v4 with v5 in the production environment."
                requesterName="Support Optimisation Agent"
                requestedAt="11:02 AM"
                status="approved"
                resolvedBy="Sarah Park"
                resolvedAt="11:18 AM"
                resolvedComment="Legal confirmed $500 is within our standard discretionary limit. Approved and deployed."
              />
              <MultiStageApproval
                title="Approval Pipeline"
                stages={[
                  { id: "s1", name: "Product Review", status: "completed", requiredCount: 1, approvers: [{ id: "a1", name: "Sarah Park", status: "approved", comment: "Within discretionary limit.", decidedAt: "11:15 AM" }] },
                  { id: "s2", name: "Legal Sign-off", status: "completed", requiredCount: 1, approvers: [{ id: "a2", name: "James Liu", status: "approved", comment: "Confirmed OK by compliance team.", decidedAt: "11:18 AM" }] },
                ]}
              />
            </div>
          </div>
          <AuditLog
            entries={[
              { id: "e1", action: "created", actor: "Support Optimisation Agent", timestamp: "11:02 AM", details: "Approval request created. 1 842 tickets reviewed over 30 days." },
              { id: "e2", action: "commented", actor: "Sarah Park", timestamp: "11:04 AM", details: "Reviewing the diff. Confirming $500 threshold with legal." },
              { id: "e3", action: "approved", actor: "Sarah Park", timestamp: "11:15 AM", details: "Stage 1 (Product) approved. $500 is within our standard discretionary limit." },
              { id: "e4", action: "approved", actor: "James Liu", timestamp: "11:18 AM", details: "Stage 2 (Legal) approved. Compliance team confirmed." },
              { id: "e5", action: "modified", actor: "System", timestamp: "11:18 AM", details: "System prompt updated to v5. Deployed to production (EU + US regions). Previous version archived as v4." },
            ]}
            onExport={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Both stages approved and the change deployed. ApprovalCard shows the resolved-approved banner with approver name, timestamp, and comment. AuditLog records the full trail including the automated deployment event.",
      },
    },
  },
};

export const Rejected: Story = {
  render: () => (
    <div style={APP}>
      <TopBar statusLabel="✕ Rejected at Legal" statusColor="#ef4444" />
      <LeftNav active="Rejected" />
      <div style={MAIN}>
        <div style={PAGE_HEADER}>
          <div style={{ flex: 1 }}>
            <div style={BREADCRUMB}>
              <span>Rejected</span><span>›</span>
              <span style={{ color: "#0f172a", fontWeight: 500 }}>req_support_agent_20250111</span>
            </div>
            <p style={PAGE_TITLE}>Elevate support agent permissions</p>
            <p style={PAGE_META}>Rejected by James Liu (Legal) · 11:22 AM · Policy change required before re-submission</p>
          </div>
          <span style={STATUS_PILL("#ef4444", "#ef444415")}>✕ Rejected</span>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Stage 2 of 2</span>
        </div>
        <div style={CONTENT}>
          <div style={TOP_GRID}>
            <div style={LEFT}>
              <ConfidenceScore
                score={62}
                label="Change confidence"
                reason="Change rejected at Legal stage — requires a formal policy amendment before the system prompt can be updated."
                threshold={80}
              />
              <DiffViewer
                beforeLabel="Current system prompt (v4)"
                afterLabel="Proposed system prompt (v5) — REJECTED"
                before={BEFORE}
                after={AFTER}
              />
            </div>
            <div style={RIGHT}>
              <ApprovalCard
                title="Elevate support agent permissions"
                description="The AI agent proposed updating the system prompt to grant refund authority up to $500."
                actionDescription="Replace system prompt v4 with v5 in the production environment."
                requesterName="Support Optimisation Agent"
                requestedAt="11:02 AM"
                status="rejected"
                resolvedBy="James Liu"
                resolvedAt="11:22 AM"
                resolvedComment="Rejected — refund authority changes require a formal Policy Change Request. Please open one in Jira first, get it signed off by Finance, then re-submit."
              />
              <MultiStageApproval
                title="Approval Pipeline"
                stages={[
                  { id: "s1", name: "Product Review", status: "completed", requiredCount: 1, approvers: [{ id: "a1", name: "Sarah Park", status: "approved", decidedAt: "11:15 AM" }] },
                  { id: "s2", name: "Legal Sign-off", status: "rejected", requiredCount: 1, approvers: [{ id: "a2", name: "James Liu", status: "rejected", comment: "Needs formal policy amendment + Finance sign-off first.", decidedAt: "11:22 AM" }] },
                ]}
              />
            </div>
          </div>
          <AuditLog
            entries={[
              { id: "e1", action: "created", actor: "Support Optimisation Agent", timestamp: "11:02 AM", details: "Approval request created. Reason: refund authority elevation." },
              { id: "e2", action: "approved", actor: "Sarah Park", timestamp: "11:15 AM", details: "Stage 1 (Product) approved." },
              { id: "e3", action: "rejected", actor: "James Liu", timestamp: "11:22 AM", details: "Stage 2 (Legal) rejected. Reason: formal policy amendment required before granting refund authority to AI systems. Open a Jira PCR and obtain Finance sign-off before re-submitting." },
            ]}
            onExport={() => {}}
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Rejected at stage 2. ApprovalCard shows the rejected banner with the full rejection reason. MultiStageApproval shows stage 2 in red. AuditLog permanently records the reason so future requests can reference the process requirement.",
      },
    },
  },
};
