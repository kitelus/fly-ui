import { FeedbackBar } from "./FeedbackBar";

const meta = {
  title: "Agent Components/Base/FeedbackBar",
  component: FeedbackBar,
  tags: ["autodocs"],
};

export default meta;

export const Default = {
  render: () => (
    <div style={{ padding: 16 }}>
      <FeedbackBar />
    </div>
  ),
};

export const WithComment = {
  render: () => (
    <div style={{ padding: 16, display: "grid", gap: 8 }}>
      <FeedbackBar>
        <FeedbackBar.ThumbUp>Good</FeedbackBar.ThumbUp>
        <FeedbackBar.ThumbDown>Bad</FeedbackBar.ThumbDown>
      </FeedbackBar>
      <FeedbackBar.Comment placeholder="Share your feedback" />
      <FeedbackBar.Submitted>Feedback captured</FeedbackBar.Submitted>
    </div>
  ),
};

