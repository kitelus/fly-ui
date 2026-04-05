import { Message } from "./Message";

const meta = {
  title: "Agent Components/Base/Message",
  component: Message,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ display: "grid", gap: 10, padding: 16 }}>
      <Message
        role="assistant"
        status="done"
        avatarFallback="AI"
        content="This is an assistant message with default style."
        timestamp={new Date()}
        showTimestamp
      />
      <Message
        role="user"
        status="done"
        avatarFallback="U"
        content="User message with compact spacing."
        timestamp={new Date()}
        showTimestamp
      />
      <Message
        role="system"
        status="done"
        content="System notice for timeline context."
      />
    </div>
  ),
};

export const WithActions = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Message
        role="assistant"
        status="done"
        avatarFallback="AI"
        header="complete"
        content="Message with custom action controls."
        timestamp={new Date()}
        showTimestamp
        actions={
          <>
            <button type="button">Copy</button>
            <button type="button">Retry</button>
          </>
        }
      />
    </div>
  ),
};
