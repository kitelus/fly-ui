import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConversationPage } from "./ConversationPage";

const conversations = [
  {
    id: "c1",
    title: "Release Planning",
    preview: "Create v0.2 release checklist",
    updatedAt: new Date(),
    isPinned: true,
  },
  {
    id: "c2",
    title: "Hiring Pipeline",
    preview: "Draft interviewer rubric",
    updatedAt: new Date(),
  },
];

const messages = [
  { id: "m1", role: "assistant" as const, content: "Welcome back." },
  { id: "m2", role: "user" as const, content: "Open release planning." },
];

const meta = {
  title: "Agent Component/ConversationPage",
  component: ConversationPage,
  tags: ["autodocs"],
  args: {
    conversations,
    messages,
    onSend: (text: string) => console.log(text),
    userProfile: { name: "Kite Admin" },
  },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ConversationPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: 640 }}>
      <ConversationPage {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ minHeight: 420 }}>
        <ConversationPage {...args} sidebarOpen={false} />
      </div>
      <div style={{ minHeight: 420 }}>
        <ConversationPage {...args} conversations={[]} messages={[]} />
      </div>
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        minHeight: 640,
        ["--kfa-accent" as string]: "#1d4ed8",
        ["--kfa-surface" as string]: "#eff6ff",
      }}
    >
      <ConversationPage {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.conversation-page-override{border:3px double #64748b;border-radius:12px;overflow:hidden;}`}</style>
      <div style={{ minHeight: 640 }}>
        <ConversationPage {...args} className="conversation-page-override" />
      </div>
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ minHeight: 640 }}>
      <ConversationPage {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <div style={{ minHeight: 640 }}>
      <ConversationPage
        {...args}
        slots={{
          topBar: () => (
            <div
              style={{
                padding: 12,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>Workspace Inbox</strong>
              <button type="button">New</button>
            </div>
          ),
        }}
      />
    </div>
  ),
};
