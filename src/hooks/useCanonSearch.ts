import Fuse from "fuse.js";
import { useDeferredValue, useMemo } from "react";
import type { CanonEntry } from "../lib/schema";
import type { FilterState } from "../components/FilterBar";

const fuseOptions: ConstructorParameters<typeof Fuse<CanonEntry>>[1] = {
  // Conservative threshold: tolerant of typos without producing noise.
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: false,
  keys: [
    { name: "title_id", weight: 3 },
    { name: "translation.translation_id", weight: 2 },
    { name: "translation.transliteration", weight: 2 },
    { name: "tags", weight: 1.5 },
    { name: "reference.source", weight: 1 },
    { name: "reference.citation", weight: 1 },
    { name: "arabic", weight: 1 },
  ],
};

function applyFilters(entry: CanonEntry, filters: FilterState): boolean {
  if (filters.categories.size > 0 && !filters.categories.has(entry.category)) {
    return false;
  }
  if (filters.types.size > 0) {
    if (!entry.type || !filters.types.has(entry.type)) return false;
  }
  if (
    filters.statuses.size > 0 &&
    !filters.statuses.has(entry.verification.status)
  ) {
    return false;
  }
  if (filters.memorization.size > 0) {
    if (
      !entry.memorization_level ||
      !filters.memorization.has(entry.memorization_level)
    ) {
      return false;
    }
  }
  if (filters.productionOnly && !entry.production_ready) return false;
  return true;
}

export interface SearchInput {
  entries: CanonEntry[];
  query: string;
  filters: FilterState;
}

export interface SearchResult {
  results: CanonEntry[];
  /** All distinct `type` values present in the dataset, sorted. */
  availableTypes: string[];
}

export function useCanonSearch({
  entries,
  query,
  filters,
}: SearchInput): SearchResult {
  // useDeferredValue lets fast typists keep the input snappy even if
  // result rendering is expensive; Fuse itself is cheap at our scale.
  const deferredQuery = useDeferredValue(query);

  const fuse = useMemo(
    () => new Fuse(entries, fuseOptions),
    [entries],
  );

  const searched = useMemo(() => {
    const q = deferredQuery.trim();
    if (!q) return entries;
    return fuse.search(q).map((r) => r.item);
  }, [entries, fuse, deferredQuery]);

  const results = useMemo(
    () => searched.filter((entry) => applyFilters(entry, filters)),
    [searched, filters],
  );

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) if (e.type) set.add(e.type);
    return [...set].sort();
  }, [entries]);

  return { results, availableTypes };
}

export function countActiveFilters(filters: FilterState): number {
  return (
    filters.categories.size +
    filters.types.size +
    filters.statuses.size +
    filters.memorization.size +
    (filters.productionOnly ? 1 : 0)
  );
}

export function emptyFilters(): FilterState {
  return {
    categories: new Set(),
    types: new Set(),
    statuses: new Set(),
    memorization: new Set(),
    productionOnly: false,
  };
}
