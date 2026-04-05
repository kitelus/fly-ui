import { Thread } from "./Thread";

const meta = {
  title: "Agent Components/Base/Thread",
  component: Thread,
  tags: ["autodocs"],
  args: {
    autoScroll: true,
  },
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ height: 420, padding: 16 }}>
      <Thread
        autoScroll
        messages={[
          {
            id: "thread-item-1",
            role: "assistant",
            status: "done",
            content: "Thread item 1",
          },
          {
            id: "thread-item-2",
            role: "user",
            status: "done",
            content: "Thread item 2",
          },
          {
            id: "thread-item-3",
            role: "assistant",
            status: "streaming",
            content: "Streaming response...",
          },
        ]}
      />
    </div>
  ),
};

export const Empty = {
  render: () => (
    <div style={{ height: 320, padding: 16 }}>
      <Thread autoScroll messages={[]} emptyText="No messages yet." />
    </div>
  ),
};
