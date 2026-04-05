import { ToolCall } from "./ToolCall";

const meta = {
  title: "Agent Components/Base/ToolCall",
  component: ToolCall,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <ToolCall
        toolName="search_docs"
        status="running"
        defaultOpen
        callId="tc-1"
        headerLabel="search_docs"
        statusLabel="running"
        argsValue={{ query: "storybook organization", limit: 5 }}
        resultValue={{ hits: 3 }}
      />
    </div>
  ),
};
