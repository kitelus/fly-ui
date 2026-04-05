import {
  createContext,
  forwardRef,
  useContext,
  useState,
  type ReactNode,
  type HTMLAttributes,
} from "react";

import type { ToolCallStatus } from "./types";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

interface ToolCallContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ToolCallContext = createContext<ToolCallContextValue | null>(null);

function useToolCallContext() {
  const value = useContext(ToolCallContext);
  if (!value) {
    throw new Error("ToolCall components must be used inside ToolCall.Root");
  }
  return value;
}

export interface ToolCallRootProps extends HTMLAttributes<HTMLDivElement> {
  toolName: string;
  status?: ToolCallStatus;
  callId?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  headerLabel?: ReactNode;
  statusLabel?: ReactNode;
  argsValue?: Record<string, unknown>;
  resultValue?: unknown;
  resultIsError?: boolean;
  showArgs?: boolean;
  showResult?: boolean;
}

const ToolCallRoot = forwardRef<HTMLDivElement, ToolCallRootProps>(
  (
    {
      className,
      toolName,
      status = "pending",
      callId,
      defaultOpen = false,
      open,
      onOpenChange,
      headerLabel,
      statusLabel,
      argsValue,
      resultValue,
      resultIsError = false,
      showArgs = true,
      showResult = true,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = open !== undefined;
    const resolvedOpen = isControlled ? open : internalOpen;

    const setOpen = (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    };

    const value = { open: resolvedOpen, setOpen };

    return (
      <ToolCallContext.Provider value={value}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-tool-call-root", className)}
          data-tool-name={toolName}
          data-status={status}
          data-state={resolvedOpen ? "open" : "closed"}
          data-call-id={callId}
          {...props}
        >
          {children ?? (
            <>
              <ToolCallHeader>
                <ToolCallName>{headerLabel ?? toolName}</ToolCallName>
                <ToolCallStatusBadge>
                  {statusLabel ?? status}
                </ToolCallStatusBadge>
              </ToolCallHeader>
              {showArgs && argsValue ? (
                <ToolCallArgs value={argsValue} />
              ) : null}
              {showResult && resultValue !== undefined ? (
                <ToolCallResult value={resultValue} isError={resultIsError} />
              ) : null}
            </>
          )}
        </div>
      </ToolCallContext.Provider>
    );
  },
);

ToolCallRoot.displayName = "ToolCall.Root";

export type ToolCallHeaderProps = HTMLAttributes<HTMLDivElement>;

const ToolCallHeader = forwardRef<HTMLDivElement, ToolCallHeaderProps>(
  ({ className, onClick, ...props }, ref) => {
    const { open, setOpen } = useToolCallContext();
    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-tool-call-header", className)}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setOpen(!open);
          }
        }}
        {...props}
      />
    );
  },
);

ToolCallHeader.displayName = "ToolCall.Header";

export type ToolCallNameProps = HTMLAttributes<HTMLSpanElement>;

const ToolCallName = forwardRef<HTMLSpanElement, ToolCallNameProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-tool-call-name", className)}
      {...props}
    />
  ),
);

ToolCallName.displayName = "ToolCall.Name";

export type ToolCallStatusProps = HTMLAttributes<HTMLSpanElement>;

const ToolCallStatusBadge = forwardRef<HTMLSpanElement, ToolCallStatusProps>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cls("kite-fu-agent-tool-call-status", className)}
      {...props}
    />
  ),
);

ToolCallStatusBadge.displayName = "ToolCall.Status";

function stringify(value: unknown) {
  if (typeof value === "string") {
    return value;
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export interface ToolCallArgsProps extends HTMLAttributes<HTMLPreElement> {
  value?: Record<string, unknown>;
  asJSON?: boolean;
}

const ToolCallArgs = forwardRef<HTMLPreElement, ToolCallArgsProps>(
  ({ className, value, asJSON = true, children, ...props }, ref) => {
    const { open } = useToolCallContext();
    if (!open) {
      return null;
    }
    const text = value ? (asJSON ? stringify(value) : String(value)) : children;

    return (
      <pre
        ref={ref}
        className={cls("kite-fu-agent-tool-call-args", className)}
        {...props}
      >
        {text}
      </pre>
    );
  },
);

ToolCallArgs.displayName = "ToolCall.Args";

export interface ToolCallResultProps extends HTMLAttributes<HTMLDivElement> {
  value?: unknown;
  isError?: boolean;
  asJSON?: boolean;
}

const ToolCallResult = forwardRef<HTMLDivElement, ToolCallResultProps>(
  (
    { className, value, isError = false, asJSON = true, children, ...props },
    ref,
  ) => {
    const { open } = useToolCallContext();
    if (!open) {
      return null;
    }
    const text =
      value !== undefined
        ? asJSON
          ? stringify(value)
          : String(value)
        : children;

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-tool-call-result", className)}
        data-is-error={isError ? "true" : "false"}
        {...props}
      >
        {text}
      </div>
    );
  },
);

ToolCallResult.displayName = "ToolCall.Result";

export const ToolCall = Object.assign(ToolCallRoot, {
  Root: ToolCallRoot,
  Header: ToolCallHeader,
  Name: ToolCallName,
  Status: ToolCallStatusBadge,
  Args: ToolCallArgs,
  Result: ToolCallResult,
});
