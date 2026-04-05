export type MessageRole = "user" | "assistant" | "system" | "tool";
export type MessageStatus = "streaming" | "done" | "error";

export type AgentStatusValue =
  | "idle"
  | "thinking"
  | "running"
  | "paused"
  | "error"
  | "done";

export type ToolCallStatus = "pending" | "running" | "success" | "error";

export type StepStatus = "pending" | "running" | "done" | "error" | "skipped";

export type ArtifactType = "code" | "image" | "html" | "text" | "csv";

export interface MessageAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}
