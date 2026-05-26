import type { CanonEntry, Category } from "../lib/schema";
import { VerificationBadge } from "./VerificationBadge";

const categoryLabel: Record<Category, string> = {
  doa: "Doa",
  hadith: "Hadis",
  ayat: "Ayat",
};

interface EntryCardProps {
  entry: CanonEntry;
  onOpen: (entry: CanonEntry) => void;
}

export function EntryCard({ entry, onOpen }: EntryCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="card focus-ring flex h-full flex-col gap-4 text-left transition-shadow hover:shadow-md"
      aria-label={`Buka detail ${entry.title_id}`}
    >
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
    </button>
  );
}
