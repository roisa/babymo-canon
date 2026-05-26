import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

/**
 * Lightweight, accessible iOS-style modal sheet.
 *  - Mobile: sheet pinned to the bottom with a drag indicator
 *  - Desktop: centered dialog
 *  - Escape and backdrop click close it
 *  - Body scroll locked while open, focus restored on close
 */
export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  const doneRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    doneRef.current?.focus();
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
      className="no-print fixed inset-0 z-40 flex items-end justify-center bg-ink-800/40 backdrop-blur-md sm:items-center"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-[24px] bg-cream-50/95 shadow-ios backdrop-blur-xl sm:rounded-ios"
      >
        {/* iOS drag indicator (visible on mobile only). */}
        <div className="flex justify-center pt-2 sm:hidden" aria-hidden="true">
          <span className="h-1 w-9 rounded-full bg-sand-300/80" />
        </div>

        <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-3 sm:px-5">
          <span className="hidden sm:block" />
          <h2
            id="modal-title"
            className="col-start-2 truncate text-center text-[15px] font-semibold text-ink-800"
          >
            {title}
          </h2>
          <div className="col-start-3 flex justify-end">
            <button
              ref={doneRef}
              type="button"
              onClick={onClose}
              className="press focus-ring rounded-full px-3 py-1 text-[15px] font-medium text-clay-600 hover:text-clay-700"
            >
              Selesai
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-5 pt-1 sm:px-5">
          {children}
        </div>

        {footer ? (
          <footer className="flex flex-wrap items-center justify-end gap-2 border-t border-sand-100/80 bg-white/60 px-4 py-3 sm:px-5">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
