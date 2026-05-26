import { useI18n } from "../hooks/useLocale";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
}

export function SearchBar({ value, onChange, onFocus }: SearchBarProps) {
  const { t } = useI18n();
  return (
    <label className="relative block">
      <span className="sr-only">{t("search.aria")}</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-clay-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="9" cy="9" r="6" />
        <path strokeLinecap="round" d="m17 17-3.2-3.2" />
      </svg>
      <input
        type="search"
        inputMode="search"
        autoComplete="off"
        spellCheck={false}
        placeholder={t("search.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        aria-controls="results"
        className="focus-ring w-full rounded-soft border border-sand-200 bg-cream-100/80 py-3 pl-10 pr-10 text-sm text-ink-800 placeholder:text-clay-400 shadow-soft"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={t("search.clear")}
          className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-clay-400 hover:bg-cream-100 hover:text-clay-600"
        >
          <svg
            viewBox="0 0 20 20"
            aria-hidden="true"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      ) : null}
    </label>
  );
}
