import type { StoryContext } from "@storybook/angular-vite";
import type { ScreenshotMatcherOptions } from "vite-plus/test/browser";

const VISUAL_TEST_TAG = "visual";
const DEFAULT_ALLOWED_MISMATCHED_PIXEL_RATIO = 0.01;

export const captureStorySnapshot = async (context: StoryContext): Promise<void> => {
  if (!globalThis.__vitest_browser__) {
    return;
  }

  if (!context.tags.includes(VISUAL_TEST_TAG)) {
    return;
  }

  const [{ expect }, { page }] = await Promise.all([
    import("vite-plus/test"),
    import("vite-plus/test/browser"),
  ]);

  const options: ScreenshotMatcherOptions = {
    comparatorOptions: {
      allowedMismatchedPixelRatio: DEFAULT_ALLOWED_MISMATCHED_PIXEL_RATIO,
    },
  };

  try {
    await expect
      .element(page.elementLocator(context.canvasElement))
      .toMatchScreenshot(context.id, options);
  } catch (error) {
    if (error instanceof Error) {
      error.message = `Visual regression in ${context.title} \u2192 ${context.name}\n${error.message}`;

      if (error.message.includes("does not match the stored reference")) {
        error.cause = undefined;

        error.stack = error.message;
      }
    }
    throw error;
  }
};
