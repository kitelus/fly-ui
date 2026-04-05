import type { Meta, StoryObj } from "@storybook/react-vite";

import { Message } from "./Message";
import { SourceCard, SourceList } from "./SourceCard";
import { Thread } from "./Thread";

const meta = {
  title: "Agent Components/Example/Search Answer",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}
      >
        <div style={{ height: 360 }}>
          <Thread.Root>
            <Thread.List>
              <li>
                <Message.Root role="user" status="done">
                  <Message.Avatar fallback="U" />
                  <Message.Content>
                    <Message.Text>
                      Show me deployment checklist for staging.
                    </Message.Text>
                  </Message.Content>
                </Message.Root>
              </li>
              <li>
                <Message.Root role="assistant" status="done">
                  <Message.Avatar fallback="AI" />
                  <Message.Content>
                    <Message.Text>
                      Here are the validated staging rollout steps with links to
                      references.
                    </Message.Text>
                  </Message.Content>
                </Message.Root>
              </li>
            </Thread.List>
            <Thread.ScrollAnchor />
          </Thread.Root>
        </div>

        <SourceList.Root>
          <SourceList.Item>
            <SourceCard
              title="Deployment Runbook"
              url="https://example.com/runbook"
              excerpt="Preflight checks and rollback criteria"
            />
          </SourceList.Item>
          <SourceList.Item>
            <SourceCard
              title="Release SOP"
              url="https://example.com/sop"
              excerpt="Order of environment promotion"
            />
          </SourceList.Item>
        </SourceList.Root>
      </div>
    </div>
  ),
};
