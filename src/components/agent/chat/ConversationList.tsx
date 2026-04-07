import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef } from "react";
import { buildKiteThemeStyle, mergeKiteTheme, type KiteTheme } from "../../kite/theme";
import { useFlyUITheme } from "../../kite/theme";
import "../agent.css";

export interface ConversationItem {
  id: string;
  title: string;
  preview?: string;
  timestamp?: string;
  pinned?: boolean;
  unread?: number;
}

export interface ConversationListProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  items: ConversationItem[];
  activeId?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSelect?: (id: string) => void;
  showSearch?: boolean;
  theme?: KiteTheme;
}

export const ConversationList = forwardRef<HTMLDivElement, ConversationListProps>(
  function ConversationList(
    {
      items,
      activeId,
      searchValue = "",
      onSearchChange,
      onSelect,
      showSearch = true,
      theme,
      style,
      ...rest
    },
    ref,
  ) {
    const contextTheme = useFlyUITheme();
    const themeStyle = buildKiteThemeStyle(mergeKiteTheme(contextTheme, theme));

    const filtered = searchValue
      ? items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
            item.preview?.toLowerCase().includes(searchValue.toLowerCase()),
        )
      : items;

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-conversationList"
        style={{ ...themeStyle, ...style } as CSSProperties}
        role="listbox"
        aria-label="Conversations"
        {...rest}
      >
        {showSearch && (
          <input
            type="search"
            className="kite-flyui-conversationList__search"
            placeholder="Search conversations…"
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            aria-label="Search conversations"
          />
        )}
        {filtered.map((item) => (
          <div
            key={item.id}
            role="option"
            aria-selected={item.id === activeId}
            className={`kite-flyui-conversationList__item${item.id === activeId ? " kite-flyui-conversationList__item--active" : ""}`}
            onClick={() => onSelect?.(item.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect?.(item.id);
              }
            }}
            tabIndex={0}
          >
            <div className="kite-flyui-conversationList__itemBody">
              <div className="kite-flyui-conversationList__itemTitle">{item.title}</div>
              {item.preview && (
                <div className="kite-flyui-conversationList__itemPreview">{item.preview}</div>
              )}
            </div>
            {item.timestamp && (
              <span className="kite-flyui-conversationList__itemTime">{item.timestamp}</span>
            )}
            {item.pinned && <span className="kite-flyui-conversationList__pin">📌</span>}
          </div>
        ))}
      </div>
    );
  },
);
