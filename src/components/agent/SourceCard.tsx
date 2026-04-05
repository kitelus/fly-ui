import {
  forwardRef,
  type AnchorHTMLAttributes,
  type HTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface SourceCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  url?: string;
  excerpt?: string;
  icon?: string;
}

export const SourceCard = forwardRef<HTMLDivElement, SourceCardProps>(
  ({ className, title, url, excerpt, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-source-card-root", className)}
      {...props}
    >
      {icon ? (
        <img
          className="kite-fu-agent-source-card-icon"
          src={icon}
          alt=""
          aria-hidden="true"
        />
      ) : null}
      <div className="kite-fu-agent-source-card-body">
        {title ? (
          <div className="kite-fu-agent-source-card-title">{title}</div>
        ) : null}
        {url ? (
          <a
            className="kite-fu-agent-source-card-url"
            href={url}
            target="_blank"
            rel="noreferrer"
          >
            {url}
          </a>
        ) : null}
        {excerpt ? (
          <div className="kite-fu-agent-source-card-excerpt">{excerpt}</div>
        ) : null}
        {children}
      </div>
    </div>
  ),
);

SourceCard.displayName = "SourceCard";

export type SourceListProps = HTMLAttributes<HTMLDivElement>;

const SourceListRoot = forwardRef<HTMLDivElement, SourceListProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-source-list-root", className)}
      {...props}
    />
  ),
);

SourceListRoot.displayName = "SourceList.Root";

export type SourceListItemProps = HTMLAttributes<HTMLDivElement>;

const SourceListItem = forwardRef<HTMLDivElement, SourceListItemProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-source-list-item", className)}
      {...props}
    />
  ),
);

SourceListItem.displayName = "SourceList.Item";

export const SourceList = Object.assign(SourceListRoot, {
  Root: SourceListRoot,
  Item: SourceListItem,
});

export type SourceCardLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;
