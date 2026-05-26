interface HeaderProps {
  total: number;
  verified: number;
}

export function Header({ total, verified }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-sand-100 bg-cream-50/85 backdrop-blur supports-[backdrop-filter]:bg-cream-50/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex flex-col">
          <p className="text-[10px] uppercase tracking-[0.22em] text-clay-500">
            Baby Mo
          </p>
          <h1 className="text-base font-semibold text-ink-800 sm:text-lg">
            Kanon Doa, Hadis, & Ayat
          </h1>
        </div>
        <dl className="flex items-center gap-4 text-right">
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
