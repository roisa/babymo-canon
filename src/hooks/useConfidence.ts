import { useCallback, useEffect, useState } from "react";
import {
  fetchConfidence,
  hasVotedLocally,
  hitConfidence,
  markVotedLocally,
  readCachedCount,
  writeCachedCount,
} from "../lib/confidence";

/**
 * Subscribe-able store so that the same entry shown in the card AND the
 * modal stay in sync without each instance hammering the API.
 */
const counts = new Map<string, number>();
const inflight = new Map<string, Promise<number | null>>();
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setCount(id: string, value: number) {
  counts.set(id, value);
  writeCachedCount(id, value);
  emit();
}

async function ensureLoaded(id: string): Promise<void> {
  if (counts.has(id)) return;
  const cached = readCachedCount(id);
  if (cached !== null) counts.set(id, cached);
  if (inflight.has(id)) return;
  const p = fetchConfidence(id).then((v) => {
    if (typeof v === "number") setCount(id, v);
    inflight.delete(id);
    return v;
  });
  inflight.set(id, p);
  await p;
}

export interface UseConfidenceResult {
  count: number | null;
  hasVoted: boolean;
  /** True while the count is being fetched/hit and we have no cached value. */
  loading: boolean;
  vote: () => Promise<void>;
}

export function useConfidence(entryId: string): UseConfidenceResult {
  const [, force] = useState(0);
  const [hasVoted, setHasVoted] = useState(() => hasVotedLocally(entryId));
  const [loading, setLoading] = useState(() => !counts.has(entryId));

  useEffect(() => {
    const cb = () => force((n) => n + 1);
    listeners.add(cb);
    return () => void listeners.delete(cb);
  }, []);

  useEffect(() => {
    setHasVoted(hasVotedLocally(entryId));
    if (!counts.has(entryId)) {
      setLoading(true);
      void ensureLoaded(entryId).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [entryId]);

  const vote = useCallback(async () => {
    if (hasVotedLocally(entryId)) return;
    // Optimistic local increment so the UI is snappy even if the
    // counter API is slow or unreachable.
    const current = counts.get(entryId) ?? 0;
    setCount(entryId, current + 1);
    markVotedLocally(entryId);
    setHasVoted(true);

    const next = await hitConfidence(entryId);
    if (typeof next === "number") {
      setCount(entryId, next);
    }
  }, [entryId]);

  return {
    count: counts.get(entryId) ?? null,
    hasVoted,
    loading,
    vote,
  };
}
