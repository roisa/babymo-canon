import { useI18n } from "../hooks/useLocale";
import { useCopy } from "../hooks/useCopy";
import {
  localizedTitle,
  localizedTranslation,
  type TKey,
} from "../lib/i18n";
import type { CanonEntry, Category, UsageAssetKind } from "../lib/schema";
import { ConfidenceButton } from "./ConfidenceButton";
import { CopyField } from "./CopyField";
import { Modal } from "./Modal";
import { VerificationBadge } from "./VerificationBadge";

const categoryKey: Record<Category, TKey> = {
  doa: "category.doa",
  hadith: "category.hadith",
  ayat: "category.ayat",
};

const memorizationKey: Record<string, TKey> = {
  easy: "memorization.easy",
  medium: "memorization.medium",
  hard: "memorization.hard",
};

const assetKindKey: Record<UsageAssetKind, TKey> = {
  audio: "entry.assets.audio",
  graphic: "entry.assets.graphic",
  video: "entry.assets.video",
  doc: "entry.assets.doc",
  other: "entry.assets.other",
};

interface EntryModalProps {
  entry: CanonEntry | null;
  onClose: () => void;
}

function entryDeepLink(id: string): string {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}#/entry/${id}`;
}

function MetaRow({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-32 shrink-0 text-clay-500">{label}</span>
      <span className="min-w-0 text-ink-800">{value}</span>
    </div>
  );
}

export function EntryModal({ entry, onClose }: EntryModalProps) {
  const { t, locale } = useI18n();
  const { copy: copyAll, copied: copiedAll } = useCopy();
  const { copy: copyLink, copied: copiedLink } = useCopy();

  if (!entry) return null;

  const title = localizedTitle(entry, locale);
  const translation = localizedTranslation(entry.translation, locale);

  const referenceText = [
    entry.reference.source,
    entry.reference.citation,
    entry.reference.grading ? `(${entry.reference.grading})` : "",
  ]
    .filter(Boolean)
    .join(" — ");

  // Copy-all uses the currently-displayed translation so designers paste
  // out exactly what they see on screen.
  const allText = [
    title.value,
    entry.arabic,
    entry.translation.transliteration,
    translation.value,
    referenceText,
  ].join("\n\n");

  return (
    <Modal
      open={entry !== null}
      onClose={onClose}
      title={title.value}
      footer={
        <>
          <span className="mr-auto text-xs text-clay-500">
            {t(categoryKey[entry.category])}
            {entry.type ? ` • ${entry.type}` : ""}
          </span>
          <button
            type="button"
            onClick={() => void copyLink(entryDeepLink(entry.id))}
            className="press focus-ring rounded-full border border-sand-200 bg-cream-100/70 px-3 py-1.5 text-xs font-medium text-clay-600 hover:bg-cream-200/60"
          >
            {copiedLink ? t("entry.copy.linkDone") : t("entry.copy.link")}
          </button>
          <button
            type="button"
            onClick={() => void copyAll(allText)}
            className="press focus-ring rounded-full bg-clay-500 px-4 py-1.5 text-xs font-medium text-cream-50 hover:bg-clay-600"
          >
            {copiedAll ? t("entry.copy.done") : t("entry.copy.all")}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <VerificationBadge status={entry.verification.status} />
          <ConfidenceButton entryId={entry.id} />
          {entry.production_ready ? (
            <span className="inline-flex items-center rounded-full border border-sage-400 bg-sage-200 px-2.5 py-0.5 text-[11px] font-medium text-sage-600">
              {t("entry.production.ready")}
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-sand-200 bg-cream-100 px-2.5 py-0.5 text-[11px] font-medium text-clay-500">
              {t("entry.production.notReady")}
            </span>
          )}
          {entry.memorization_level ? (
            <span className="pill">
              {t("entry.memorizationLabel")}:{" "}
              {t(memorizationKey[entry.memorization_level])}
            </span>
          ) : null}
        </div>

        {title.fallback ? (
          <p className="text-[11px] text-clay-500">
            {t("locale.fallback.title")}
          </p>
        ) : null}

        <CopyField
          label={t("entry.copy.arabic")}
          value={entry.arabic}
          display={<p className="arabic text-ink-700">{entry.arabic}</p>}
        />

        <CopyField
          label={t("entry.copy.transliteration")}
          value={entry.translation.transliteration}
          display={
            <p className="italic text-clay-700">
              {entry.translation.transliteration}
            </p>
          }
        />

        <CopyField
          label={`${t("entry.copy.translation")} (${locale.toUpperCase()})`}
          value={translation.value}
          display={
            <>
              <p>{translation.value}</p>
              {translation.fallback ? (
                <p className="mt-1 text-[11px] text-clay-500">
                  {t("locale.fallback.translation")}
                </p>
              ) : null}
            </>
          }
        />

        <CopyField label={t("entry.copy.reference")} value={referenceText} />

        {entry.summary_id ? (
          <section>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-clay-500">
              {t("entry.summary")}
            </p>
            <p className="text-sm leading-relaxed text-ink-700">
              {entry.summary_id}
            </p>
          </section>
        ) : null}

        {entry.variant_notes ? (
          <section>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-clay-500">
              {t("entry.variantNotes")}
            </p>
            <p className="text-sm leading-relaxed text-ink-700">
              {entry.variant_notes}
            </p>
          </section>
        ) : null}

        <section className="space-y-1.5 rounded-soft border border-sand-100 bg-cream-100/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
            {t("entry.verification.section")}
          </p>
          <MetaRow
            label={t("entry.verification.status")}
            value={entry.verification.status}
          />
          <MetaRow
            label={t("entry.verification.by")}
            value={entry.verification.verified_by ?? null}
          />
          <MetaRow
            label={t("entry.verification.at")}
            value={entry.verification.verified_at ?? null}
          />
          {entry.verification.notes ? (
            <div className="pt-1 text-sm text-ink-700">
              <span className="text-clay-500">
                {t("entry.verification.reviewerNotes")}:{" "}
              </span>
              {entry.verification.notes}
            </div>
          ) : null}
        </section>

        {entry.usage_assets.length > 0 ? (
          <section className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
              {t("entry.assets.section")}
            </p>
            <ul className="space-y-1.5">
              {entry.usage_assets.map((asset, idx) => (
                <li
                  key={`${asset.url}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-soft border border-sand-100 bg-cream-100/70 px-3 py-2 text-sm"
                >
                  <span className="pill bg-cream-100 text-clay-600">
                    {t(assetKindKey[asset.kind])}
                  </span>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="focus-ring min-w-0 flex-1 truncate text-clay-600 underline-offset-2 hover:text-clay-700 hover:underline"
                  >
                    {asset.label ?? asset.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="space-y-1.5 rounded-soft border border-sand-100 bg-cream-100/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
            {t("entry.meta.section")}
          </p>
          <MetaRow label={t("entry.meta.id")} value={entry.id} />
          <MetaRow label={t("entry.meta.type")} value={entry.type ?? null} />
          <MetaRow
            label={t("entry.meta.occasion")}
            value={entry.occasion_id ?? null}
          />
          <MetaRow label={t("entry.meta.created")} value={entry.created_at} />
          <MetaRow label={t("entry.meta.updated")} value={entry.updated_at} />
          {entry.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {entry.tags.map((tag) => (
                <span key={tag} className="pill bg-sage-200 text-sage-600">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </Modal>
  );
}
