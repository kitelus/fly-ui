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
      <StreamText value="Streaming response in progress" isStreaming />
      <StreamText value="Done response" isStreaming={false} />
    </div>
  ),
};

export const WithCursor = {
  render: () => (
    <div style={{ padding: 16 }}>
      <StreamText value="Token by token" isStreaming>
        <StreamText.Cursor />
      </StreamText>
    </div>
  ),
};

