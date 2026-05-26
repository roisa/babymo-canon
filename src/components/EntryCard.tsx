import { useState } from "react";
import type { CanonEntry, Category } from "../lib/schema";
import { VerificationBadge } from "./VerificationBadge";

const categoryLabel: Record<Category, string> = {
  doa: "Doa",
  hadith: "Hadis",
  ayat: "Ayat",
};

interface EntryCardProps {
  entry: CanonEntry;
}

async function copyText(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    return false;
  }
}

export function EntryCard({ entry }: EntryCardProps) {
  const [copied, setCopied] = useState<null | "arabic" | "all">(null);

  function handleCopy(kind: "arabic" | "all") {
    const payload =
      kind === "arabic"
        ? entry.arabic
        : [
            entry.title_id,
            entry.arabic,
            entry.translation.transliteration,
            entry.translation.translation_id,
            `${entry.reference.source} — ${entry.reference.citation}`,
          ].join("\n\n");
    void copyText(payload).then((ok) => {
      if (ok) {
        setCopied(kind);
        window.setTimeout(() => setCopied(null), 1500);
      }
    });
  }

  return (
    <article className="card flex h-full flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-clay-500">
            {categoryLabel[entry.category]}
            {entry.type ? ` • ${entry.type}` : null}
          </p>
          <h2 className="truncate text-base font-semibold text-ink-800">
            {entry.title_id}
          </h2>
        </div>
        <VerificationBadge status={entry.verification.status} />
      </header>

      <p className="arabic text-ink-700">{entry.arabic}</p>

      <p className="text-center text-sm italic text-clay-600">
        {entry.translation.transliteration}
      </p>
      <p className="text-sm leading-relaxed text-ink-700">
        {entry.translation.translation_id}
      </p>

      <p className="text-xs text-clay-500">
        {entry.reference.source} — {entry.reference.citation}
        {entry.reference.grading ? ` (${entry.reference.grading})` : null}
      </p>

      {entry.tags.length > 0 ? (
        <div className="flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span key={tag} className="pill bg-sage-200 text-sage-600">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => handleCopy("arabic")}
          className="focus-ring rounded-full border border-sand-200 bg-white px-3 py-1.5 text-xs font-medium text-clay-600 hover:bg-cream-100"
        >
          {copied === "arabic" ? "Tersalin ✓" : "Salin Arab"}
        </button>
        <button
          type="button"
          onClick={() => handleCopy("all")}
          className="focus-ring rounded-full bg-clay-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-clay-600"
        >
          {copied === "all" ? "Tersalin ✓" : "Salin semua"}
        </button>
      </div>
    </article>
  );
}
