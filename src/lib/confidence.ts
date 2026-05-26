/**
 * Community-confidence counter (NOT the canonical religious verification).
 *
 * Anyone who lands on an entry can click "Diakui" to say "I recognize this
 * doa / I trust this reference". The count is shared across all visitors
 * via a free third-party counter API (abacus.jasoncameron.dev). Each
 * device is gated to a single click per entry via localStorage so users
 * cannot spam the count from their own browser. Bot abuse is still
 * possible — this is a soft community signal, never an editorial truth.
 *
 * Religious-safety boundary:
 *   - The count does NOT mutate entry.verification.status.
 *   - The canonical badge (sage green "Terverifikasi") only flips when an
 *     authorized reviewer merges a PR.
 *   - The community badge (blue check + N) is shown alongside but is
 *     visually and semantically distinct.
 *
 * If you want to host your own backend, replace the fetch URLs below.
 */

const API_BASE = "https://abacus.jasoncameron.dev";
const NAMESPACE = "babymo-canon";

function isOk<T>(value: unknown): value is { value: number } & T {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { value: unknown }).value === "number"
  );
}

export async function fetchConfidence(entryId: string): Promise<number | null> {
  try {
    const r = await fetch(`${API_BASE}/get/${NAMESPACE}/${entryId}`, {
      // Counter endpoint is public + idempotent; CORS allowed.
      mode: "cors",
      cache: "no-store",
    });
    if (r.status === 404) return 0; // Key not yet created — treat as zero.
    if (!r.ok) return null;
    const body = (await r.json()) as unknown;
    return isOk(body) ? body.value : null;
  } catch {
    return null;
  }
}

export async function hitConfidence(entryId: string): Promise<number | null> {
  try {
    const r = await fetch(`${API_BASE}/hit/${NAMESPACE}/${entryId}`, {
      mode: "cors",
      cache: "no-store",
    });
    if (!r.ok) return null;
    const body = (await r.json()) as unknown;
    return isOk(body) ? body.value : null;
  } catch {
    return null;
  }
}

const VOTED_KEY = (id: string) => `bm-confidence:voted:${id}`;
const COUNT_KEY = (id: string) => `bm-confidence:count:${id}`;

export function hasVotedLocally(entryId: string): boolean {
  try {
    return localStorage.getItem(VOTED_KEY(entryId)) === "1";
  } catch {
    return false;
  }
}

export function markVotedLocally(entryId: string): void {
  try {
    localStorage.setItem(VOTED_KEY(entryId), "1");
  } catch {
    /* private mode — fail open. */
  }
}

export function readCachedCount(entryId: string): number | null {
  try {
    const raw = localStorage.getItem(COUNT_KEY(entryId));
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function writeCachedCount(entryId: string, count: number): void {
  try {
    localStorage.setItem(COUNT_KEY(entryId), String(count));
  } catch {
    /* ignore. */
  }
}
