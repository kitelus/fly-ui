import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export type ApprovalStageStatus = "pending" | "in_progress" | "completed" | "rejected" | "skipped";

export interface ApprovalApprover {
  id: string;
  name: string;
  avatarText?: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
  decidedAt?: string;
}

export interface ApprovalStage {
  id: string;
  name: string;
  status: ApprovalStageStatus;
  approvers?: ApprovalApprover[];
  dueAt?: string;
  requiredCount?: number;
}

export interface MultiStageApprovalProps extends ComponentPropsWithoutRef<"div"> {
  title?: string;
  stages: ApprovalStage[];
  theme?: KiteTheme;
}

export const MultiStageApproval = forwardRef<HTMLDivElement, MultiStageApprovalProps>(
  function MultiStageApproval({ title, stages, theme, style, ...rest }, ref) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const ICON: Record<ApprovalStageStatus, string> = {
      pending: "○",
      in_progress: "◉",
      completed: "✓",
      rejected: "✗",
      skipped: "—",
    };

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-multiStage"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {title && <p className="kite-flyui-agentStatusCard__name" style={{ marginBottom: 14 }}>{title}</p>}
        <div className="kite-flyui-multiStage__stages">
          {stages.map((stage) => (
            <div key={stage.id} className="kite-flyui-multiStage__stage">
              <div
                className={`kite-flyui-multiStage__stageIcon kite-flyui-multiStage__stageIcon--${stage.status}`}
                aria-label={`Stage ${stage.name}: ${stage.status}`}
              >
                {ICON[stage.status]}
              </div>
              <div className="kite-flyui-multiStage__stageBody">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="kite-flyui-multiStage__stageName">{stage.name}</span>
                  {stage.requiredCount !== undefined && (
                    <span style={{ fontSize: 11, color: "var(--kite-muted)" }}>
                      ({stage.approvers?.filter((a) => a.status === "approved").length ?? 0}/{stage.requiredCount} required)
                    </span>
                  )}
                </div>
                {stage.dueAt && (
                  <p className="kite-flyui-multiStage__stageDue">Due: {stage.dueAt}</p>
                )}
                {stage.approvers && stage.approvers.length > 0 && (
                  <div className="kite-flyui-multiStage__approvers">
                    {stage.approvers.map((approver) => (
                      <div key={approver.id} className="kite-flyui-multiStage__approver">
                        <div className="kite-flyui-multiStage__approverAvatar" aria-hidden="true">
                          {approver.avatarText ?? approver.name[0].toUpperCase()}
                        </div>
                        <span>{approver.name}</span>
                        <span className={`kite-flyui-multiStage__approverStatus--${approver.status}`} style={{ fontSize: 11 }}>
                          {approver.status === "approved" ? "✓" : approver.status === "rejected" ? "✗" : "…"}
                        </span>
                        {approver.decidedAt && (
                          <span style={{ fontSize: 10, color: "var(--kite-muted)" }}>{approver.decidedAt}</span>
                        )}
                        {approver.comment && (
                          <p className="kite-flyui-multiStage__approverComment">"{approver.comment}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  },
);
