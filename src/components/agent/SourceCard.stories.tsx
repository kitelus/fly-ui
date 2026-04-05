import { SourceCard, SourceList } from "./SourceCard";

const meta = {
  title: "Agent Components/Base/SourceCard",
  component: SourceCard,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <SourceCard
        title="Architecture Guide"
        url="https://example.com/arch"
        excerpt="Modular boundaries and event-driven integration"
      />
    </div>
  ),
};

export const List = {
  render: () => (
    <SourceList style={{ padding: 16 }}>
      <SourceList.Item>
        <SourceCard title="API Handbook" url="https://example.com/api" />
      </SourceList.Item>
      <SourceList.Item>
        <SourceCard
          title="Deployment Checklist"
          url="https://example.com/ops"
        />
      </SourceList.Item>
    </SourceList>
  ),
};

