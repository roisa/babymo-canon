import { useEffect, useMemo, useState } from "react";
import { AddEntryForm } from "./components/AddEntryForm";
import { EmptyState } from "./components/EmptyState";
import { EntryCard } from "./components/EntryCard";
import { EntryModal } from "./components/EntryModal";
import { FilterBar, type FilterState } from "./components/FilterBar";
import { Footer } from "./components/Footer";
import { Header, type View } from "./components/Header";
import { SearchBar } from "./components/SearchBar";
import {
  countActiveFilters,
  emptyFilters,
  useCanonSearch,
} from "./hooks/useCanonSearch";
import { loadEntries } from "./lib/loadEntries";
import type { CanonEntry } from "./lib/schema";

function parseHash(hash: string): { view: View; entryId: string | null } {
  // Supported shapes:
  //   #/add               -> Add entry view
  //   #/entry/<id>        -> Library view with modal open
  //   anything else       -> Library view
  const normalized = hash.replace(/^#\/?/, "");
  if (normalized === "add") return { view: "add", entryId: null };
  const m = normalized.match(/^entry\/([a-z0-9-]+)$/i);
  if (m) return { view: "library", entryId: m[1] };
  return { view: "library", entryId: null };
}

function writeHash(view: View, entryId: string | null) {
  let next = "";
  if (view === "add") next = "#/add";
  else if (entryId) next = `#/entry/${entryId}`;
  if (window.location.hash !== next) {
    history.pushState(null, "", next || window.location.pathname + window.location.search);
  }
}

export default function App() {
  const { entries, issues } = useMemo(() => loadEntries(), []);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>(emptyFilters);

  const initial = useMemo(() => parseHash(window.location.hash), []);
  const [view, setView] = useState<View>(initial.view);
  const [selectedId, setSelectedId] = useState<string | null>(initial.entryId);

  // Reflect view + selection in the URL hash so the browser back button
  // closes the modal / leaves the add view as users expect.
  useEffect(() => {
    writeHash(view, selectedId);
  }, [view, selectedId]);

  useEffect(() => {
    function onPop() {
      const parsed = parseHash(window.location.hash);
      setView(parsed.view);
      setSelectedId(parsed.entryId);
    }
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);

  const { results, availableTypes } = useCanonSearch({
    entries,
    query,
    filters,
  });

  const verifiedCount = useMemo(
    () => entries.filter((e) => e.verification.status === "verified").length,
    [entries],
  );

  const selectedEntry = useMemo<CanonEntry | null>(() => {
    if (!selectedId) return null;
    return entries.find((e) => e.id === selectedId) ?? null;
  }, [entries, selectedId]);

  const activeFilterCount = countActiveFilters(filters);
  const hasQueryOrFilters = query.trim().length > 0 || activeFilterCount > 0;

  function resetAll() {
    setQuery("");
    setFilters(emptyFilters());
  }

  return (
    <div className="min-h-screen pb-16">
      <Header
        total={entries.length}
        verified={verifiedCount}
        view={view}
        onChangeView={(v) => {
          setView(v);
          if (v === "add") setSelectedId(null);
        }}
      />

      {view === "library" ? (
        <main className="mx-auto max-w-6xl space-y-4 px-4 py-6 sm:px-6">
          <div className="no-print space-y-4">
            <SearchBar value={query} onChange={setQuery} />
            <FilterBar
              state={filters}
              setState={setFilters}
              availableTypes={availableTypes}
              activeCount={activeFilterCount}
            />
          </div>

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
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onOpen={(e) => setSelectedId(e.id)}
                />
              ))}
            </div>
          )}
        </main>
      ) : (
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <div className="mb-4 space-y-1">
            <h2 className="text-lg font-semibold text-ink-800">
              Tambah entri kanon
            </h2>
            <p className="text-sm text-clay-600">
              Aplikasi ini tidak menulis berkas. Isi formulir di bawah, salin
              JSON, lalu buka Pull Request untuk peninjauan.
            </p>
          </div>
          <AddEntryForm />
        </main>
      )}

      <EntryModal
        entry={selectedEntry}
        onClose={() => setSelectedId(null)}
      />

      <Footer />
    </div>
  );
}
