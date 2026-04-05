import {
  createContext,
  forwardRef,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type HTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

interface MessageInputContextValue {
  value: string;
  setValue: (next: string) => void;
  disabled: boolean;
  isLoading: boolean;
  maxLength?: number;
  submitOnEnter: boolean;
  submitOnShiftEnter: boolean;
  submit: () => void;
  onFilesSelected?: (files: File[]) => void;
}

const MessageInputContext = createContext<MessageInputContextValue | null>(
  null,
);

function useMessageInputContext() {
  const value = useContext(MessageInputContext);
  if (!value) {
    throw new Error(
      "MessageInput components must be used inside MessageInput.Root",
    );
  }
  return value;
}

export interface MessageInputRootProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSend?: (value: string, files?: File[]) => void;
  disabled?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  submitOnEnter?: boolean;
  submitOnShiftEnter?: boolean;
  placeholder?: string;
  allowAttachments?: boolean;
  showCounter?: boolean;
  showSubmit?: boolean;
}

const MessageInputRoot = forwardRef<HTMLDivElement, MessageInputRootProps>(
  (
    {
      className,
      value,
      defaultValue = "",
      onValueChange,
      onSend,
      disabled = false,
      isLoading = false,
      maxLength,
      submitOnEnter = true,
      submitOnShiftEnter = false,
      placeholder = "Message...",
      allowAttachments = false,
      showCounter = true,
      showSubmit = true,
      children,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [files, setFiles] = useState<File[]>([]);
    const isControlled = value !== undefined;
    const resolvedValue = isControlled ? value : internalValue;

    const setValue = (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onValueChange?.(next);
    };

    const submit = () => {
      const payload = resolvedValue.trim();
      if (!payload || disabled || isLoading) {
        return;
      }
      onSend?.(payload, files.length > 0 ? files : undefined);
      if (!isControlled) {
        setInternalValue("");
      }
      setFiles([]);
    };

    const contextValue = {
      value: resolvedValue,
      setValue,
      disabled,
      isLoading,
      maxLength,
      submitOnEnter,
      submitOnShiftEnter,
      submit,
      onFilesSelected: (nextFiles: File[]) => setFiles(nextFiles),
    };

    return (
      <MessageInputContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cls("kite-fu-agent-message-input-root", className)}
          data-disabled={disabled ? "true" : "false"}
          data-loading={isLoading ? "true" : "false"}
          {...props}
        >
          {children === undefined || children === null ? (
            <>
              <MessageInputField placeholder={placeholder} />
              <MessageInputToolbar>
                {allowAttachments ? <MessageInputAttachTrigger /> : null}
                {showCounter ? <MessageInputCounter /> : null}
                {showSubmit ? <MessageInputSubmit /> : null}
              </MessageInputToolbar>
            </>
          ) : (
            children
          )}
        </div>
      </MessageInputContext.Provider>
    );
  },
);

MessageInputRoot.displayName = "MessageInput.Root";

export interface MessageInputFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxRows?: number;
}

const MessageInputField = forwardRef<
  HTMLTextAreaElement,
  MessageInputFieldProps
>(
  (
    {
      className,
      autoResize = true,
      maxRows = 8,
      onChange,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const {
      value,
      setValue,
      disabled,
      isLoading,
      maxLength,
      submitOnEnter,
      submitOnShiftEnter,
      submit,
    } = useMessageInputContext();

    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(event);
      if (event.defaultPrevented) {
        return;
      }
      setValue(event.target.value);

      if (autoResize) {
        const node = event.target;
        node.style.height = "auto";
        const computed = window.getComputedStyle(node);
        const lineHeight = Number.parseFloat(computed.lineHeight) || 24;
        const maxHeight = lineHeight * maxRows;
        node.style.height = `${Math.min(node.scrollHeight, maxHeight)}px`;
      }
    };

    return (
      <textarea
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cls("kite-fu-agent-message-input-field", className)}
        value={value}
        disabled={disabled || isLoading}
        maxLength={maxLength}
        onChange={handleChange}
        onKeyDown={(event) => {
          onKeyDown?.(event);
          if (event.defaultPrevented) {
            return;
          }

          if (event.key !== "Enter") {
            return;
          }

          const shouldSubmit =
            (submitOnEnter && !event.shiftKey) ||
            (submitOnShiftEnter && event.shiftKey);

          if (shouldSubmit) {
            event.preventDefault();
            submit();
          }
        }}
        {...props}
      />
    );
  },
);

