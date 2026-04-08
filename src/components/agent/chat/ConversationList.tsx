import { forwardRef, type CSSProperties, type ComponentPropsWithoutRef, type ReactNode } from "react";
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
  /** Show a loading state for this item (e.g. while deleting). */
  loading?: boolean;
  /** Any extra data you want to associate with the item (passed back in callbacks). */
  data?: unknown;
}

export interface ConversationListProps extends Omit<ComponentPropsWithoutRef<"div">, "onSelect"> {
  items: ConversationItem[];
  activeId?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSelect?: (id: string, item: ConversationItem) => void;
  onDelete?: (id: string, item: ConversationItem) => void;
  onPin?: (id: string, pinned: boolean, item: ConversationItem) => void;
  onRename?: (id: string, item: ConversationItem) => void;
  onNew?: () => void;
  /** Label for the new button. @default "+" */
  newLabel?: ReactNode;
  /** Aria-label for the new conversation button. @default "New conversation" */
  newAriaLabel?: string;
  /** Show the search bar. @default true */
  showSearch?: boolean;
  /** Label shown above the list. */
  label?: string;
  /** Override the "Pinned" group label. @default "Pinned" */
  pinnedGroupLabel?: string;
  /** Override the "Recent" group label. @default "Recent" */
  recentGroupLabel?: string;
  /** Placeholder text for the search input. @default "Search…" */
  searchPlaceholder?: string;
  /** Text shown when the list is empty. @default "No conversations found" */
  emptyText?: string;
  /** Custom slot rendered above the item list (below search). */
  headerSlot?: ReactNode;
  /** Custom slot rendered below the item list. */
  footerSlot?: ReactNode;
  /** Render prop to fully replace a row. */
  renderItem?: (item: ConversationItem, isActive: boolean) => ReactNode;
  /** Render a custom empty state. */
  renderEmpty?: () => ReactNode;
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
      onDelete,
      onPin,
      onRename,
      onNew,
      newLabel = "+",
      newAriaLabel = "New conversation",
      showSearch = true,
      label,
      pinnedGroupLabel = "Pinned",
      recentGroupLabel = "Recent",
      searchPlaceholder = "Search…",
      emptyText = "No conversations found",
      headerSlot,
      footerSlot,
      renderItem,
      renderEmpty,
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
    const unpinned = filtered.filter((i) => !i.pinned);

    return (
      <div
        ref={ref}
        className="kite-flyui-host kite-flyui-conversationList"
        style={{ ...themeStyle, ...style } as CSSProperties}
        role="listbox"
        aria-label={label ?? "Conversations"}
        {...rest}
      >
        {/* Search + New row */}
        {(showSearch || onNew) && (
          <div className="kite-flyui-conversationList__searchWrap">
            {showSearch && (
              <>
                <svg className="kite-flyui-conversationList__searchIcon" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  type="search"
                  className="kite-flyui-conversationList__search"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  aria-label="Search conversations"
                />
              </>
            )}
            {onNew && (
              <button
                type="button"
                className="kite-flyui-agentBtn kite-flyui-agentBtn--primary kite-flyui-conversationList__newBtn"
                onClick={onNew}
                aria-label={newAriaLabel}
              >
                {newLabel}
              </button>
            )}
          </div>
        )}

        {/* Label */}
        {label && <div className="kite-flyui-conversationList__label">{label}</div>}

        {headerSlot}

        {/* Pinned group */}
        {pinned.length > 0 && (
          <div className="kite-flyui-conversationList__group">
            <div className="kite-flyui-conversationList__groupLabel">{pinnedGroupLabel}</div>
            {pinned.map((item) => (
              renderItem
                ? <div key={item.id}>{renderItem(item, item.id === activeId)}</div>
                : (
                  <ConversationRow
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onPin={onPin}
                    onRename={onRename}
                  />
                )
            ))}
          </div>
        )}

        {/* Main list */}
        {unpinned.length > 0 && (
          <div className="kite-flyui-conversationList__group">
            {pinned.length > 0 && <div className="kite-flyui-conversationList__groupLabel">{recentGroupLabel}</div>}
            {unpinned.map((item) => (
              renderItem
                ? <div key={item.id}>{renderItem(item, item.id === activeId)}</div>
                : (
                  <ConversationRow
                    key={item.id}
                    item={item}
                    activeId={activeId}
                    onSelect={onSelect}
                    onDelete={onDelete}
                    onPin={onPin}
                    onRename={onRename}
                  />
                )
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          renderEmpty
            ? renderEmpty()
            : <div className="kite-flyui-conversationList__empty">{emptyText}</div>
        )}

        {footerSlot}
      </div>
    );
  },
);

// ── Row sub-component ────────────────────────────────────────────────────────

function ConversationRow({
  item,
  activeId,
  onSelect,
  onDelete,
  onPin,
  onRename,
}: {
  item: ConversationItem;
  activeId?: string;
  onSelect?: (id: string, item: ConversationItem) => void;
  onDelete?: (id: string, item: ConversationItem) => void;
  onPin?: (id: string, pinned: boolean, item: ConversationItem) => void;
  onRename?: (id: string, item: ConversationItem) => void;
}) {
  const isActive = item.id === activeId;
  const initials = item.avatarText ?? item.title.charAt(0).toUpperCase();

  return (
    <div
      role="option"
      aria-selected={isActive}
      aria-busy={item.loading}
      className={[
        "kite-flyui-conversationList__item",
        isActive ? "kite-flyui-conversationList__item--active" : "",
        item.loading ? "kite-flyui-conversationList__item--loading" : "",
      ].filter(Boolean).join(" ")}
      onClick={() => !item.loading && onSelect?.(item.id, item)}
      onKeyDown={(e) => {
        if (!item.loading && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onSelect?.(item.id, item);
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
          <span className="kite-flyui-conversationList__unread" aria-label={`${item.unread} unread`}>
            {item.unread > 99 ? "99+" : item.unread}
          </span>
        )}
        {item.pinned && (
          <svg className="kite-flyui-conversationList__pin" width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M9.5 1.5a1 1 0 0 1 1.414 0l3.586 3.586a1 1 0 0 1 0 1.414l-1.5 1.5a1 1 0 0 1-1.32.083L9.207 10.06 8.5 14l-3-3 2.94-.707-1.973-2.473a1 1 0 0 1 .083-1.32l1.5-1.5zM2 14l3.5-3.5"/>
          </svg>
        )}
        {/* Action buttons — shown on hover via CSS */}
        {(onDelete || onPin || onRename) && (
          <div className="kite-flyui-conversationList__itemActions">
            {onRename && (
              <button
                type="button"
                className="kite-flyui-conversationList__itemActionBtn"
                onClick={(e) => { e.stopPropagation(); onRename(item.id, item); }}
                aria-label={`Rename: ${item.title}`}
                title="Rename"
              >
                Rename
              </button>
            )}
            {onPin && (
              <button
                type="button"
                className="kite-flyui-conversationList__itemActionBtn"
                onClick={(e) => { e.stopPropagation(); onPin(item.id, !item.pinned, item); }}
                aria-label={item.pinned ? "Unpin conversation" : "Pin conversation"}
                title={item.pinned ? "Unpin" : "Pin"}
              >
                {item.pinned ? "Unpin" : "Pin"}
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="kite-flyui-conversationList__itemActionBtn kite-flyui-conversationList__itemActionBtn--danger"
                onClick={(e) => { e.stopPropagation(); onDelete(item.id, item); }}
                aria-label={`Delete conversation: ${item.title}`}
                title="Delete"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
