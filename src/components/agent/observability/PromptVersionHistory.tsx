import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface PromptVersion {
  id: string;
  version: string;
  description?: string;
  author?: string;
  createdAt?: string;
  tokens?: number;
  isActive?: boolean;
  diffAdded?: string[];
  diffRemoved?: string[];
  /** Any extra data to associate with this version. */
  data?: unknown;
}

export interface PromptVersionHistoryProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  versions: PromptVersion[];
  activeVersionId?: string;
  onSelect?: (id: string, version: PromptVersion) => void;
  onRestore?: (id: string, version: PromptVersion) => void;
  onDelete?: (id: string, version: PromptVersion) => void;
  onDuplicate?: (id: string, version: PromptVersion) => void;
  onCompare?: (idA: string, idB: string) => void;
  /** Override the "Restore" button label. @default "Restore" */
  restoreLabel?: ReactNode;
  /** Override the "Delete" button label. @default "Delete" */
  deleteLabel?: ReactNode;
  /** Override the "Duplicate" button label. @default "Duplicate" */
  duplicateLabel?: ReactNode;
  /** Override the "Compare" button label. @default "Compare" */
  compareLabel?: ReactNode;
  /** Override the "Active" badge label. @default "Active" */
  activeLabel?: ReactNode;
  /** Text shown when there are no versions. @default "" */
  emptyText?: string;
  /** Render a custom empty state. */
  renderEmpty?: () => ReactNode;
  /** Custom render for a single version row. */
  renderVersion?: (version: PromptVersion, isSelected: boolean) => ReactNode;
  /** Slot rendered in the card header. */
  headerSlot?: ReactNode;
  /** Slot rendered below the list. */
  footerSlot?: ReactNode;
  theme?: KiteTheme;
}

export const PromptVersionHistory = forwardRef<HTMLDivElement, PromptVersionHistoryProps>(
  function PromptVersionHistory(
    {
      versions,
      activeVersionId,
      onSelect,
      onRestore,
      onDelete,
      onDuplicate,
      onCompare,
      restoreLabel = "Restore",
      deleteLabel = "Delete",
      duplicateLabel = "Duplicate",
      compareLabel = "Compare",
      activeLabel = "Active",
      emptyText,
      renderEmpty,
      renderVersion,
      headerSlot,
      footerSlot,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));
    const activeId = activeVersionId ?? versions[0]?.id;

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-agentCard kite-flyui-promptHistory"
        style={{ ...themeStyle, ...style } as CSSProperties}
        {...rest}
      >
        {headerSlot}
        <div className="kite-flyui-promptHistory__list">
          {versions.length === 0 ? (
            renderEmpty
              ? renderEmpty()
              : emptyText
                ? <div className="kite-flyui-agentMemory__empty">{emptyText}</div>
                : null
          ) : versions.map((v) => {
            const isSelected = v.id === activeId;

            if (renderVersion) {
              return <div key={v.id}>{renderVersion(v, isSelected)}</div>;
            }

            return (
              <div
                key={v.id}
                className={`kite-flyui-promptHistory__item${isSelected ? " kite-flyui-promptHistory__item--active" : ""}`}
                onClick={() => onSelect?.(v.id, v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect?.(v.id, v);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <span className="kite-flyui-promptHistory__ver">{v.version}</span>
                <div className="kite-flyui-promptHistory__body">
                  {v.description && (
                    <div className="kite-flyui-promptHistory__desc">{v.description}</div>
                  )}
                  <div className="kite-flyui-promptHistory__meta">
                    {v.author     && <span>{v.author}</span>}
                    {v.createdAt  && <span>{v.createdAt}</span>}
                    {v.tokens !== undefined && <span>{v.tokens.toLocaleString()} tokens</span>}
                    {v.isActive   && (
                      <span className="kite-flyui-promptHistory__activeLabel">{activeLabel}</span>
                    )}
                  </div>
                  {isSelected && (v.diffAdded?.length || v.diffRemoved?.length) && (
                    <div className="kite-flyui-promptHistory__diff">
                      {v.diffRemoved?.map((line, i) => (
                        <span key={`r-${i}-${line.slice(0, 20)}`} className="kite-flyui-promptHistory__diffRemove">- {line}</span>
                      ))}
                      {v.diffAdded?.map((line, i) => (
                        <span key={`a-${i}-${line.slice(0, 20)}`} className="kite-flyui-promptHistory__diffAdd">+ {line}</span>
                      ))}
                    </div>
                  )}
                </div>
                {(onRestore || onDelete || onDuplicate || onCompare) && (
                  <div className="kite-flyui-promptHistory__actions">
                    {onCompare && !isSelected && (
                      <button
                        className="kite-flyui-agentBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompare(activeId ?? v.id, v.id);
                        }}
                        type="button"
                        aria-label={`Compare ${v.version} with active version`}
                      >
                        {compareLabel}
                      </button>
                    )}
                    {onDuplicate && (
                      <button
                        className="kite-flyui-agentBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDuplicate(v.id, v);
                        }}
                        type="button"
                        aria-label={`Duplicate version ${v.version}`}
                      >
                        {duplicateLabel}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(v.id, v);
                        }}
                        type="button"
                        aria-label={`Delete version ${v.version}`}
                      >
                        {deleteLabel}
                      </button>
                    )}
                    {onRestore && !v.isActive && (
                      <button
                        className="kite-flyui-agentBtn kite-flyui-agentBtn--primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRestore(v.id, v);
                        }}
                        type="button"
                      >
                        {restoreLabel}
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {footerSlot}
      </div>
    );
  },
);
