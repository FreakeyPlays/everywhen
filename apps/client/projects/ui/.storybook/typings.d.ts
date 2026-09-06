declare module "*.md" {
  const content: string;
  export default content;
}

/** Set by Vitest's browser runner; absent when Storybook renders normally. */
declare var __vitest_browser__: boolean | undefined;
