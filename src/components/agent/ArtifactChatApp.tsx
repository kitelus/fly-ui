import { type CSSProperties, type ComponentType, type ReactNode } from "react";

import { Artifact } from "./Artifact";
import { ChatWindow, type ChatMessage } from "./ChatWindow";
import { cls } from "./primitives/cls";
import "./styles/kite-fu-agent-ui.css";

export interface ArtifactData {
  id: string;
  type: "code" | "image" | "html" | "text" | "csv";
  title: string;
  content: string;
  language?: string;
  createdAt?: Date;
  version?: number;
}

export type ArtifactChatAppSlotKey =
  | "chat"
  | "artifact"
  | "artifactHeader"
  | "artifactActions"
  | "artifactTabs"
  | "splitter"
  | "emptyArtifact";

export interface ArtifactChatAppProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  artifact?: ArtifactData | null;
  artifacts?: ArtifactData[];
  onArtifactSelect?: (id: string) => void;
  isLoading?: boolean;
  isStreaming?: boolean;
  splitRatio?: [number, number];
  artifactPosition?: "right" | "bottom";
  resizable?: boolean;
  slots?: Partial<
    Record<
      ArtifactChatAppSlotKey,
      ComponentType<Record<string, unknown>> | null
    >
  >;
  slotProps?: Partial<Record<ArtifactChatAppSlotKey, Record<string, unknown>>>;
  className?: string;
  style?: CSSProperties;
}

function renderSlot(
  SlotComponent: ComponentType<Record<string, unknown>> | null | undefined,
  props: Record<string, unknown>,
  fallback: ReactNode,
): ReactNode {
  if (SlotComponent === null) {
    return null;
  }
  if (!SlotComponent) {
    return fallback;
  }
  return <SlotComponent {...props} />;
}

export function ArtifactChatApp({
  messages,
  onSend,
  artifact,
  artifacts,
  onArtifactSelect,
  isLoading = false,
  isStreaming = false,
  splitRatio = [40, 60],
  artifactPosition = "right",
  slots,
  slotProps,
  className,
  style,
}: ArtifactChatAppProps) {
  return (
    <div
      className={cls("kite-fu-agent-artifact-chat-app-root", className)}
      data-position={artifactPosition}
      style={
        {
          ...style,
          "--kfa-artifact-chat-left": `${splitRatio[0]}%`,
          "--kfa-artifact-chat-right": `${splitRatio[1]}%`,
        } as CSSProperties
      }
    >
      {renderSlot(
        slots?.chat,
        { ...(slotProps?.chat ?? {}), messages },
        <div className="kite-fu-agent-artifact-chat-app-chat">
          <ChatWindow
            messages={messages}
            onSend={(value) => onSend(value)}
            isLoading={isLoading}
            isStreaming={isStreaming}
          />
        </div>,
      )}

      {renderSlot(
        slots?.artifact,
        { ...(slotProps?.artifact ?? {}), artifact },
        <div className="kite-fu-agent-artifact-chat-app-artifact">
          {artifacts && artifacts.length > 0
            ? renderSlot(
                slots?.artifactTabs,
                { ...(slotProps?.artifactTabs ?? {}), artifacts },
                <div className="kite-fu-agent-artifact-chat-app-tabs">
                  {artifacts.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onArtifactSelect?.(item.id)}
                      data-active={artifact?.id === item.id ? "true" : "false"}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>,
              )
            : null}

          {artifact ? (
            <Artifact.Root type={artifact.type} valueForCopy={artifact.content}>
              {renderSlot(
                slots?.artifactHeader,
                { ...(slotProps?.artifactHeader ?? {}), artifact },
                <Artifact.Header>
                  <Artifact.Title>{artifact.title}</Artifact.Title>
                  {artifact.language ? (
                    <Artifact.Language>{artifact.language}</Artifact.Language>
                  ) : null}
                  {renderSlot(
                    slots?.artifactActions,
                    { ...(slotProps?.artifactActions ?? {}), artifact },
                    <Artifact.Actions>
                      <Artifact.CopyTrigger />
                    </Artifact.Actions>,
                  )}
                </Artifact.Header>,
              )}
              <Artifact.Content value={artifact.content} />
            </Artifact.Root>
          ) : (
            renderSlot(
              slots?.emptyArtifact,
              { ...(slotProps?.emptyArtifact ?? {}) },
              <div className="kite-fu-agent-artifact-chat-app-empty">
                No artifact selected.
              </div>,
            )
          )}
        </div>,
      )}
    </div>
  );
}
