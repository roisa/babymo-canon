import type Fuse from "fuse.js";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import type { FilterState } from "../components/FilterBar";
import { normalizeSearchText } from "../lib/normalize";
import type { CanonEntry } from "../lib/schema";

/**
 * Search/filter orchestration.
 *
 * - Fuse.js is dynamically imported so the homepage paints before the
 *   library arrives. We prefetch it on first focus of the search input
 *   so by the time the user types a character, Fuse is ready.
 * - Strings are normalized (diacritic-folded, transliteration-folded)
 *   on both sides of the index so "do'a" finds "doa", etc.
 * - Filters are applied AFTER text search so relevance ranking is
 *   preserved; filters only remove rows, they don't reorder.
 */

interface IndexedEntry {
  entry: CanonEntry;
  haystack: {
    title_id: string;
    translation_id: string;
    transliteration: string;
    tags: string;
    reference: string;
    arabic: string;
  };
}

function buildIndex(entries: CanonEntry[]): IndexedEntry[] {
  return entries.map((entry) => ({
    entry,
    haystack: {
      title_id: normalizeSearchText(entry.title_id),
      translation_id: normalizeSearchText(entry.translation.translation_id),
      transliteration: normalizeSearchText(entry.translation.transliteration),
      tags: normalizeSearchText(entry.tags.join(" ")),
      reference: normalizeSearchText(
        `${entry.reference.source} ${entry.reference.citation}`,
      ),
      arabic: entry.arabic,
    },
  }));
}

const fuseOptions = {
  threshold: 0.35,
  ignoreLocation: true,
  minMatchCharLength: 2,
  includeScore: false,
  keys: [
    { name: "haystack.title_id", weight: 3 },
    { name: "haystack.translation_id", weight: 2 },
    { name: "haystack.transliteration", weight: 2 },
    { name: "haystack.tags", weight: 1.5 },
    { name: "haystack.reference", weight: 1 },
    { name: "haystack.arabic", weight: 1 },
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
  /** Set to true once the user has focused the search input. */
  prefetchSearch?: boolean;
}

export interface SearchResult {
  results: CanonEntry[];
  availableTypes: string[];
  /** True while Fuse is still loading after a query has been typed. */
  searching: boolean;
}

export function useCanonSearch({
  entries,
  query,
  filters,
  prefetchSearch = false,
}: SearchInput): SearchResult {
  const deferredQuery = useDeferredValue(query);

  const indexed = useMemo(() => buildIndex(entries), [entries]);

  const [fuse, setFuse] = useState<Fuse<IndexedEntry> | null>(null);
  const loadStarted = useRef(false);

  // Kick off the Fuse import either when the user has focused the search
  // box, or as soon as they type. Either way it happens lazily — first
  // paint never blocks on it.
  useEffect(() => {
    const want = prefetchSearch || deferredQuery.trim().length > 0;
    if (!want || loadStarted.current) return;
    loadStarted.current = true;
    void import("fuse.js").then(({ default: FuseCtor }) => {
      setFuse(new FuseCtor(indexed, fuseOptions));
    });
  }, [prefetchSearch, deferredQuery, indexed]);

  // Rebuild Fuse when entries change.
  useEffect(() => {
    if (!fuse) return;
    fuse.setCollection(indexed);
  }, [indexed, fuse]);

  const searched = useMemo<{ list: CanonEntry[]; searching: boolean }>(() => {
    const q = normalizeSearchText(deferredQuery);
    if (!q) return { list: entries, searching: false };
    if (!fuse) return { list: entries, searching: true };
    return {
      list: fuse.search(q).map((r) => r.item.entry),
      searching: false,
    };
  }, [entries, fuse, deferredQuery]);

  const results = useMemo(
    () => searched.list.filter((entry) => applyFilters(entry, filters)),
    [searched.list, filters],
  );

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    for (const e of entries) if (e.type) set.add(e.type);
    return [...set].sort();
  }, [entries]);

  return { results, availableTypes, searching: searched.searching };
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
