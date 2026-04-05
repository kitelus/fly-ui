import type { Preview } from "@storybook/react-vite";
import { themes } from "storybook/theming";

const preview: Preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Guides", "Kite Components", "Components"],
        method: "alphabetical",
      },
    },
    docs: {
      theme: themes.normal,
    },
    backgrounds: {
      default: "surface",
      values: [
        { name: "surface", value: "#f6f7fb" },
        { name: "ink", value: "#0f172a" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
