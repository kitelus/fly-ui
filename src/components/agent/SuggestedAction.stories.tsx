import { SuggestedAction } from "./SuggestedAction";

const meta = {
  title: "Agent Components/Base/SuggestedAction",
  component: SuggestedAction,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <SuggestedAction
      style={{ padding: 16 }}
      actions={[
        { value: "Write release notes" },
        { value: "Create changelog" },
        { value: "Generate checklist" },
      ]}
    />
  ),
};
