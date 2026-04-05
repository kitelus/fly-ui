import { forwardRef, type HTMLAttributes } from "react";

import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

type AttachmentStatus = "uploading" | "done" | "error";

export interface FileLike {
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FileAttachmentRootProps extends HTMLAttributes<HTMLDivElement> {
  file: FileLike;
  status?: AttachmentStatus;
  progress?: number;
  onRemove?: () => void;
}

const formatSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const resolveType = (type: string) => {
  if (type.startsWith("image/")) {
    return "image";
  }
  if (type.includes("pdf")) {
    return "pdf";
  }
  if (
    type.includes("json") ||
    type.includes("javascript") ||
    type.includes("typescript")
  ) {
    return "code";
  }
  return "other";
};

const FileAttachmentRoot = forwardRef<HTMLDivElement, FileAttachmentRootProps>(
  ({ className, file, status = "done", progress, onRemove, ...props }, ref) => {
    const type = resolveType(file.type);

    return (
      <div
        ref={ref}
        className={cls("kite-fu-agent-file-attachment-root", className)}
        data-type={type}
        data-status={status}
        {...props}
      >
        <div className="kite-fu-agent-file-attachment-preview">
          {type.toUpperCase()}
        </div>
        <div className="kite-fu-agent-file-attachment-main">
          <div className="kite-fu-agent-file-attachment-name">{file.name}</div>
          <div className="kite-fu-agent-file-attachment-size">
            {formatSize(file.size)}
          </div>
          {status === "uploading" ? (
            <div className="kite-fu-agent-file-attachment-progress">
              <div
                className="kite-fu-agent-file-attachment-progress-fill"
                style={{
                  width: `${Math.max(0, Math.min(100, progress ?? 0))}%`,
                }}
              />
            </div>
          ) : null}
        </div>
        {onRemove ? (
          <button
            type="button"
            className="kite-fu-agent-file-attachment-remove"
            onClick={() => onRemove()}
          >
            ×
          </button>
        ) : null}
      </div>
    );
  },
);

FileAttachmentRoot.displayName = "FileAttachment.Root";

export const FileAttachment = Object.assign(FileAttachmentRoot, {
  Root: FileAttachmentRoot,
});
