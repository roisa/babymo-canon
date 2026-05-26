import { useI18n } from "../hooks/useLocale";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="no-print mx-auto mt-12 max-w-6xl px-4 pb-8 pt-6 sm:px-6">
      <div className="flex flex-col items-center gap-1 text-center">
        <p className="text-[12px] text-clay-500">
          {t("footer.powered")}{" "}
          <a
            href="https://ibracreative.com"
            target="_blank"
            rel="noreferrer noopener"
            className="focus-ring rounded-sm font-medium text-clay-600 underline-offset-2 hover:underline"
          >
            ibracreative.com
          </a>
        </p>
        <p className="text-[11px] text-clay-400">{t("footer.tagline")}</p>
      </div>
    </footer>
  );
}
