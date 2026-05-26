import { useI18n } from "../hooks/useLocale";
import type { Theme } from "../hooks/useTheme";
import { LocaleToggle } from "./LocaleToggle";
import { ThemeToggle } from "./ThemeToggle";

export type View = "library" | "add";

interface HeaderProps {
  total: number;
  verified: number;
  view: View;
  onChangeView: (view: View) => void;
  theme: Theme;
  onCycleTheme: () => void;
}

export function Header({
  total,
  verified,
  view,
  onChangeView,
  theme,
  onCycleTheme,
}: HeaderProps) {
  const { t } = useI18n();

  const tabs: { id: View; label: string }[] = [
    { id: "library", label: t("header.tabs.library") },
    { id: "add", label: t("header.tabs.add") },
  ];

  return (
    <header className="no-print sticky top-0 z-20 border-b border-sand-100/80 bg-cream-50/80 backdrop-blur-xl supports-[backdrop-filter]:bg-cream-50/60">
      <div className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6">
        {/* Row 1: brand + controls. */}
        <div className="flex items-center justify-between gap-2">
          <p className="section-header">{t("header.brand")}</p>
          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle theme={theme} onCycle={onCycleTheme} />
          </div>
        </div>

        {/* Row 2: large title. */}
        <h1 className="large-title mt-0.5 text-balance">{t("header.title")}</h1>

        {/* Row 3: counts. */}
        <p className="mt-1 text-xs text-clay-500">
          <span className="font-semibold tabular-nums text-ink-800">
            {total}
          </span>{" "}
          {t("header.counts.entries")}
          <span className="mx-1.5 text-clay-400">•</span>
          <span className="font-semibold tabular-nums text-sage-600">
            {verified}
          </span>{" "}
          <span className="text-sage-600">{t("header.counts.verified")}</span>
        </p>

        {/* Row 4: segmented tabs. */}
        <div
          role="tablist"
          aria-label={t("header.tabs.library") + " / " + t("header.tabs.add")}
          className="relative mt-3 grid w-full grid-cols-2 rounded-full bg-sand-100/80 p-1 text-[13px] font-medium text-clay-600 backdrop-blur"
        >
          {tabs.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                onClick={() => onChangeView(tab.id)}
                className={
                  "press focus-ring rounded-full px-4 py-1.5 transition-colors " +
                  (active
                    ? "bg-cream-50 text-ink-800 shadow-[0_1px_2px_rgba(60,40,25,0.12)]"
                    : "hover:text-ink-700")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <div className="h-3" />
      </div>
    </header>
  );
}
