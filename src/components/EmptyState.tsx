export type EmptyVariant = "no-results" | "no-entries" | "load-error";

interface EmptyStateProps {
  variant: EmptyVariant;
  issueCount?: number;
  onReset?: () => void;
}

const copy: Record<
  EmptyVariant,
  { title: string; body: string; cta?: string }
> = {
  "no-results": {
    title: "Tidak ada hasil yang cocok",
    body: "Coba sederhanakan kata pencarian atau bersihkan filter aktif.",
    cta: "Bersihkan pencarian & filter",
  },
  "no-entries": {
    title: "Belum ada entri kanon",
    body: "Tambahkan berkas JSON di src/data/{doa,hadith,ayat} dan jalankan npm run validate:canon.",
  },
  "load-error": {
    title: "Beberapa entri tidak dapat dimuat",
    body: "Periksa konsol untuk daftar berkas yang gagal divalidasi. Aplikasi tetap berjalan dengan entri yang valid.",
  },
};

export function EmptyState({ variant, issueCount, onReset }: EmptyStateProps) {
  const text = copy[variant];

  return (
    <div className="card flex flex-col items-center gap-3 py-10 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-cream-100 text-clay-500">
        {variant === "load-error" ? (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.5M12 16h.01M4.5 19h15a1.5 1.5 0 0 0 1.3-2.25l-7.5-13a1.5 1.5 0 0 0-2.6 0l-7.5 13A1.5 1.5 0 0 0 4.5 19Z"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="11" cy="11" r="6.5" />
            <path strokeLinecap="round" d="m20 20-3.6-3.6" />
          </svg>
        )}
      </div>
      <h3 className="text-sm font-semibold text-ink-800">{text.title}</h3>
      <p className="max-w-sm text-sm text-clay-600">{text.body}</p>
      {variant === "load-error" && typeof issueCount === "number" ? (
        <p className="text-xs text-clay-500">{issueCount} berkas dilewati.</p>
      ) : null}
      {text.cta && onReset ? (
        <button
          type="button"
          onClick={onReset}
          className="focus-ring mt-1 rounded-full bg-clay-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-clay-600"
        >
          {text.cta}
        </button>
      ) : null}
    </div>
  );
}
