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
  /** Avatar initials (1-2 chars). Falls back to first letter of title. */
  avatarText?: string;
  /** Avatar background color. Falls back to CSS token. */
  avatarColor?: string;
}

export interface ConversationListProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  items: ConversationItem[];
  activeId?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSelect?: (id: string) => void;
  /** Show the search bar. @default true */
  showSearch?: boolean;
  /** Label shown above the list. */
  label?: string;
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
      label,
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

    const pinned = filtered.filter((i) => i.pinned);
    const rest_items = filtered.filter((i) => !i.pinned);

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-conversationList"
        style={{ ...themeStyle, ...style } as CSSProperties}
        role="listbox"
        aria-label="Conversations"
        {...rest}
      >
        {/* Search */}
        {showSearch && (
          <div className="kite-flyui-conversationList__searchWrap">
            <svg className="kite-flyui-conversationList__searchIcon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              className="kite-flyui-conversationList__search"
              placeholder="Search…"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
        )}

        {/* Label */}
        {label && <div className="kite-flyui-conversationList__label">{label}</div>}

        {/* Pinned group */}
        {pinned.length > 0 && (
          <div className="kite-flyui-conversationList__group">
            <div className="kite-flyui-conversationList__groupLabel">Pinned</div>
            {pinned.map((item) => (
              <ConversationRow key={item.id} item={item} activeId={activeId} onSelect={onSelect} />
            ))}
          </div>
        )}

        {/* Main list */}
        {rest_items.length > 0 && (
          <div className="kite-flyui-conversationList__group">
            {pinned.length > 0 && <div className="kite-flyui-conversationList__groupLabel">Recent</div>}
            {rest_items.map((item) => (
              <ConversationRow key={item.id} item={item} activeId={activeId} onSelect={onSelect} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="kite-flyui-conversationList__empty">No conversations found</div>
        )}
      </div>
    );
  },
);

// ── Row sub-component ────────────────────────────────────────────────────────

function ConversationRow({
  item,
  activeId,
  onSelect,
}: {
  item: ConversationItem;
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const isActive = item.id === activeId;
  const initials = item.avatarText ?? item.title.charAt(0).toUpperCase();

  return (
    <div
      role="option"
      aria-selected={isActive}
      className={`kite-flyui-conversationList__item${isActive ? " kite-flyui-conversationList__item--active" : ""}`}
      onClick={() => onSelect?.(item.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect?.(item.id);
        }
      }}
      tabIndex={0}
    >
      {/* Avatar */}
      <div
        className="kite-flyui-conversationList__avatar"
        style={item.avatarColor ? { background: item.avatarColor } as CSSProperties : undefined}
        aria-hidden="true"
      >
        {initials}
      </div>

      {/* Body */}
      <div className="kite-flyui-conversationList__itemBody">
        <div className="kite-flyui-conversationList__itemTitle">{item.title}</div>
        {item.preview && (
          <div className="kite-flyui-conversationList__itemPreview">{item.preview}</div>
        )}
      </div>

      {/* Right meta */}
      <div className="kite-flyui-conversationList__itemMeta">
        {item.timestamp && (
          <span className="kite-flyui-conversationList__itemTime">{item.timestamp}</span>
        )}
        {item.unread != null && item.unread > 0 && (
          <span className="kite-flyui-conversationList__unread">
            {item.unread > 99 ? "99+" : item.unread}
          </span>
        )}
        {item.pinned && (
          <svg className="kite-flyui-conversationList__pin" width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M9.5 1.5a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-1.5 1.5a1 1 0 0 1-1.32.083L9.207 10.06 8.5 14l-3-3 2.94-.707-1.973-2.473a1 1 0 0 1 .083-1.32l1.5-1.5zM2 14l3.5-3.5"/>
          </svg>
        )}
      </div>
    </div>
  );
}
