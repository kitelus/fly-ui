import {
  forwardRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

type FeedbackValue = "positive" | "negative" | null;

export interface FeedbackBarRootProps extends HTMLAttributes<HTMLDivElement> {
  value?: FeedbackValue;
  defaultFeedbackValue?: FeedbackValue;
  onValueChange?: (value: FeedbackValue) => void;
}

const FeedbackBarRoot = forwardRef<HTMLDivElement, FeedbackBarRootProps>(
  (
    {
      className,
      value,
      defaultFeedbackValue = null,
      onValueChange,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] =
      useState<FeedbackValue>(defaultFeedbackValue);
    const resolvedValue = value === undefined ? internalValue : value;

    const setValue = (next: FeedbackValue) => {
      if (value === undefined) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    };

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-feedback-bar-root", className)}
        data-value={resolvedValue ?? "null"}
        {...props}
      >
        {children ?? (
          <>
            <button
              type="button"
              className="kite-fu-agent-feedback-bar-thumb-up"
              data-active={resolvedValue === "positive" ? "true" : "false"}
              onClick={() =>
                setValue(resolvedValue === "positive" ? null : "positive")
              }
            >
              👍
            </button>
            <button
              type="button"
              className="kite-fu-agent-feedback-bar-thumb-down"
              data-active={resolvedValue === "negative" ? "true" : "false"}
              onClick={() =>
                setValue(resolvedValue === "negative" ? null : "negative")
              }
            >
              👎
            </button>
          </>
        )}
      </div>
    );
  },
);

FeedbackBarRoot.displayName = "FeedbackBar.Root";

export type FeedbackBarButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const FeedbackBarThumbUp = forwardRef<
  HTMLButtonElement,
  FeedbackBarButtonProps
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cls("kite-fu-agent-feedback-bar-thumb-up", className)}
    {...props}
  />
));

FeedbackBarThumbUp.displayName = "FeedbackBar.ThumbUp";

const FeedbackBarThumbDown = forwardRef<
  HTMLButtonElement,
  FeedbackBarButtonProps
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cls("kite-fu-agent-feedback-bar-thumb-down", className)}
    {...props}
  />
));

FeedbackBarThumbDown.displayName = "FeedbackBar.ThumbDown";

export interface FeedbackBarCommentProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onCommentSubmit?: (comment: string) => void;
}

const FeedbackBarComment = forwardRef<
  HTMLTextAreaElement,
  FeedbackBarCommentProps
>(({ className, onCommentSubmit, onKeyDown, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cls("kite-fu-agent-feedback-bar-comment", className)}
    onKeyDown={(event) => {
      onKeyDown?.(event);
      if (event.defaultPrevented) {
        return;
      }
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onCommentSubmit?.(event.currentTarget.value.trim());
      }
    }}
    {...props}
  />
));

FeedbackBarComment.displayName = "FeedbackBar.Comment";

export type FeedbackBarSubmittedProps = HTMLAttributes<HTMLDivElement>;

const FeedbackBarSubmitted = forwardRef<
  HTMLDivElement,
  FeedbackBarSubmittedProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-feedback-bar-submitted", className)}
    {...props}
  />
));

FeedbackBarSubmitted.displayName = "FeedbackBar.Submitted";

export const FeedbackBar = Object.assign(FeedbackBarRoot, {
  Root: FeedbackBarRoot,
  ThumbUp: FeedbackBarThumbUp,
  ThumbDown: FeedbackBarThumbDown,
  Comment: FeedbackBarComment,
  Submitted: FeedbackBarSubmitted,
});
