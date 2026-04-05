import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchChatApp } from "./SearchChatApp";

const messages = [
  {
    id: "1",
    role: "assistant" as const,
    content: "Found relevant references for your query.",
    sources: [
      {
        index: 1,
        title: "Architecture Guide",
        url: "https://example.com/arch",
        excerpt: "Modular monolith boundaries",
        favicon: "https://www.google.com/s2/favicons?domain=example.com",
      },
      {
        index: 2,
        title: "API Handbook",
        url: "https://example.com/api",
        excerpt: "Response wrapper conventions",
      },
    ],
  },
  { id: "2", role: "user" as const, content: "Show me deployment checklist" },
];

const meta = {
  title: "Agent Component/SearchChatApp",
  component: SearchChatApp,
  tags: ["autodocs"],
  args: {
    messages,
    onSend: (text: string) => console.log(text),
    searchMode: "hybrid",
  },
} satisfies Meta<typeof SearchChatApp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ minHeight: 520, padding: 16 }}>
      <SearchChatApp {...args} />
    </div>
  ),
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12, padding: 16 }}>
      <SearchChatApp
        {...args}
        searchMode="auto"
        showSourcesBeforeText
        maxSourcesVisible={1}
      />
      <SearchChatApp {...args} isLoading isStreaming searchMode="web" />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        minHeight: 520,
        padding: 16,
        ["--kfa-accent" as string]: "#7c2d12",
      }}
    >
      <SearchChatApp {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.search-app-override{border:2px solid #a3e635;padding:12px;border-radius:12px;background:#f7fee7;}`}</style>
      <div style={{ minHeight: 520, padding: 16 }}>
        <SearchChatApp {...args} className="search-app-override" />
      </div>
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ minHeight: 520, padding: 16 }}>
      <SearchChatApp {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <div style={{ minHeight: 520, padding: 16 }}>
      <SearchChatApp
        {...args}
        slots={{
          searchModeToggle: ({ searchMode }) => (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span>Mode:</span>
              <strong>{String(searchMode)}</strong>
            </div>
          ),
        }}
      />
    </div>
  ),
};
