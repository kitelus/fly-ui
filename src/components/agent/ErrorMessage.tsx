import {
  forwardRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface ErrorMessageRootProps extends HTMLAttributes<HTMLDivElement> {
  error?: Error | string;
  onRetry?: () => void;
}

const ErrorMessageRoot = forwardRef<HTMLDivElement, ErrorMessageRootProps>(
  ({ className, error, onRetry, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-error-message-root", className)}
      {...props}
    >
      {children ?? (
        <>
          <div className="kite-fu-agent-error-message-icon" aria-hidden="true">
            !
          </div>
          <div className="kite-fu-agent-error-message-title">
            Something went wrong
          </div>
          <div className="kite-fu-agent-error-message-description">
            {typeof error === "string" ? error : error?.message}
          </div>
          {onRetry ? (
            <button
              type="button"
              className="kite-fu-agent-error-message-retry"
              onClick={() => onRetry()}
            >
              Retry
            </button>
          ) : null}
        </>
      )}
    </div>
  ),
);

ErrorMessageRoot.displayName = "ErrorMessage.Root";

export type ErrorMessageIconProps = HTMLAttributes<HTMLDivElement>;

const ErrorMessageIcon = forwardRef<HTMLDivElement, ErrorMessageIconProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-error-message-icon", className)}
      {...props}
    />
  ),
);

ErrorMessageIcon.displayName = "ErrorMessage.Icon";

export type ErrorMessageTitleProps = HTMLAttributes<HTMLDivElement>;

const ErrorMessageTitle = forwardRef<HTMLDivElement, ErrorMessageTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cls("kite-fu-agent-error-message-title", className)}
      {...props}
    />
  ),
);

ErrorMessageTitle.displayName = "ErrorMessage.Title";

export type ErrorMessageDescriptionProps = HTMLAttributes<HTMLDivElement>;

const ErrorMessageDescription = forwardRef<
  HTMLDivElement,
  ErrorMessageDescriptionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-error-message-description", className)}
    {...props}
  />
));

ErrorMessageDescription.displayName = "ErrorMessage.Description";

export type ErrorMessageRetryProps = ButtonHTMLAttributes<HTMLButtonElement>;

const ErrorMessageRetry = forwardRef<HTMLButtonElement, ErrorMessageRetryProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cls("kite-fu-agent-error-message-retry", className)}
      {...props}
    />
  ),
);

ErrorMessageRetry.displayName = "ErrorMessage.Retry";

export const ErrorMessage = Object.assign(ErrorMessageRoot, {
  Root: ErrorMessageRoot,
  Icon: ErrorMessageIcon,
  Title: ErrorMessageTitle,
  Description: ErrorMessageDescription,
  Retry: ErrorMessageRetry,
});
