import * as Schema from "effect/Schema";
import { describe, expect, it } from "vite-plus/test";
import { DEFAULT_SETTINGS, SettingsSchema } from "./settings.ts";

describe("SettingsSchema", () => {
  const decodeSettings = Schema.decodeUnknownSync(SettingsSchema);

  it("provides the shared defaults", () => {
    expect(decodeSettings({})).toEqual(DEFAULT_SETTINGS);
  });

  it("rejects invalid settings", () => {
    expect(() => decodeSettings({ theme: "unknown" })).toThrow();
  });
});
