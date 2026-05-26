import { useI18n } from "../hooks/useLocale";
import { useConfidence } from "../hooks/useConfidence";

interface ConfidenceButtonProps {
  entryId: string;
  compact?: boolean;
}

export function ConfidenceButton({ entryId, compact }: ConfidenceButtonProps) {
  const { t } = useI18n();
  const { count, hasVoted, loading, vote } = useConfidence(entryId);

  const label = hasVoted ? t("confidence.voted") : t("confidence.cta");
  const display = count == null ? "—" : count;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        void vote();
      }}
      disabled={hasVoted || loading}
      aria-pressed={hasVoted}
      aria-label={t("confidence.aria", { label, count: count ?? 0 })}
      title={label}
      className={
        "press focus-ring inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold transition-colors " +
        (hasVoted
          ? "border-[#3F76B3] bg-[#3F76B3] text-cream-50"
          : "border-[#3F76B3]/40 bg-cream-100/70 text-[#3F76B3] hover:bg-[#3F76B3]/10 disabled:opacity-60")
      }
    >
      <VerifiedCheck active={hasVoted} />
      <span className="tabular-nums">{display}</span>
      {!compact ? (
        <span className="hidden sm:inline">{t("confidence.label")}</span>
      ) : null}
    </button>
  );
}

function VerifiedCheck({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="h-3.5 w-3.5"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.6}
      strokeLinejoin="round"
    >
      <path d="M10 1.5 11.6 3l2.1-.4.9 2 2 .9-.4 2.1L17.7 9 16.2 10.6l.4 2.1-2 .9-.9 2-2.1-.4L10 16.7 8.4 15.2l-2.1.4-.9-2-2-.9.4-2.1L2.3 9 3.8 7.4 3.4 5.3l2-.9.9-2 2.1.4L10 1.5z" />
      <path
        d="m6.5 10.2 2.4 2.3 4.6-4.8"
        fill="none"
        stroke={active ? "rgb(var(--color-cream-50))" : "currentColor"}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
