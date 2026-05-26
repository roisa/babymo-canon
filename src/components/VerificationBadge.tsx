import { useI18n } from "../hooks/useLocale";
import type { TKey } from "../lib/i18n";
import type { VerificationStatus } from "../lib/schema";

const labelKey: Record<VerificationStatus, TKey> = {
  verified: "status.verified",
  in_review: "status.in_review",
  needs_review: "status.needs_review",
  rejected: "status.rejected",
};

const className: Record<VerificationStatus, string> = {
  verified: "bg-sage-200 text-sage-600 border-sage-400",
  in_review: "bg-amber-100 text-amber-700 border-amber-300",
  needs_review: "bg-amber-100 text-amber-700 border-amber-300",
  rejected: "bg-stone-100 text-stone-500 border-stone-300",
};

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  const { t } = useI18n();
  const label = t(labelKey[status]);
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${className[status]}`}
      aria-label={t("status.aria", { name: label })}
    >
      {label}
    </span>
  );
}
