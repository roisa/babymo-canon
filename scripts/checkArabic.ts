#!/usr/bin/env tsx
/**
 * checkArabic.ts
 *
 * Defense-in-depth religious safety:
 *  - An entry must not be marked verified while any required field still
 *    contains the literal "VERIFIKASI" placeholder.
 *  - production_ready=true requires status=verified (also enforced by
 *    the Zod schema, but checked here for redundancy).
 *  - Warn (non-fatal) on Arabic text containing only ASCII — it's almost
 *    always an editor placeholder mistake.
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

interface Issue {
  file: string;
  message: string;
  level: "error" | "warn";
}

const files = walk(DATA_ROOT);
const issues: Issue[] = [];

const VERIFIKASI = "VERIFIKASI";

for (const file of files) {
  let entry: Record<string, unknown>;
  try {
    entry = JSON.parse(readFileSync(file, "utf-8"));
  } catch (err) {
    issues.push({
      file: relative(ROOT, file),
      level: "error",
      message: `JSON tidak valid: ${(err as Error).message}`,
    });
    continue;
  }

  const rel = relative(ROOT, file);
  const verification = (entry.verification ?? {}) as Record<string, unknown>;
  const status = verification.status;
  const productionReady = entry.production_ready === true;

  // Pull values to inspect.
  const arabic = entry.arabic as string | undefined;
  const reference = (entry.reference ?? {}) as Record<string, unknown>;
  const refSource = reference.source as string | undefined;
  const refCitation = reference.citation as string | undefined;
  const translation = (entry.translation ?? {}) as Record<string, unknown>;
  const transliteration = translation.transliteration as string | undefined;
  const translationId = translation.translation_id as string | undefined;

  if (status === "verified") {
    const checks: Array<[string, string | undefined]> = [
      ["arabic", arabic],
      ["reference.source", refSource],
      ["reference.citation", refCitation],
      ["translation.transliteration", transliteration],
      ["translation.translation_id", translationId],
    ];
    for (const [field, value] of checks) {
      if (value === VERIFIKASI) {
        issues.push({
          file: rel,
          level: "error",
          message: `verified entries cannot contain literal 'VERIFIKASI' (field: ${field}).`,
        });
      }
    }
  }

  if (productionReady && status !== "verified") {
    issues.push({
      file: rel,
      level: "error",
      message:
        "production_ready=true memerlukan verification.status='verified'.",
    });
  }

  if (typeof arabic === "string" && arabic !== VERIFIKASI) {
    // Heuristic: real Arabic text has at least one Arabic block character.
    if (!/[؀-ۿݐ-ݿࢠ-ࣿ]/.test(arabic)) {
      issues.push({
        file: rel,
        level: "warn",
        message:
          "Field 'arabic' tidak mengandung satu pun karakter Arab — kemungkinan placeholder yang salah.",
      });
    }
  }
}

const errors = issues.filter((i) => i.level === "error");
const warnings = issues.filter((i) => i.level === "warn");

if (warnings.length > 0) {
  console.warn(`\n⚠ ${warnings.length} peringatan:\n`);
  for (const w of warnings) console.warn(`  ${w.file}: ${w.message}`);
}

if (errors.length > 0) {
  console.error(`\n✗ ${errors.length} kesalahan keamanan religius:\n`);
  for (const e of errors) console.error(`  ${e.file}: ${e.message}`);
  process.exit(1);
}

console.log(
  `✓ ${files.length} berkas lolos pemeriksaan keamanan religius${
    warnings.length ? ` (${warnings.length} peringatan)` : ""
  }.`,
);
