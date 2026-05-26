import type { ReactNode } from "react";
import { useI18n } from "../hooks/useLocale";
import { useCopy } from "../hooks/useCopy";

interface CopyFieldProps {
  label: string;
  /** The string copied to the clipboard. */
  value: string;
  /**
   * Optional rendered version of the value. Useful when the displayed text
   * differs from the copied text (e.g. wrapped Arabic, prefix labels).
   */
  display?: ReactNode;
  /** Visual hint applied to the value container (e.g. "arabic" class). */
  valueClassName?: string;
  monospace?: boolean;
}

export function CopyField({
  label,
  value,
  display,
  valueClassName,
  monospace = false,
}: CopyFieldProps) {
  const { copy, copied } = useCopy();
  const { t } = useI18n();

  return (
    <section className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
          {label}
        </p>
        <button
          type="button"
          onClick={() => void copy(value)}
          aria-live="polite"
          className="focus-ring rounded-full border border-sand-200 bg-cream-100 px-2.5 py-1 text-[11px] font-medium text-clay-600 hover:bg-cream-100"
        >
          {copied ? t("entry.copy.done") : t("entry.copy.short")}
        </button>
      </div>
      <div
        className={[
          "rounded-soft border border-sand-100 bg-cream-50/60 px-4 py-3 text-sm leading-relaxed text-ink-800",
          monospace ? "font-mono text-xs" : "",
          valueClassName ?? "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {display ?? value}
      </div>
    </section>
  );
}
