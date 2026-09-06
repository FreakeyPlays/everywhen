import type { Preview } from "@storybook/angular-vite";

import "./styles.css";
import { captureStorySnapshot } from "./visual-regression";

const preview: Preview = {
  afterEach: captureStorySnapshot,
  tags: ["visual"],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: "todo",
    },
  },
};

export default preview;
