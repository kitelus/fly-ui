import { StreamText } from "./StreamText";

const meta = {
  title: "Agent Components/Base/StreamText",
  component: StreamText,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 10 }}>
      <StreamText
        value="Streaming response in progress"
        isStreaming
        streamingLabels={[
          "Reading context",
          "Planning",
          "Executing",
          "Drafting",
        ]}
      />
      <StreamText value="Done response" isStreaming={false} />
    </div>
  ),
};

export const WithCursor = {
  render: () => (
    <div style={{ padding: 16 }}>
      <StreamText value="Token by token" isStreaming autoCursor={false}>
        <StreamText.Cursor />
      </StreamText>
    </div>
  ),
};

export const FastTyping = {
  render: () => (
    <div style={{ padding: 16 }}>
      <StreamText
        value="Analyzing logs, correlating signals, and preparing a prioritized action plan"
        isStreaming
        typewriterSpeed={16}
        streamingLabels={["Thinking", "Searching", "Composing"]}
        labelInterval={900}
      />
    </div>
  ),
};
