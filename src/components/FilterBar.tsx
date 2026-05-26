import { useState } from "react";
import type {
  Category,
  MemorizationLevel,
  VerificationStatus,
} from "../lib/schema";

export interface FilterState {
  categories: Set<Category>;
  types: Set<string>;
  statuses: Set<VerificationStatus>;
  memorization: Set<MemorizationLevel>;
  productionOnly: boolean;
}

interface FilterBarProps {
  state: FilterState;
  setState: (next: FilterState) => void;
  availableTypes: string[];
  activeCount: number;
}

const categoryOptions: { value: Category; label: string }[] = [
  { value: "doa", label: "Doa" },
  { value: "hadith", label: "Hadis" },
  { value: "ayat", label: "Ayat" },
];

const statusOptions: { value: VerificationStatus; label: string }[] = [
  { value: "verified", label: "Terverifikasi" },
  { value: "in_review", label: "Sedang ditinjau" },
  { value: "needs_review", label: "Perlu ditinjau" },
  { value: "rejected", label: "Ditolak" },
];

const memorizationOptions: { value: MemorizationLevel; label: string }[] = [
  { value: "easy", label: "Mudah" },
  { value: "medium", label: "Sedang" },
  { value: "hard", label: "Sulit" },
];

function toggle<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

interface ChipRowProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  selected: Set<T>;
  onToggle: (value: T) => void;
}

function ChipRow<T extends string>({
  label,
  options,
  selected,
  onToggle,
}: ChipRowProps<T>) {
  return (
    <div className="space-y-1.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
        {label}
      </p>
      <div className="-mx-1 flex flex-wrap gap-1.5 px-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            data-active={selected.has(opt.value)}
            onClick={() => onToggle(opt.value)}
            className="chip focus-ring"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FilterBar({
  state,
  setState,
  availableTypes,
  activeCount,
}: FilterBarProps) {
  const [open, setOpen] = useState(false);

  function clear() {
    setState({
      categories: new Set(),
      types: new Set(),
      statuses: new Set(),
      memorization: new Set(),
      productionOnly: false,
    });
  }

  return (
    <section className="rounded-soft border border-sand-200 bg-white/70 shadow-soft">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="focus-ring flex w-full items-center justify-between rounded-soft px-4 py-3 text-left"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-ink-800">
          Filter
          {activeCount > 0 ? (
            <span className="rounded-full bg-sage-200 px-2 py-0.5 text-[11px] font-semibold text-sage-600">
              {activeCount}
            </span>
          ) : null}
        </span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={`h-4 w-4 text-clay-500 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m5 8 5 5 5-5" />
        </svg>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-sand-100 px-4 py-4">
          <ChipRow
            label="Kategori"
            options={categoryOptions}
            selected={state.categories}
            onToggle={(v) =>
              setState({ ...state, categories: toggle(state.categories, v) })
            }
          />

          {availableTypes.length > 0 ? (
            <ChipRow
              label="Tipe"
              options={availableTypes.map((t) => ({ value: t, label: t }))}
              selected={state.types}
              onToggle={(v) =>
                setState({ ...state, types: toggle(state.types, v) })
              }
            />
          ) : null}

          <ChipRow
            label="Status verifikasi"
            options={statusOptions}
            selected={state.statuses}
            onToggle={(v) =>
              setState({ ...state, statuses: toggle(state.statuses, v) })
            }
          />

          <ChipRow
            label="Tingkat hafalan"
            options={memorizationOptions}
            selected={state.memorization}
            onToggle={(v) =>
              setState({ ...state, memorization: toggle(state.memorization, v) })
            }
          />

          <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-700">
            <input
              type="checkbox"
              checked={state.productionOnly}
              onChange={(e) =>
                setState({ ...state, productionOnly: e.target.checked })
              }
              className="focus-ring h-4 w-4 rounded border-sand-300 text-sage-600"
            />
            Hanya tampilkan yang siap produksi
          </label>

          {activeCount > 0 ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={clear}
                className="focus-ring text-xs font-medium text-clay-500 underline-offset-2 hover:text-clay-600 hover:underline"
              >
                Bersihkan semua filter
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
