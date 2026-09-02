#!/usr/bin/env bun
import { $ } from "bun";

const BUMPS = { feat: "minor", fix: "patch", perf: "patch" } as const;
const TYPES = new Set([
  "build",
  "chore",
  "ci",
  "docs",
  "feat",
  "fix",
  "perf",
  "refactor",
  "revert",
  "style",
  "test",
]);
const RANK = { patch: 0, minor: 1, major: 2 } as const;
type Bump = keyof typeof RANK;

const HEADER = /^[*-]?\s*([a-z]+)(?:\([^)]*\))?(!)?:\s/;

type Manifest = { name: string; version: string };

async function readJson(path: string) {
  return (await Bun.file(path).json()) as Manifest;
}

async function manifests() {
  const paths = ["package.json"];
  for await (const path of new Bun.Glob("{apps,packages}/*/package.json").scan()) {
    paths.push(path);
  }
  return paths.sort();
}

async function pending(): Promise<{ bump: Bump | null; range: string }> {
  const tag = `v${(await readJson("package.json")).version}`;
  const tagged =
    (await $`git rev-parse -q --verify refs/tags/${tag}`.nothrow().quiet()).exitCode === 0;
  const range = tagged ? `${tag}..HEAD` : "HEAD";
  const log = await $`git log ${range} --format=%B%x00`.quiet().text();

  let bump: Bump | null = null;
  const raise = (next: Bump) => {
    if (bump === null || RANK[next] > RANK[bump]) bump = next;
  };

  for (const message of log.split("\0")) {
    if (/^BREAKING[ -]CHANGE:/m.test(message)) raise("major");
    for (const line of message.split("\n")) {
      const match = HEADER.exec(line.trim());
      if (!match) continue;
      const [, type, breaking] = match;
      if (!TYPES.has(type!)) continue;
      if (breaking) raise("major");
      else if (type! in BUMPS) raise(BUMPS[type as keyof typeof BUMPS]);
    }
  }
  return { bump, range };
}

function bumped(version: string, bump: Bump) {
  const parts = version.split(".").map(Number);
  const [major, minor, patch] = parts;
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    throw new Error(`Cannot bump unsupported version "${version}"`);
  }
  if (bump === "major") return `${major! + 1}.0.0`;
  if (bump === "minor") return `${major}.${minor! + 1}.0`;
  return `${major}.${minor}.${patch! + 1}`;
}

const [command, flag] = process.argv.slice(2);

if (command === "version") {
  const { bump, range } = await pending();
  const current = (await readJson("package.json")).version;

  if (bump === null) {
    console.log(`No releasable commits in ${range}`);
  } else if (flag === "--dry") {
    console.log(`Pending release: ${current} → ${bumped(current, bump)} (${bump} from ${range})`);
  } else {
    const next = bumped(current, bump);
    for (const path of await manifests()) {
      const manifest = await readJson(path);
      manifest.version = next;
      await Bun.write(path, `${JSON.stringify(manifest, null, 2)}\n`);
    }
    console.log(`Bumped ${current} → ${next} (${bump} from ${range})`);
  }
} else {
  console.error("usage: bun scripts/release.ts version [--dry]");
  process.exit(1);
}
