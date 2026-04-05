import type { Meta, StoryObj } from "@storybook/react-vite";

import { ArtifactChatApp } from "./ArtifactChatApp";

const meta = {
  title: "Agent Component/ArtifactChatApp",
  component: ArtifactChatApp,
  tags: ["autodocs"],
  args: {
    messages: [
      { id: "1", role: "user", content: "Generate SQL migration" },
      { id: "2", role: "assistant", content: "Created migration file." },
    ],
    onSend: (text: string) => console.log("send", text),
    artifacts: [
      {
        id: "a1",
        type: "code",
        title: "V12__add_index.sql",
        language: "sql",
        content:
          "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);",
      },
    ],
    artifact: {
      id: "a1",
      type: "code",
      title: "V12__add_index.sql",
      language: "sql",
      content:
        "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);",
    },
  },
} satisfies Meta<typeof ArtifactChatApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: 580, padding: 16 }}>
      <ArtifactChatApp {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, padding: 16 }}>
      <ArtifactChatApp {...args} artifact={null} artifacts={[]} />
      <ArtifactChatApp
        {...args}
        artifactPosition="bottom"
        splitRatio={[50, 50]}
      />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        minHeight: 580,
        padding: 16,
        ["--kfa-code-bg" as string]: "#fff7ed",
        ["--kfa-code-header-bg" as string]: "#ffedd5",
      }}
    >
      <ArtifactChatApp {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.artifact-chat-override{border:2px dashed #f97316;border-radius:14px;padding:10px;}`}</style>
      <div style={{ minHeight: 580, padding: 16 }}>
        <ArtifactChatApp {...args} className="artifact-chat-override" />
      </div>
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ minHeight: 580, padding: 16 }}>
      <ArtifactChatApp {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <div style={{ minHeight: 580, padding: 16 }}>
      <ArtifactChatApp
        {...args}
        slots={{
          artifactActions: ({ artifact }) => (
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button">Copy</button>
              <button type="button">
                Download {String((artifact as { title?: string })?.title ?? "")}
              </button>
            </div>
          ),
        }}
      />
    </div>
  ),
};
