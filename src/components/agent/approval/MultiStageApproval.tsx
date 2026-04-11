import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  onStageAction?: (stageId: string, action: "complete" | "reject" | "skip") => void;
  /** Map stage status → custom icon, merged with defaults. */
  stageIcons?: Partial<Record<ApprovalStageStatus, ReactNode>>;
  /** Custom render for a single stage row. */
  renderStage?: (stage: ApprovalStage) => ReactNode;
  theme?: KiteTheme;
}

export const MultiStageApproval = forwardRef<HTMLDivElement, MultiStageApprovalProps>(
  function MultiStageApproval(
    { title, stages, onStageAction, stageIcons, renderStage, theme, style, ...rest },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const DEFAULT_ICON: Record<ApprovalStageStatus, string> = {
      pending:     "",
      in_progress: "",
      completed:   "",
      rejected:    "",
      skipped:     "",
    };

    const resolveIcon = (status: ApprovalStageStatus): ReactNode =>
      stageIcons?.[status] ?? DEFAULT_ICON[status];

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-multiStage"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {title && <p className="kite-flyui-multiStage__title">{title}</p>}
        <div className="kite-flyui-multiStage__stages">
          {stages.map((stage) =>
            renderStage ? (
              <div key={stage.id}>{renderStage(stage)}</div>
            ) : (
              <div key={stage.id} className="kite-flyui-multiStage__stage">
                <div
                  className={`kite-flyui-multiStage__stageIcon kite-flyui-multiStage__stageIcon--${stage.status}${resolveIcon(stage.status) ? " kite-flyui-multiStage__stageIcon--custom" : ""}`}
                  aria-label={`Stage ${stage.name}: ${stage.status}`}
                >
                  {resolveIcon(stage.status) || null}
                </div>
                <div className="kite-flyui-multiStage__stageBody">
                  <div className="kite-flyui-multiStage__stageNameRow">
                    <span className="kite-flyui-multiStage__stageName">{stage.name}</span>
                    {stage.requiredCount !== undefined && (
                      <span className="kite-flyui-multiStage__stageCount">
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
                            {approver.avatarText ?? (approver.name.length > 0 ? approver.name[0].toUpperCase() : "?")}
                          </div>
                          <span>{approver.name}</span>
                          <span className={`kite-flyui-multiStage__approverStatus--${approver.status}`}>
                            {approver.status === "approved" ? "Approved" : approver.status === "rejected" ? "Rejected" : ""}
                          </span>
                          {approver.decidedAt && (
                            <span className="kite-flyui-multiStage__approverDecided">{approver.decidedAt}</span>
                          )}
                          {approver.comment && (
                            <p className="kite-flyui-multiStage__approverComment">"{approver.comment}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {onStageAction && stage.status === "in_progress" && (
                    <div className="kite-flyui-multiStage__stageActions">
                      <button
                        type="button"
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                        onClick={() => onStageAction(stage.id, "complete")}
                        aria-label={`Complete stage: ${stage.name}`}
                      >
                        Complete
                      </button>
                      <button
                        type="button"
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--danger"
                        onClick={() => onStageAction(stage.id, "reject")}
                        aria-label={`Reject stage: ${stage.name}`}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {onStageAction && stage.status === "pending" && (
                    <div className="kite-flyui-multiStage__stageActions">
                      <button
                        type="button"
                        className="kite-flyui-agentBtn"
                        onClick={() => onStageAction(stage.id, "skip")}
                        aria-label={`Skip stage: ${stage.name}`}
                      >
                        Skip
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  },
);
