import type { VerificationStatus } from "../lib/schema";

const map: Record<
  VerificationStatus,
  { label: string; className: string }
> = {
  verified: {
    label: "Terverifikasi",
    className: "bg-sage-200 text-sage-600 border-sage-400",
  },
  in_review: {
    label: "Sedang ditinjau",
    className: "bg-amber-100 text-amber-700 border-amber-300",
  },
  needs_review: {
    label: "Perlu ditinjau",
    className: "bg-amber-100 text-amber-700 border-amber-300",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-stone-100 text-stone-500 border-stone-300",
  },
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const cfg = map[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.className}`}
      aria-label={`Status verifikasi: ${cfg.label}`}
    >
      {cfg.label}
    </span>
  );
}
