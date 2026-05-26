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
        {/* Row 1: brand + theme toggle (toggle stays in the corner). */}
        <div className="flex items-center justify-between">
          <p className="section-header">Baby Mo</p>
          <ThemeToggle theme={theme} onCycle={onCycleTheme} />
        </div>

        {/* Row 2: large title, allowed to wrap on small screens. */}
        <h1 className="large-title mt-0.5 text-balance">
          Kanon Doa, Hadis, &amp; Ayat
        </h1>

        {/* Row 3: counts as a single subtle line. */}
        <p className="mt-1 text-xs text-clay-500">
          <span className="font-semibold tabular-nums text-ink-800">
            {total}
          </span>{" "}
          entri
          <span className="mx-1.5 text-clay-400">•</span>
          <span className="font-semibold tabular-nums text-sage-600">
            {verified}
          </span>{" "}
          <span className="text-sage-600">terverifikasi</span>
        </p>

        {/* Row 4: segmented tabs. */}
        <div
          role="tablist"
          aria-label="Pilih tampilan"
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
