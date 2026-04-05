import { FileAttachment } from "./FileAttachment";

const meta = {
  title: "Agent Components/Base/FileAttachment",
  component: FileAttachment,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 8 }}>
      <FileAttachment
        file={{ name: "notes.md", size: 23400, type: "text/markdown" }}
        status="done"
      />
      <FileAttachment
        file={{ name: "report.pdf", size: 2450000, type: "application/pdf" }}
        status="uploading"
        progress={66}
      />
    </div>
  ),
};

