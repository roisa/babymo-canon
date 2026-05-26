import { useMemo } from "react";
import { loadEntries } from "./lib/loadEntries";
import type { CanonEntry, Category } from "./lib/schema";

const categoryLabel: Record<Category, string> = {
  doa: "Doa",
  hadith: "Hadis",
  ayat: "Ayat",
};

const statusLabel: Record<string, string> = {
  needs_review: "Perlu ditinjau",
  in_review: "Sedang ditinjau",
  verified: "Terverifikasi",
  rejected: "Ditolak",
};

function EntryCard({ entry }: { entry: CanonEntry }) {
  return (
    <article className="card space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wide text-clay-500">
            {categoryLabel[entry.category]}
          </p>
          <h2 className="text-lg font-semibold text-ink-800">
            {entry.title_id}
          </h2>
        </div>
        <span className="pill">{statusLabel[entry.verification.status]}</span>
      </header>

      <p className="arabic text-ink-700">{entry.arabic}</p>

      <p className="text-sm italic text-clay-600">
        {entry.translation.transliteration}
      </p>
      <p className="text-sm leading-relaxed text-ink-700">
        {entry.translation.translation_id}
      </p>

      <footer className="flex flex-wrap items-center gap-2 pt-2 text-xs text-clay-500">
        <span>
          {entry.reference.source} — {entry.reference.citation}
        </span>
        {entry.tags.map((tag) => (
          <span key={tag} className="pill bg-sage-200 text-sage-600">
            #{tag}
          </span>
        ))}
      </footer>
    </article>
  );
}

export default function App() {
  const { entries, issues } = useMemo(() => loadEntries(), []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <header className="mb-8 space-y-2 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-clay-500">
          Baby Mo
        </p>
        <h1 className="text-2xl font-semibold text-ink-800 sm:text-3xl">
          Kanon Doa, Hadis, & Ayat
        </h1>
        <p className="text-sm text-clay-600">
          Sumber rujukan internal — hanya entri yang sudah diverifikasi yang
          dianggap kanonik.
        </p>
      </header>

      {issues.length > 0 ? (
        <div className="card mb-6 border-clay-400 bg-cream-100">
          <p className="text-sm font-medium text-clay-600">
            {issues.length} entri dilewati karena tidak valid. Periksa konsol
            untuk detailnya.
          </p>
        </div>
      ) : null}

      <main className="space-y-4">
        {entries.length === 0 ? (
          <p className="text-center text-sm text-clay-500">
            Belum ada entri yang dimuat.
          </p>
        ) : (
          entries.map((entry) => <EntryCard key={entry.id} entry={entry} />)
        )}
      </main>
    </div>
  );
}
