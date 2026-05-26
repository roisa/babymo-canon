import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Optional content rendered in the modal footer (right-aligned). */
  footer?: ReactNode;
}

/**
 * Lightweight, accessible modal.
 *  - Escape and backdrop click close it
 *  - Body scroll is locked while open
 *  - Focus moves to the close button on open and is restored on close
 *  - Inert "no-print" hint excludes the modal from print output
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="no-print fixed inset-0 z-40 flex items-end justify-center bg-ink-800/40 backdrop-blur-sm sm:items-center"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-soft bg-cream-50 shadow-soft sm:rounded-soft"
      >
        <header className="flex items-start justify-between gap-4 border-b border-sand-100 px-5 py-4">
          <h2
            id="modal-title"
            className="min-w-0 truncate text-base font-semibold text-ink-800"
          >
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="focus-ring -m-2 grid h-9 w-9 place-items-center rounded-full text-clay-500 hover:bg-cream-100 hover:text-clay-600"
          >
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path strokeLinecap="round" d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>

        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-sand-100 bg-white/60 px-5 py-3">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
