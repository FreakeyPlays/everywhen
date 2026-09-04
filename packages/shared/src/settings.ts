import type { Settings, SettingsPatch } from "@everywhen/contracts/settings";

export function applySettingsPatch(current: Settings, patch: SettingsPatch): Settings {
  return { ...current, ...patch };
}
