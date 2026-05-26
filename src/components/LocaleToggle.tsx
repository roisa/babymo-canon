import { useI18n } from "../hooks/useLocale";

/**
 * Segmented EN / ID toggle. Sits beside ThemeToggle in the header.
 * Active language is filled; the other is plain.
 */
export function LocaleToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      role="group"
      aria-label={t("locale.aria", { name: t(`locale.name.${locale}`) })}
      className="press inline-flex h-9 items-center rounded-full border border-sand-200 bg-cream-100/70 p-0.5 text-[11px] font-semibold text-clay-600"
    >
      {(["id", "en"] as const).map((opt) => {
        const active = locale === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(opt)}
            className={
              "focus-ring rounded-full px-2.5 py-1 transition-colors " +
              (active
                ? "bg-clay-500 text-cream-50 shadow-[0_1px_2px_rgba(60,40,25,0.12)]"
                : "hover:text-ink-700")
            }
          >
            {t(`locale.${opt}`)}
          </button>
        );
      })}
    </div>
  );
}
