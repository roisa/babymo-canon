import { useMemo, useState } from "react";
import { EmptyState } from "./components/EmptyState";
import { EntryCard } from "./components/EntryCard";
import { FilterBar, type FilterState } from "./components/FilterBar";
import { Header } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import {
  countActiveFilters,
  emptyFilters,
  useCanonSearch,
} from "./hooks/useCanonSearch";
import { loadEntries } from "./lib/loadEntries";

export default function App() {
  const { entries, issues } = useMemo(() => loadEntries(), []);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const { results, availableTypes } = useCanonSearch({
    entries,
    query,
    filters,
  });

  const verifiedCount = useMemo(
    () => entries.filter((e) => e.verification.status === "verified").length,
    [entries],
  );

  const activeFilterCount = countActiveFilters(filters);
  const hasQueryOrFilters = query.trim().length > 0 || activeFilterCount > 0;

  function resetAll() {
    setQuery("");
    setFilters(emptyFilters());
  }

  return (
    <div className="min-h-screen pb-16">
      <Header total={entries.length} verified={verifiedCount} />

      <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
        <SearchBar value={query} onChange={setQuery} />

        <FilterBar
          state={filters}
          setState={setFilters}
          availableTypes={availableTypes}
          activeCount={activeFilterCount}
        />

        {issues.length > 0 ? (
          <EmptyState variant="load-error" issueCount={issues.length} />
        ) : null}

        <p className="px-1 text-xs text-clay-500">
          Menampilkan {results.length} dari {entries.length} entri.
        </p>

        {entries.length === 0 ? (
          <EmptyState variant="no-entries" />
        ) : results.length === 0 ? (
          <EmptyState
            variant="no-results"
            onReset={hasQueryOrFilters ? resetAll : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
