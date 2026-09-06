import path from "node:path";
import { fileURLToPath } from "node:url";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { storybookAngularVitest } from "@storybook/angular-vite/vitest";
import { defineConfig, defineProject } from "vite-plus";
import { playwright } from "vite-plus/test/browser-playwright";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const storybookConfigDir = path.join(dirname, "projects/ui/.storybook");

export default defineConfig({
  test: {
    // Coverage is a root-level option; setting it inside defineProject is ignored.
    // Keeps this project's own scaffolding out of the report, which otherwise
    // measures the visual-regression hook instead of any component.
    // A pixel mismatch always unwinds through the same line of the shared afterEach
    // hook, so that frame identifies nothing. The message already names the story and
    // links the diff image. Other errors keep their frames. Root-level, like coverage.
    onStackTrace: (error, frame) =>
      !(
        error.message?.includes("does not match the stored reference") === true &&
        frame.file.endsWith("visual-regression.ts")
      ),
    coverage: {
      exclude: [".storybook/**", "src/**/*.stories.ts"],
    },
    projects: [
      defineProject({
        // The library, not this directory. Angular's compiler resolves its tsconfig
        // relative to this, and the config only lives up here so that vite-plus,
        // vitest and @storybook/addon-vitest resolve to a single copy of Vitest.
        root: path.join(dirname, "projects/ui"),
        optimizeDeps: {
          exclude: ["vite-plus/test", "vite-plus/test/browser"],
        },
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotFailures: false,
            expect: {
              toMatchScreenshot: {
                resolveScreenshotPath: ({ arg, browserName, platform, ext }) =>
                  path.join(
                    storybookConfigDir,
                    "__screenshots__",
                    `${arg}-${browserName}-${platform}${ext}`,
                  ),
              },
            },
            instances: [
              {
                browser: "chromium",
              },
            ],
          },
        },
        plugins: [
          storybookAngularVitest(),
          storybookTest({
            configDir: storybookConfigDir,
          }),
        ],
      }),
    ],
  },
});
