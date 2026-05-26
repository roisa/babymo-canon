import { useI18n } from "../hooks/useLocale";
import type { TKey } from "../lib/i18n";
import { localizedTitle, localizedTranslation } from "../lib/i18n";
import type { CanonEntry, Category } from "../lib/schema";
import { ConfidenceButton } from "./ConfidenceButton";
import { VerificationBadge } from "./VerificationBadge";

const categoryKey: Record<Category, TKey> = {
  doa: "category.doa",
  hadith: "category.hadith",
  ayat: "category.ayat",
};

interface EntryCardProps {
  entry: CanonEntry;
  onOpen: (entry: CanonEntry) => void;
}

export function EntryCard({ entry, onOpen }: EntryCardProps) {
  const { t, locale } = useI18n();
  const title = localizedTitle(entry, locale);
  const translation = localizedTranslation(entry.translation, locale);

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="card press focus-ring flex h-full flex-col gap-4 text-left transition-shadow hover:shadow-md"
      aria-label={t("entry.open.aria", { title: title.value })}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.06em] text-clay-500">
            {t(categoryKey[entry.category])}
            {entry.type ? ` • ${entry.type}` : null}
          </p>
          <div className="flex items-center gap-1.5">
            <h2 className="truncate text-[17px] font-semibold leading-snug text-ink-800">
              {title.value}
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
        {translation.value}
        {translation.fallback ? (
          <span className="ml-1 text-[11px] text-clay-400">
            {t("locale.fallback.translation")}
          </span>
        ) : null}
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
