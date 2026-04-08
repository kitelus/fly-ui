import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
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
}

export interface PromptVersionHistoryProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  versions: PromptVersion[];
  activeVersionId?: string;
  onSelect?: (id: string) => void;
  onRestore?: (id: string) => void;
  theme?: KiteTheme;
}

export const PromptVersionHistory = forwardRef<HTMLDivElement, PromptVersionHistoryProps>(
  function PromptVersionHistory(
    { versions, activeVersionId, onSelect, onRestore, theme, style, ...rest },
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
        <div className="kite-flyui-promptHistory__list">
          {versions.map((v) => (
            <div
              key={v.id}
              className={`kite-flyui-promptHistory__item${v.id === activeId ? " kite-flyui-promptHistory__item--active" : ""}`}
              onClick={() => onSelect?.(v.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onSelect?.(v.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-pressed={v.id === activeId}
            >
              <span className="kite-flyui-promptHistory__ver">{v.version}</span>
              <div className="kite-flyui-promptHistory__body">
                {v.description && (
                  <div className="kite-flyui-promptHistory__desc">{v.description}</div>
                )}
                <div className="kite-flyui-promptHistory__meta">
                  {v.author && <span>{v.author}</span>}
                  {v.createdAt && <span>{v.createdAt}</span>}
                  {v.tokens !== undefined && <span>{v.tokens} tokens</span>}
                  {v.isActive && (
                    <span className="kite-flyui-promptHistory__activeLabel">Active</span>
                  )}
                </div>
                {v.id === activeId && (v.diffAdded?.length || v.diffRemoved?.length) && (
                  <div className="kite-flyui-promptHistory__diff">
                    {v.diffRemoved?.map((line, i) => (
                      <span key={`r${i}`} className="kite-flyui-promptHistory__diffRemove">- {line}</span>
                    ))}
                    {v.diffAdded?.map((line, i) => (
                      <span key={`a${i}`} className="kite-flyui-promptHistory__diffAdd">+ {line}</span>
                    ))}
                  </div>
                )}
              </div>
              {onRestore && !v.isActive && (
                <div className="kite-flyui-promptHistory__actions">
                  <button
                    className="kite-flyui-agentBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestore(v.id);
                    }}
                    type="button"
                  >
                    Restore
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
