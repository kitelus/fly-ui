import {
  forwardRef,
  useEffect,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface StreamTextRootProps extends HTMLAttributes<HTMLSpanElement> {
  value?: string;
  isStreaming?: boolean;
  onComplete?: () => void;
}

const StreamTextRoot = forwardRef<HTMLSpanElement, StreamTextRootProps>(
  (
    { className, value, isStreaming = false, onComplete, children, ...props },
    ref,
  ) => {
    useEffect(() => {
      if (!isStreaming) {
        onComplete?.();
      }
    }, [isStreaming, onComplete]);

    return (
      <span
        ref={ref}
        className={cls("kite-fu-agent-stream-text-root", className)}
        data-streaming={isStreaming ? "true" : "false"}
        {...props}
      >
        {value ?? children}
      </span>
    );
  },
);

StreamTextRoot.displayName = "StreamText.Root";

export interface StreamTextCursorProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  blinkInterval?: number;
}

const StreamTextCursor = forwardRef<HTMLSpanElement, StreamTextCursorProps>(
  (
    { className, children = "|", blinkInterval = 530, style, ...props },
    ref,
  ) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-stream-text-cursor", className)}
      style={{ ...style, animationDuration: `${blinkInterval}ms` }}
      {...props}
    >
      {children}
    </span>
  ),
);

StreamTextCursor.displayName = "StreamText.Cursor";

export type StreamTextDoneProps = HTMLAttributes<HTMLSpanElement>;

const StreamTextDone = forwardRef<HTMLSpanElement, StreamTextDoneProps>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-stream-text-done", className)}
      {...props}
    >
      {children}
    </span>
  ),
);

StreamTextDone.displayName = "StreamText.Done";

export const StreamText = Object.assign(StreamTextRoot, {
  Root: StreamTextRoot,
  Cursor: StreamTextCursor,
  Done: StreamTextDone,
});
