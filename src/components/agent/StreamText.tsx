import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface StreamTextRootProps extends HTMLAttributes<HTMLSpanElement> {
  value?: string;
  isStreaming?: boolean;
  onComplete?: () => void;
  autoCursor?: boolean;
  typewriter?: boolean;
  typewriterSpeed?: number;
  streamingLabels?: string[];
  showStreamingLabel?: boolean;
  labelInterval?: number;
}

const StreamTextRoot = forwardRef<HTMLSpanElement, StreamTextRootProps>(
  (
    {
      className,
      value,
      isStreaming = false,
      onComplete,
      autoCursor = true,
      typewriter = true,
      typewriterSpeed = 24,
      streamingLabels,
      showStreamingLabel = true,
      labelInterval = 1200,
      children,
      ...props
    },
    ref,
  ) => {
    const [typedLength, setTypedLength] = useState(value?.length ?? 0);
    const [activeLabelIndex, setActiveLabelIndex] = useState(0);
    const shouldResetTypewriter = useRef(false);

    const labels = useMemo(
      () => streamingLabels?.filter(Boolean) ?? [],
      [streamingLabels],
    );

    const showAnimatedLabel =
      isStreaming && showStreamingLabel && labels.length > 0;

    const typedValue = value ?? "";

    useEffect(() => {
      if (!isStreaming) {
        onComplete?.();
      }
    }, [isStreaming, onComplete]);

    useEffect(() => {
      if (!typewriter || !isStreaming) {
        return;
      }
      shouldResetTypewriter.current = true;

      const intervalId = window.setInterval(
        () => {
          setTypedLength((previous) => {
            const base = shouldResetTypewriter.current ? 0 : previous;
            if (shouldResetTypewriter.current) {
              shouldResetTypewriter.current = false;
            }

            if (base >= typedValue.length) {
              window.clearInterval(intervalId);
              return base;
            }
            return base + 1;
          });
        },
        Math.max(12, typewriterSpeed),
      );

      return () => window.clearInterval(intervalId);
    }, [isStreaming, typewriter, typewriterSpeed, typedValue]);

    useEffect(() => {
      if (!showAnimatedLabel) {
        return;
      }

      const intervalId = window.setInterval(
        () => {
          setActiveLabelIndex((previous) => (previous + 1) % labels.length);
        },
        Math.max(500, labelInterval),
      );

      return () => window.clearInterval(intervalId);
    }, [labelInterval, labels.length, showAnimatedLabel]);

    const visibleValue =
      typewriter && isStreaming
        ? typedValue.slice(0, Math.min(typedLength, typedValue.length))
        : typedValue;

    return (
      <span
        ref={ref}
        className={cls("kite-fu-agent-stream-text-root", className)}
        data-streaming={isStreaming ? "true" : "false"}
        aria-live={isStreaming ? "polite" : undefined}
        {...props}
      >
        {value !== undefined ? (
          <>
            {visibleValue}
            {children}
          </>
        ) : (
          children
        )}
        {isStreaming && autoCursor ? (
          <StreamTextCursor aria-hidden="true" />
        ) : null}
        {showAnimatedLabel ? (
          <span
            className="kite-fu-agent-stream-text-label"
            key={labels[activeLabelIndex]}
          >
            {labels[activeLabelIndex]}
          </span>
        ) : null}
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
