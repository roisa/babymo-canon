import { useI18n } from "../hooks/useLocale";
import type { TKey } from "../lib/i18n";
import type { Theme } from "../hooks/useTheme";

const nameKey: Record<Theme, TKey> = {
  system: "theme.system",
  light: "theme.light",
  dark: "theme.dark",
};

const icon: Record<Theme, JSX.Element> = {
  system: (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM7 17h6" />
    </svg>
  ),
  light: (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="10" cy="10" r="3.5" />
      <path strokeLinecap="round" d="M10 2v2M10 16v2M2 10h2M16 10h2M4.5 4.5l1.4 1.4M14.1 14.1l1.4 1.4M4.5 15.5l1.4-1.4M14.1 5.9l1.4-1.4" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 20 20" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.5A6.5 6.5 0 1 1 8.5 5a5 5 0 0 0 6.5 6.5z" />
    </svg>
  ),
};

interface ThemeToggleProps {
  theme: Theme;
  onCycle: () => void;
}

export function ThemeToggle({ theme, onCycle }: ThemeToggleProps) {
  const { t } = useI18n();
  const aria = t("theme.aria", { name: t(nameKey[theme]) });
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={aria}
      title={t(nameKey[theme])}
      className="press focus-ring grid h-9 w-9 place-items-center rounded-full border border-sand-200 bg-cream-100/70 text-clay-600 hover:bg-cream-200/60"
    >
      <span className="h-4 w-4">{icon[theme]}</span>
    </button>
  );
}
