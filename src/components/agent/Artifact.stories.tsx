import { Artifact } from "./Artifact";

const sql = "CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);";

const meta = {
  title: "Agent Components/Base/Artifact",
  component: Artifact,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <Artifact
        type="code"
        valueForCopy={sql}
        defaultOpen
        title="V12__add_index.sql"
        language="sql"
        content={sql}
      />
    </div>
  ),
};
