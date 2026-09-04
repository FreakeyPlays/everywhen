import { DEFAULT_SETTINGS } from "@everywhen/contracts/settings";
import { describe, expect, it } from "vite-plus/test";
import { applySettingsPatch } from "./settings.ts";

describe("applySettingsPatch", () => {
  it("applies shared settings behavior without owning the contract", () => {
    expect(applySettingsPatch(DEFAULT_SETTINGS, { theme: "dark" })).toEqual({
      ...DEFAULT_SETTINGS,
      theme: "dark",
    });
  });
});
