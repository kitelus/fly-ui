import { MessageInput } from "./MessageInput";

const meta = {
  title: "Agent Components/Base/MessageInput",
  component: MessageInput,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <MessageInput
        onSend={(value) => console.log(value)}
        maxLength={300}
        placeholder="Type your request"
        allowAttachments
        showCounter
        showSubmit
      />
    </div>
  ),
};
