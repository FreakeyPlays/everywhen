import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export const Theme = Schema.Literals(["system", "light", "dark"]);
export type Theme = typeof Theme.Type;

export const SettingsSchema = Schema.Struct({
  theme: Theme.pipe(Schema.withDecodingDefault(Effect.succeed("system"))),
});

export type Settings = typeof SettingsSchema.Type;

export const DEFAULT_SETTINGS: Settings = Schema.decodeSync(SettingsSchema)({});

export const SettingsPatchSchema = Schema.Struct({
  theme: Schema.optionalKey(Theme),
});

export type SettingsPatch = typeof SettingsPatchSchema.Type;
