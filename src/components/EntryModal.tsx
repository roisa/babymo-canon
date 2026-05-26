import type { CanonEntry, Category, UsageAssetKind } from "../lib/schema";
import { useCopy } from "../hooks/useCopy";
import { CopyField } from "./CopyField";
import { Modal } from "./Modal";
import { VerificationBadge } from "./VerificationBadge";

const categoryLabel: Record<Category, string> = {
  doa: "Doa",
  hadith: "Hadis",
  ayat: "Ayat",
};

const memorizationLabel: Record<string, string> = {
  easy: "Mudah",
  medium: "Sedang",
  hard: "Sulit",
};

const assetKindLabel: Record<UsageAssetKind, string> = {
  audio: "Audio",
  graphic: "Grafis",
  video: "Video",
  doc: "Dokumen",
  other: "Lainnya",
};

interface EntryModalProps {
  entry: CanonEntry | null;
  onClose: () => void;
}

function MetaRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 text-sm">
      <span className="w-32 shrink-0 text-clay-500">{label}</span>
      <span className="min-w-0 text-ink-800">{value}</span>
    </div>
  );
}

export function EntryModal({ entry, onClose }: EntryModalProps) {
  const { copy: copyAll, copied: copiedAll } = useCopy();

  if (!entry) return null;

  const referenceText = [
    entry.reference.source,
    entry.reference.citation,
    entry.reference.grading ? `(${entry.reference.grading})` : "",
  ]
    .filter(Boolean)
    .join(" — ");

  const allText = [
    entry.title_id,
    entry.arabic,
    entry.translation.transliteration,
    entry.translation.translation_id,
    referenceText,
  ].join("\n\n");

  return (
    <Modal
      open={entry !== null}
      onClose={onClose}
      title={entry.title_id}
      footer={
        <>
          <span className="mr-auto text-xs text-clay-500">
            {categoryLabel[entry.category]}
            {entry.type ? ` • ${entry.type}` : ""}
          </span>
          <button
            type="button"
            onClick={() => void copyAll(allText)}
            className="focus-ring rounded-full bg-clay-500 px-4 py-1.5 text-xs font-medium text-white hover:bg-clay-600"
          >
            {copiedAll ? "Tersalin!" : "Salin semua"}
          </button>
        </>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <VerificationBadge status={entry.verification.status} />
          {entry.production_ready ? (
            <span className="inline-flex items-center rounded-full border border-sage-400 bg-sage-200 px-2.5 py-0.5 text-[11px] font-medium text-sage-600">
              Siap produksi
            </span>
          ) : (
            <span className="inline-flex items-center rounded-full border border-sand-200 bg-white px-2.5 py-0.5 text-[11px] font-medium text-clay-500">
              Belum siap produksi
            </span>
          )}
          {entry.memorization_level ? (
            <span className="pill">
              Hafalan: {memorizationLabel[entry.memorization_level]}
            </span>
          ) : null}
        </div>

        <CopyField
          label="Arab"
          value={entry.arabic}
          display={<p className="arabic text-ink-700">{entry.arabic}</p>}
        />

        <CopyField
          label="Transliterasi"
          value={entry.translation.transliteration}
          display={
            <p className="italic text-clay-700">
              {entry.translation.transliteration}
            </p>
          }
        />

        <CopyField
          label="Terjemahan (ID)"
          value={entry.translation.translation_id}
        />

        <CopyField label="Rujukan" value={referenceText} />

        {entry.summary_id ? (
          <section>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-clay-500">
              Ringkasan
            </p>
            <p className="text-sm leading-relaxed text-ink-700">
              {entry.summary_id}
            </p>
          </section>
        ) : null}

        {entry.variant_notes ? (
          <section>
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-clay-500">
              Catatan varian
            </p>
            <p className="text-sm leading-relaxed text-ink-700">
              {entry.variant_notes}
            </p>
          </section>
        ) : null}

        <section className="space-y-1.5 rounded-soft border border-sand-100 bg-white/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
            Verifikasi
          </p>
          <MetaRow label="Status" value={entry.verification.status} />
          <MetaRow
            label="Diverifikasi oleh"
            value={entry.verification.verified_by ?? null}
          />
          <MetaRow
            label="Tanggal verifikasi"
            value={entry.verification.verified_at ?? null}
          />
          {entry.verification.notes ? (
            <div className="pt-1 text-sm text-ink-700">
              <span className="text-clay-500">Catatan reviewer: </span>
              {entry.verification.notes}
            </div>
          ) : null}
        </section>

        {entry.usage_assets.length > 0 ? (
          <section className="space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
              Aset penggunaan
            </p>
            <ul className="space-y-1.5">
              {entry.usage_assets.map((asset, idx) => (
                <li
                  key={`${asset.url}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-soft border border-sand-100 bg-white/70 px-3 py-2 text-sm"
                >
                  <span className="pill bg-cream-100 text-clay-600">
                    {assetKindLabel[asset.kind]}
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

        <section className="space-y-1.5 rounded-soft border border-sand-100 bg-white/70 p-4">
          <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
            Metadata
          </p>
          <MetaRow label="ID" value={entry.id} />
          <MetaRow
            label="Tipe"
            value={entry.type ?? null}
          />
          <MetaRow
            label="Occasion"
            value={entry.occasion_id ?? null}
          />
          <MetaRow label="Dibuat" value={entry.created_at} />
          <MetaRow label="Diperbarui" value={entry.updated_at} />
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
