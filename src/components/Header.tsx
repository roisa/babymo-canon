import type { Theme } from "../hooks/useTheme";
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

const tabs: { id: View; label: string }[] = [
  { id: "library", label: "Pustaka" },
  { id: "add", label: "Tambah" },
];

export function Header({
  total,
  verified,
  view,
  onChangeView,
  theme,
  onCycleTheme,
}: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-sand-100/80 bg-cream-50/80 backdrop-blur-xl supports-[backdrop-filter]:bg-cream-50/60">
      <div className="mx-auto w-full max-w-6xl px-4 pt-3 sm:px-6">
        <div className="flex items-end justify-between gap-3 pb-3">
          <div className="min-w-0">
            <p className="section-header">Baby Mo</p>
            <h1 className="large-title truncate">
              Kanon Doa, Hadis, &amp; Ayat
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <dl className="flex items-center gap-3 text-right">
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-clay-500">
                  Total
                </dt>
                <dd className="text-sm font-semibold tabular-nums text-ink-800">
                  {total}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-wide text-sage-600">
                  Terverifikasi
                </dt>
                <dd className="text-sm font-semibold tabular-nums text-sage-600">
                  {verified}
                </dd>
              </div>
            </dl>
            <ThemeToggle theme={theme} onCycle={onCycleTheme} />
          </div>
        </div>

        <div
          role="tablist"
          aria-label="Pilih tampilan"
          className="relative grid w-full grid-cols-2 rounded-full bg-sand-100/80 p-1 text-[13px] font-medium text-clay-600 backdrop-blur"
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
