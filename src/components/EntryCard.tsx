import type { CanonEntry, Category } from "../lib/schema";
import { ConfidenceButton } from "./ConfidenceButton";
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
      className="card press focus-ring flex h-full flex-col gap-4 text-left transition-shadow hover:shadow-md"
      aria-label={`Buka detail ${entry.title_id}`}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-clay-500">
            {categoryLabel[entry.category]}
            {entry.type ? ` • ${entry.type}` : null}
          </p>
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-[17px] font-semibold leading-snug text-ink-800">
              {entry.title_id}
            </h2>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <VerificationBadge status={entry.verification.status} />
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4 text-clay-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m7 5 5 5-5 5" />
            </svg>
          </div>
          <ConfidenceButton entryId={entry.id} compact />
        </div>
      </header>

      <p className="arabic text-ink-700">{entry.arabic}</p>

      <p className="text-center text-[13px] italic text-clay-600">
        {entry.translation.transliteration}
      </p>
      <p className="text-[15px] leading-relaxed text-ink-700">
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
