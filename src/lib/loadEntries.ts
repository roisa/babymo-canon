import type { ZodIssue } from "zod";
import {
  type CanonEntry,
  type Category,
  safeParseCanonEntry,
} from "./schema";

/**
 * Loads every canon JSON file in src/data/{doa,hadith,ayat}/*.json,
 * validates each through Zod, and drops invalid entries so the UI
 * cannot crash because of a single malformed record.
 *
 * Invalid entries are reported via grouped console.error so editors
 * can see exactly which file failed and why.
 */

export interface LoadIssue {
  filePath: string;
  errors: ZodIssue[];
}

export interface LoadResult {
  entries: CanonEntry[];
  issues: LoadIssue[];
}

const modules = import.meta.glob<{ default: unknown } | unknown>(
  "../data/**/*.json",
  { eager: true },
);

function inferCategoryFromPath(filePath: string): Category | null {
  if (filePath.includes("/doa/")) return "doa";
  if (filePath.includes("/hadith/")) return "hadith";
  if (filePath.includes("/ayat/")) return "ayat";
  return null;
}

function unwrap(mod: unknown): unknown {
  if (mod && typeof mod === "object" && "default" in (mod as Record<string, unknown>)) {
    return (mod as { default: unknown }).default;
  }
  return mod;
}

function reportIssues(issues: LoadIssue[]): void {
  if (issues.length === 0) return;
  // Single grouped report so the dev console stays tidy.
  // eslint-disable-next-line no-console
  console.group(
    `[babymo-canon] ${issues.length} entri tidak valid dan dilewati`,
  );
  for (const issue of issues) {
    // eslint-disable-next-line no-console
    console.group(issue.filePath);
    for (const error of issue.errors) {
      // eslint-disable-next-line no-console
      console.error(
        `• ${error.path.join(".") || "(root)"}: ${error.message}`,
      );
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }
  // eslint-disable-next-line no-console
  console.groupEnd();
}

let cached: LoadResult | null = null;

export function loadEntries(): LoadResult {
  if (cached) return cached;

  const entries: CanonEntry[] = [];
  const issues: LoadIssue[] = [];

  for (const [filePath, mod] of Object.entries(modules)) {
    const raw = unwrap(mod);
    const category = inferCategoryFromPath(filePath);

    // If the file lives outside the three known buckets, surface it.
    if (category === null) {
      issues.push({
        filePath,
        errors: [
          {
            code: "custom",
            path: [],
            message:
              "File JSON berada di luar folder kategori (doa/hadith/ayat).",
          } as ZodIssue,
        ],
      });
      continue;
    }

    const result = safeParseCanonEntry(raw);
    if (!result.success) {
      issues.push({ filePath, errors: result.errors });
      continue;
    }

    // Defensive: refuse entries whose category disagrees with their folder.
    if (result.data.category !== category) {
      issues.push({
        filePath,
        errors: [
          {
            code: "custom",
            path: ["category"],
            message: `Kategori "${result.data.category}" tidak cocok dengan folder "${category}".`,
          } as ZodIssue,
        ],
      });
      continue;
    }

    entries.push(result.data);
  }

  // Stable sort: category then title.
  entries.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    return a.title_id.localeCompare(b.title_id, "id");
  });

  reportIssues(issues);

  cached = { entries, issues };
  return cached;
}
