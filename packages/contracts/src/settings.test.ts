import * as Schema from "effect/Schema";
import { describe, expect, it } from "vite-plus/test";
import { DEFAULT_SETTINGS, SettingsPatchSchema, SettingsSchema } from "./settings.ts";

describe("SettingsSchema", () => {
  const decodeSettings = Schema.decodeUnknownSync(SettingsSchema);

  it("provides the shared defaults", () => {
    expect(decodeSettings({})).toEqual({ theme: "system" });
    expect(DEFAULT_SETTINGS).toEqual({ theme: "system" });
  });

  it.each(["system", "light", "dark"])("preserves the explicit %s theme", (theme) => {
    expect(decodeSettings({ theme })).toEqual({ theme });
  });

  it("rejects invalid settings", () => {
    expect(() => decodeSettings({ theme: "unknown" })).toThrow();
  });
});

describe("SettingsPatchSchema", () => {
  const decodePatch = Schema.decodeUnknownSync(SettingsPatchSchema);

  it("allows an empty patch without inserting defaults", () => {
    expect(decodePatch({})).toEqual({});
  });

  it.each(["system", "light", "dark"])("preserves a patch selecting %s", (theme) => {
    expect(decodePatch({ theme })).toEqual({ theme });
  });

  it.each(["unknown", "", null, 1])("rejects an invalid patch theme: %s", (theme) => {
    expect(() => decodePatch({ theme })).toThrow();
  });
});
