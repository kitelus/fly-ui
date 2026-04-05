import type { Meta, StoryObj } from "@storybook/react-vite";

import { MultiAgentBoard } from "./MultiAgentBoard";

const agents = [
  {
    id: "a1",
    name: "Planner",
    status: "running" as const,
    description: "Breaks tasks into steps",
    lastMessage: "Generating plan...",
    steps: [
      { id: "s1", label: "Collect context", status: "done" as const },
      { id: "s2", label: "Draft plan", status: "running" as const },
    ],
  },
  {
    id: "a2",
    name: "Researcher",
    status: "thinking" as const,
    description: "Finds references",
    lastMessage: "Searching docs",
  },
  {
    id: "a3",
    name: "Reviewer",
    status: "idle" as const,
    description: "Reviews generated output",
  },
];

const meta = {
  title: "Agent Component/MultiAgentBoard",
  component: MultiAgentBoard,
  tags: ["autodocs"],
  args: {
    agents,
    selectable: true,
    selectedAgentId: "a1",
  },
} satisfies Meta<typeof MultiAgentBoard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <MultiAgentBoard {...args} />,
};

export const AllStates: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: 12 }}>
      <MultiAgentBoard {...args} layout="grid" />
      <MultiAgentBoard {...args} layout="rows" selectedAgentId="a2" />
    </div>
  ),
};

export const ThemeOverride: Story = {
  render: (args) => (
    <div
      style={{
        ["--kfa-accent" as string]: "#7e22ce",
        ["--kfa-surface" as string]: "#faf5ff",
      }}
    >
      <MultiAgentBoard {...args} />
    </div>
  ),
};

export const ClassNameOverride: Story = {
  render: (args) => (
    <>
      <style>{`.board-override{border:2px solid #60a5fa;padding:12px;border-radius:12px;background:#eff6ff;}`}</style>
      <MultiAgentBoard {...args} className="board-override" />
    </>
  ),
};

export const DarkMode: Story = {
  render: (args) => (
    <div data-theme="dark" style={{ padding: 12 }}>
      <MultiAgentBoard {...args} />
    </div>
  ),
};

export const ComposedExample: Story = {
  render: (args) => (
    <MultiAgentBoard
      {...args}
      onBroadcast={(message) => console.log("broadcast", message)}
      slots={{
        boardFooter: () => (
          <footer style={{ fontSize: 12, opacity: 0.7 }}>
            Live orchestration board
          </footer>
        ),
      }}
    />
  ),
};
