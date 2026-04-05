import { ErrorMessage } from "./ErrorMessage";

const meta = {
  title: "Agent Components/Base/ErrorMessage",
  component: ErrorMessage,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <ErrorMessage
        error="Failed to fetch trace data"
        onRetry={() => console.log("retry")}
      />
    </div>
  ),
};

