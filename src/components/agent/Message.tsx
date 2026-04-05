import {
  forwardRef,
  type HTMLAttributes,
  type ImgHTMLAttributes,
  type ReactNode,
  type TimeHTMLAttributes,
} from "react";

import { Slot } from "./primitives/Slot";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export type MessageRole = "user" | "assistant" | "system" | "tool";
export type MessageStatus = "streaming" | "done" | "error";

export interface MessageRootProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "content"
> {
  asChild?: boolean;
  role: MessageRole;
  status?: MessageStatus;
  content?: ReactNode;
  avatarSrc?: string;
  avatarFallback?: ReactNode;
  avatarAlt?: string;
  timestamp?: Date | number | string;
  showTimestamp?: boolean;
  header?: ReactNode;
  actions?: ReactNode;
}

const MessageRoot = forwardRef<HTMLDivElement, MessageRootProps>(
  (
    {
      asChild,
      className,
      role,
      status = "done",
      content,
      avatarSrc,
      avatarFallback,
      avatarAlt,
      timestamp,
      showTimestamp,
      header,
      actions,
      children,
      ...props
    },
    forwardedRef,
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={forwardedRef as never}
          className={cls("kite-fu-agent-message-root", className)}
          data-role={role}
          data-status={status}
          {...props}
        >
          {children as never}
        </Slot>
      );
    }

    if (children === undefined || children === null) {
      const shouldShowAvatar = role !== "system";
      const shouldShowTimestamp = showTimestamp ?? timestamp !== undefined;

      return (
        <div
          ref={forwardedRef}
          className={cls("kite-fu-agent-message-root", className)}
          data-role={role}
          data-status={status}
          {...props}
        >
          {shouldShowAvatar ? (
            <MessageAvatar
              src={avatarSrc}
              fallback={avatarFallback ?? (role === "user" ? "U" : "AI")}
              alt={avatarAlt}
            />
          ) : null}
          <MessageContent>
            {header ? <MessageHeader>{header}</MessageHeader> : null}
            {content !== undefined ? (
              <MessageText>{content}</MessageText>
            ) : null}
            {shouldShowTimestamp ? (
              <MessageTimestamp value={timestamp} />
            ) : null}
            {actions ? <MessageActions>{actions}</MessageActions> : null}
          </MessageContent>
        </div>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cls("kite-fu-agent-message-root", className)}
        data-role={role}
        data-status={status}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MessageRoot.displayName = "Message.Root";

export interface MessageAvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: ReactNode;
  alt?: string;
  imageProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "alt">;
}

const MessageAvatar = forwardRef<HTMLDivElement, MessageAvatarProps>(
  (
    {
      className,
      src,
      fallback,
      alt = "avatar",
      imageProps,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-message-avatar", className)}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} {...imageProps} />
      ) : (
        (fallback ?? children)
      )}
    </div>
  ),
);

MessageAvatar.displayName = "Message.Avatar";

export interface MessageContentProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const MessageContent = forwardRef<HTMLDivElement, MessageContentProps>(
  ({ asChild, className, children, ...props }, forwardedRef) => {
    if (asChild) {
      return (
        <Slot
          ref={forwardedRef as never}
          className={cls("kite-fu-agent-message-content", className)}
          {...props}
        >
          {children as never}
        </Slot>
      );
    }

    return (
      <div
        ref={forwardedRef}
        className={cls("kite-fu-agent-message-content", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

MessageContent.displayName = "Message.Content";

export interface MessageTextProps extends HTMLAttributes<HTMLDivElement> {
  asMarkdown?: boolean;
}

const MessageText = forwardRef<HTMLDivElement, MessageTextProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-message-text", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

MessageText.displayName = "Message.Text";

export interface MessageActionsProps extends HTMLAttributes<HTMLDivElement> {
  showOnHover?: boolean;
}

const MessageActions = forwardRef<HTMLDivElement, MessageActionsProps>(
  ({ className, showOnHover = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-message-actions", className)}
      data-visible={showOnHover ? undefined : "true"}
      {...props}
    >
      {children}
    </div>
  ),
);

MessageActions.displayName = "Message.Actions";

export interface MessageTimestampProps extends Omit<
  TimeHTMLAttributes<HTMLTimeElement>,
  "dateTime"
> {
  value?: Date | number | string;
  format?: (date: Date) => string;
}

const MessageTimestamp = forwardRef<HTMLTimeElement, MessageTimestampProps>(
  ({ className, value, format, children, ...props }, ref) => {
    const date =
      value === undefined
        ? undefined
        : value instanceof Date
          ? value
          : new Date(value);
    const text =
      date && !Number.isNaN(date.getTime())
        ? (format?.(date) ?? date.toLocaleTimeString())
        : children;

    return (
      <time
        ref={ref}
        className={cls("kite-fu-agent-message-timestamp", className)}
        dateTime={date?.toISOString()}
        {...props}
      >
        {text}
      </time>
    );
  },
);

MessageTimestamp.displayName = "Message.Timestamp";

export type MessageHeaderProps = HTMLAttributes<HTMLDivElement>;

const MessageHeader = forwardRef<HTMLDivElement, MessageHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-message-header", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

MessageHeader.displayName = "Message.Header";

export type MessageStatusProps = HTMLAttributes<HTMLDivElement>;

const MessageStatusBadge = forwardRef<HTMLDivElement, MessageStatusProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-message-status", className)}
      {...props}
    >
      {children}
    </div>
  ),
);

MessageStatusBadge.displayName = "Message.Status";

export const Message = Object.assign(MessageRoot, {
  Root: MessageRoot,
  Avatar: MessageAvatar,
  Header: MessageHeader,
  Content: MessageContent,
  Text: MessageText,
  Actions: MessageActions,
  Timestamp: MessageTimestamp,
  Status: MessageStatusBadge,
});
