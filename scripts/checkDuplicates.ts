#!/usr/bin/env tsx
/**
 * checkDuplicates.ts
 *
 * Flags two canon entries that share the same normalized Arabic text but
 * have different IDs. This usually means a doa was added twice under
 * different occasions, which dilutes the canon. Reviewers can still
 * choose to keep both, but they must do so explicitly.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_ROOT = join(ROOT, "src", "data");

function walk(dir: string): string[] {
  const out: string[] = [];
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    if (name.startsWith(".")) continue;
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) out.push(...walk(full));
    else if (stat.isFile() && name.endsWith(".json")) out.push(full);
  }
  return out;
}

/** Strip tashkil and stretch marks so visual-equivalent texts collide. */
function normalizeArabic(raw: string): string {
  return raw
    .normalize("NFKD")
    // Remove Arabic harakat (fatha, kasra, damma, etc.) U+064B..U+065F
    .replace(/[ً-ٰٟۖ-ۭ]/g, "")
    // Collapse whitespace.
    .replace(/\s+/g, " ")
    .trim();
}

const files = walk(DATA_ROOT);
const byArabic = new Map<string, { id: string; file: string }[]>();
let parseFailures = 0;

for (const file of files) {
  let entry: { id?: string; arabic?: string };
  try {
    entry = JSON.parse(readFileSync(file, "utf-8"));
  } catch {
    parseFailures++;
    continue;
  }
  if (typeof entry.arabic !== "string" || typeof entry.id !== "string") continue;
  if (entry.arabic === "VERIFIKASI") continue;
  const key = normalizeArabic(entry.arabic);
  if (!key) continue;
  const list = byArabic.get(key) ?? [];
  list.push({ id: entry.id, file: relative(ROOT, file) });
  byArabic.set(key, list);
}

const dups = [...byArabic.values()].filter((list) => list.length > 1);

if (dups.length === 0) {
  console.log(
    `✓ Tidak ada duplikasi teks Arab (${files.length} berkas diperiksa${
      parseFailures ? `, ${parseFailures} berkas gagal di-parse` : ""
    }).`,
  );
  process.exit(0);
}

console.error(`\n✗ Ditemukan ${dups.length} kelompok teks Arab duplikat:\n`);
for (const group of dups) {
  console.error(`  Kelompok:`);
  for (const item of group) {
    console.error(`    • ${item.id}  →  ${item.file}`);
  }
  console.error("");
}
process.exit(1);