MessageInputField.displayName = "MessageInput.Field";

export type MessageInputToolbarProps = HTMLAttributes<HTMLDivElement>;

const MessageInputToolbar = forwardRef<
  HTMLDivElement,
  MessageInputToolbarProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cls("kite-fu-agent-message-input-toolbar", className)}
    {...props}
  />
));

MessageInputToolbar.displayName = "MessageInput.Toolbar";

export type MessageInputSubmitProps = ButtonHTMLAttributes<HTMLButtonElement>;

const MessageInputSubmit = forwardRef<
  HTMLButtonElement,
  MessageInputSubmitProps
>(({ className, onClick, children = "↑", ...props }, ref) => {
  const { value, disabled, isLoading, submit } = useMessageInputContext();
  const isDisabled = disabled || isLoading || value.trim().length === 0;

  return (
    <button
      ref={ref}
      type="button"
      className={cls("kite-fu-agent-message-input-submit", className)}
      disabled={isDisabled}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          submit();
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
});

MessageInputSubmit.displayName = "MessageInput.Submit";

export interface MessageInputAttachTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  accept?: string;
  multiple?: boolean;
}

const MessageInputAttachTrigger = forwardRef<
  HTMLButtonElement,
  MessageInputAttachTriggerProps
>(
  (
    {
      className,
      accept = "*",
      multiple = true,
      onClick,
      children = "+",
      ...props
    },
    ref,
  ) => {
    const { disabled, isLoading, onFilesSelected } = useMessageInputContext();
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
      <>
        <button
          ref={ref}
          type="button"
          className={cls(
            "kite-fu-agent-message-input-attach-trigger",
            className,
          )}
          disabled={disabled || isLoading}
          onClick={(event) => {
            onClick?.(event);
            if (!event.defaultPrevented) {
              inputRef.current?.click();
            }
          }}
          {...props}
        >
          {children}
        </button>
        <input
          ref={inputRef}
          className="kite-fu-agent-message-input-hidden-file"
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(event) => {
            const fileList = event.target.files;
            if (!fileList) {
              return;
            }
            onFilesSelected?.(Array.from(fileList));
            event.target.value = "";
          }}
        />
      </>
    );
  },
);

MessageInputAttachTrigger.displayName = "MessageInput.AttachTrigger";

export interface MessageInputCounterProps extends HTMLAttributes<HTMLSpanElement> {
  max?: number;
  current?: number;
  warnAt?: number;
}

const MessageInputCounter = forwardRef<
  HTMLSpanElement,
  MessageInputCounterProps
>(({ className, max, current, warnAt = 0.8, ...props }, ref) => {
  const { value, maxLength } = useMessageInputContext();

  const resolvedCurrent = current ?? value.length;
  const resolvedMax = max ?? maxLength;

  let state: "normal" | "warning" | "danger" = "normal";
  if (resolvedMax !== undefined) {
    const ratio = resolvedCurrent / Math.max(1, resolvedMax);
    state = ratio >= 1 ? "danger" : ratio >= warnAt ? "warning" : "normal";
  }

  return (
    <span
      ref={ref}
      className={cls("kite-fu-agent-message-input-counter", className)}
      data-state={state}
      {...props}
    >
      {resolvedMax === undefined
        ? resolvedCurrent
        : `${resolvedCurrent}/${resolvedMax}`}
    </span>
  );
});

MessageInputCounter.displayName = "MessageInput.Counter";

export const MessageInput = Object.assign(MessageInputRoot, {
  Root: MessageInputRoot,
  Field: MessageInputField,
  Submit: MessageInputSubmit,
  AttachTrigger: MessageInputAttachTrigger,
  Toolbar: MessageInputToolbar,
  Counter: MessageInputCounter,
});
