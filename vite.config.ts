import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // Angular rules are scoped to the Angular app rather than declared globally,
        // so the other workspaces are not linted against Angular conventions.
        files: ["apps/desktop/**/*.ts"],
        jsPlugins: [{ name: "@angular-eslint", specifier: "@angular-eslint/eslint-plugin" }],
        rules: {
          // Only the TS-side rules are usable here. Oxlint's JS plugin bridge has no
          // type information, so `no-uncalled-signals`, `no-developer-preview` and
          // `no-experimental` are omitted -- they throw on every file if enabled.
          "@angular-eslint/component-class-suffix": "error",
          "@angular-eslint/component-selector": [
            "error",
            { type: "element", prefix: "app", style: "kebab-case" },
          ],
          "@angular-eslint/consistent-component-styles": "error",
          "@angular-eslint/contextual-lifecycle": "error",
          "@angular-eslint/directive-class-suffix": "error",
          "@angular-eslint/directive-selector": [
            "error",
            { type: "attribute", prefix: "app", style: "camelCase" },
          ],
          "@angular-eslint/no-async-lifecycle-method": "error",
          "@angular-eslint/no-duplicates-in-metadata-arrays": "error",
          "@angular-eslint/no-empty-lifecycle-method": "error",
          "@angular-eslint/no-input-rename": "error",
          "@angular-eslint/no-inputs-metadata-property": "error",
          "@angular-eslint/no-lifecycle-call": "error",
          "@angular-eslint/no-output-native": "error",
          "@angular-eslint/no-output-on-prefix": "error",
          "@angular-eslint/no-output-rename": "error",
          "@angular-eslint/no-outputs-metadata-property": "error",
          "@angular-eslint/no-queries-metadata-property": "error",
          "@angular-eslint/prefer-inject": "error",
          "@angular-eslint/prefer-output-readonly": "error",
          "@angular-eslint/prefer-standalone": "error",
          "@angular-eslint/require-lifecycle-on-prototype": "error",
          "@angular-eslint/use-injectable-provided-in": "error",
          "@angular-eslint/use-lifecycle-interface": "error",
          "@angular-eslint/use-pipe-transform-interface": "error",
        },
      },
    ],
  },
  run: {
    cache: true,
    tasks: {},
  },
});
