export type View = "library" | "add";

interface HeaderProps {
  total: number;
  verified: number;
  view: View;
  onChangeView: (view: View) => void;
}

const tabs: { id: View; label: string }[] = [
  { id: "library", label: "Pustaka" },
  { id: "add", label: "Tambah" },
];

export function Header({ total, verified, view, onChangeView }: HeaderProps) {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-sand-100 bg-cream-50/85 backdrop-blur supports-[backdrop-filter]:bg-cream-50/70">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex min-w-0 flex-col">
          <p className="text-[10px] uppercase tracking-[0.22em] text-clay-500">
            Baby Mo
          </p>
          <h1 className="text-base font-semibold text-ink-800 sm:text-lg">
            Kanon Doa, Hadis, & Ayat
          </h1>
        </div>

        <div
          role="tablist"
          aria-label="Pilih tampilan"
          className="order-3 inline-flex w-full rounded-full border border-sand-200 bg-white p-1 text-xs font-medium text-clay-600 sm:order-2 sm:w-auto"
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
                  "focus-ring flex-1 rounded-full px-4 py-1.5 transition-colors sm:flex-none " +
                  (active
                    ? "bg-clay-500 text-white shadow-soft"
                    : "hover:bg-cream-100")
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <dl className="order-2 flex items-center gap-4 text-right sm:order-3">
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
      </div>
    </header>
  );
}
