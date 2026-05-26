#!/usr/bin/env tsx
/**
 * validateCanon.ts
 *
 * Validates every src/data/{doa,hadith,ayat}/*.json file against the
 * CanonEntry Zod schema. Exits with a non-zero status code if any file
 * fails validation, so CI (and pre-commit hooks) can block bad data.
 *
 * Usage: npm run validate:canon
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { CanonEntrySchema, type Category } from "../src/lib/schema";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const ROOT = resolve(__dirname, "..");
const DATA_ROOT = join(ROOT, "src", "data");
const CATEGORIES: Category[] = ["doa", "hadith", "ayat"];

interface FileFailure {
  filePath: string;
  message: string;
}

function walkJsonFiles(dir: string): string[] {
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
    if (stat.isDirectory()) {
      out.push(...walkJsonFiles(full));
    } else if (stat.isFile() && name.endsWith(".json")) {
      out.push(full);
    }
  }
  return out;
}

function main(): void {
  const failures: FileFailure[] = [];
  let okCount = 0;

  for (const category of CATEGORIES) {
    const dir = join(DATA_ROOT, category);
    const files = walkJsonFiles(dir);

    for (const file of files) {
      const rel = relative(ROOT, file);
      let raw: unknown;
      try {
        raw = JSON.parse(readFileSync(file, "utf-8"));
      } catch (err) {
        failures.push({
          filePath: rel,
          message: `JSON tidak valid: ${(err as Error).message}`,
        });
        continue;
      }

      const result = CanonEntrySchema.safeParse(raw);
      if (!result.success) {
        for (const issue of result.error.issues) {
          failures.push({
            filePath: rel,
            message: `${issue.path.join(".") || "(root)"}: ${issue.message}`,
          });
        }
        continue;
      }

      if (result.data.category !== category) {
        failures.push({
          filePath: rel,
          message: `Kategori "${result.data.category}" tidak cocok dengan folder "${category}".`,
        });
        continue;
      }

      okCount += 1;
    }
  }

  if (failures.length > 0) {
    const byFile = new Map<string, string[]>();
    for (const f of failures) {
      const list = byFile.get(f.filePath) ?? [];
      list.push(f.message);
      byFile.set(f.filePath, list);
    }
    console.error(
      `\n✗ Validasi gagal untuk ${byFile.size} berkas (${failures.length} masalah):\n`,
    );
    for (const [file, messages] of byFile) {
      console.error(`  ${file}`);
      for (const m of messages) {
        console.error(`    • ${m}`);
      }
    }
    console.error(`\n  ${okCount} berkas valid.\n`);
    process.exit(1);
  }

  console.log(`✓ ${okCount} entri kanon valid.`);
}

main();
