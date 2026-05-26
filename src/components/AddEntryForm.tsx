import { useMemo, useState } from "react";
import type { z } from "zod";
import { useCopy } from "../hooks/useCopy";
import { useI18n } from "../hooks/useLocale";
import {
  CanonEntrySchema,
  type Category,
  type MemorizationLevel,
} from "../lib/schema";
import { toSlug } from "../lib/slug";

/**
 * AddEntryForm
 *
 * The app intentionally does NOT write JSON files. This form helps an
 * editor draft a new entry, validates it live against the canon schema,
 * and produces a ready-to-paste JSON block. The reviewer commits the
 * file via a Pull Request — that is where the religious-safety review
 * actually happens.
 *
 * English title and translation are optional fields — leave blank and
 * the canon UI will fall back to Indonesian.
 */

type Draft = {
  category: Category;
  title_id: string;
  title_en: string;
  arabic: string;
  transliteration: string;
  translation_id: string;
  translation_en: string;
  reference_source: string;
  reference_citation: string;
  reference_grading: string;
  tags: string;
  type: string;
  memorization_level: "" | MemorizationLevel;
  occasion_id: string;
  summary_id: string;
  variant_notes: string;
  reviewer_notes: string;
};

const todayIso = () => new Date().toISOString().slice(0, 10);

const empty: Draft = {
  category: "doa",
  title_id: "",
  title_en: "",
  arabic: "",
  transliteration: "",
  translation_id: "",
  translation_en: "",
  reference_source: "VERIFIKASI",
  reference_citation: "VERIFIKASI",
  reference_grading: "",
  tags: "",
  type: "",
  memorization_level: "",
  occasion_id: "",
  summary_id: "",
  variant_notes: "",
  reviewer_notes: "",
};

function buildEntry(draft: Draft, today: string): Record<string, unknown> {
  const tags = draft.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const reference: Record<string, string> = {
    source: draft.reference_source.trim() || "VERIFIKASI",
    citation: draft.reference_citation.trim() || "VERIFIKASI",
  };
  if (draft.reference_grading.trim()) {
    reference.grading = draft.reference_grading.trim();
  }

  const translation: Record<string, string> = {
    transliteration: draft.transliteration.trim(),
    translation_id: draft.translation_id.trim(),
  };
  if (draft.translation_en.trim()) {
    translation.translation_en = draft.translation_en.trim();
  }

  const entry: Record<string, unknown> = {
    schema_version: 1,
    id: toSlug(draft.title_id),
    category: draft.category,
    title_id: draft.title_id.trim(),
  };
  if (draft.title_en.trim()) entry.title_en = draft.title_en.trim();
  entry.arabic = draft.arabic.trim();
  entry.translation = translation;
  entry.reference = reference;
  entry.tags = tags;

  if (draft.type.trim()) entry.type = draft.type.trim();
  if (draft.memorization_level)
    entry.memorization_level = draft.memorization_level;
  entry.production_ready = false;
  if (draft.occasion_id.trim()) entry.occasion_id = draft.occasion_id.trim();
  if (draft.summary_id.trim()) entry.summary_id = draft.summary_id.trim();
  if (draft.variant_notes.trim())
    entry.variant_notes = draft.variant_notes.trim();
  entry.usage_assets = [];

  const verification: Record<string, unknown> = { status: "needs_review" };
  if (draft.reviewer_notes.trim())
    verification.notes = draft.reviewer_notes.trim();
  entry.verification = verification;

  entry.created_at = today;
  entry.updated_at = today;

  return entry;
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, hint, error, children }: FieldProps) {
  return (
    <label className="block space-y-1.5">
      <span className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
        {label}
      </span>
      {children}
      {error ? (
        <span className="block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="block text-xs text-clay-500">{hint}</span>
      ) : null}
    </label>
  );
}

function input(className?: string) {
  return [
    "focus-ring w-full rounded-soft border border-sand-200 bg-cream-100 px-3 py-2 text-sm text-ink-800 placeholder:text-clay-400",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function AddEntryForm() {
  const { t } = useI18n();
  const [draft, setDraft] = useState<Draft>(empty);
  const today = useMemo(todayIso, []);
  const slug = useMemo(() => toSlug(draft.title_id), [draft.title_id]);

  const built = useMemo(() => buildEntry(draft, today), [draft, today]);
  const parsed = useMemo(() => CanonEntrySchema.safeParse(built), [built]);

  const errors = useMemo(() => {
    const out: Record<string, string> = {};
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const key = issue.path.join(".");
        if (!out[key]) out[key] = issue.message;
      }
    }
    return out;
  }, [parsed]);

  const json = useMemo(() => JSON.stringify(built, null, 2), [built]);
  const { copy, copied } = useCopy();

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const isValid = parsed.success;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (isValid) void copy(json);
        }}
      >
        <Field label={t("add.field.category")}>
          <select
            value={draft.category}
            onChange={(e) => set("category", e.target.value as Category)}
            className={input()}
          >
            <option value="doa">{t("category.doa")}</option>
            <option value="hadith">{t("category.hadith")}</option>
            <option value="ayat">{t("category.ayat")}</option>
          </select>
        </Field>

        <Field
          label={t("add.field.title_id")}
          hint={
            slug
              ? t("add.slug.hint", { slug })
              : t("add.slug.empty")
          }
          error={errors["title_id"] ?? errors["id"]}
        >
          <input
            value={draft.title_id}
            onChange={(e) => set("title_id", e.target.value)}
            placeholder="Misal: Doa Sebelum Wudhu"
            className={input()}
          />
        </Field>

        <Field
          label={t("add.field.title_en")}
          error={errors["title_en"]}
        >
          <input
            value={draft.title_en}
            onChange={(e) => set("title_en", e.target.value)}
            placeholder="e.g. Prayer Before Ablution"
            className={input()}
          />
        </Field>

        <Field
          label={t("add.field.arabic")}
          hint={t("add.field.arabic.hint")}
          error={errors["arabic"]}
        >
          <textarea
            value={draft.arabic}
            onChange={(e) => set("arabic", e.target.value)}
            rows={2}
            dir="rtl"
            className={input("text-right font-arabic text-lg leading-relaxed")}
          />
        </Field>

        <Field
          label={t("add.field.transliteration")}
          error={errors["translation.transliteration"]}
        >
          <input
            value={draft.transliteration}
            onChange={(e) => set("transliteration", e.target.value)}
            className={input("italic")}
          />
        </Field>

        <Field
          label={t("add.field.translation_id")}
          error={errors["translation.translation_id"]}
        >
          <textarea
            value={draft.translation_id}
            onChange={(e) => set("translation_id", e.target.value)}
            rows={2}
            className={input()}
          />
        </Field>

        <Field
          label={t("add.field.translation_en")}
          error={errors["translation.translation_en"]}
        >
          <textarea
            value={draft.translation_en}
            onChange={(e) => set("translation_en", e.target.value)}
            rows={2}
            className={input()}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("add.field.ref.source")}
            hint={t("add.field.ref.source.hint")}
            error={errors["reference.source"]}
          >
            <input
              value={draft.reference_source}
              onChange={(e) => set("reference_source", e.target.value)}
              className={input()}
            />
          </Field>
          <Field
            label={t("add.field.ref.citation")}
            hint={t("add.field.ref.citation.hint")}
            error={errors["reference.citation"]}
          >
            <input
              value={draft.reference_citation}
              onChange={(e) => set("reference_citation", e.target.value)}
              className={input()}
            />
          </Field>
        </div>

        <Field
          label={t("add.field.ref.grading")}
          hint={t("add.field.ref.grading.hint")}
          error={errors["reference.grading"]}
        >
          <input
            value={draft.reference_grading}
            onChange={(e) => set("reference_grading", e.target.value)}
            className={input()}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("add.field.type")} error={errors["type"]}>
            <input
              value={draft.type}
              onChange={(e) => set("type", e.target.value)}
              placeholder="harian, qudsi, makkiyah…"
              className={input()}
            />
          </Field>
          <Field
            label={t("add.field.memo")}
            error={errors["memorization_level"]}
          >
            <select
              value={draft.memorization_level}
              onChange={(e) =>
                set(
                  "memorization_level",
                  e.target.value as "" | MemorizationLevel,
                )
              }
              className={input()}
            >
              <option value="">—</option>
              <option value="easy">{t("memorization.easy")}</option>
              <option value="medium">{t("memorization.medium")}</option>
              <option value="hard">{t("memorization.hard")}</option>
            </select>
          </Field>
        </div>

        <Field
          label={t("add.field.tags")}
          hint={t("add.field.tags.hint")}
          error={errors["tags"]}
        >
          <input
            value={draft.tags}
            onChange={(e) => set("tags", e.target.value)}
            className={input()}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label={t("add.field.occasion")}
            error={errors["occasion_id"]}
          >
            <input
              value={draft.occasion_id}
              onChange={(e) => set("occasion_id", e.target.value)}
              className={input()}
            />
          </Field>
          <Field label={t("add.field.summary")} error={errors["summary_id"]}>
            <input
              value={draft.summary_id}
              onChange={(e) => set("summary_id", e.target.value)}
              className={input()}
            />
          </Field>
        </div>

        <Field
          label={t("add.field.variant")}
          error={errors["variant_notes"]}
        >
          <textarea
            value={draft.variant_notes}
            onChange={(e) => set("variant_notes", e.target.value)}
            rows={2}
            className={input()}
          />
        </Field>

        <Field
          label={t("add.field.reviewer")}
          error={errors["verification.notes"]}
        >
          <textarea
            value={draft.reviewer_notes}
            onChange={(e) => set("reviewer_notes", e.target.value)}
            rows={2}
            className={input()}
          />
        </Field>

        <p className="rounded-soft border border-sand-200 bg-cream-100 p-3 text-xs text-clay-600">
          {t("add.statusNote.lead")}{" "}
          <code className="rounded bg-cream-100/70 px-1">needs_review</code>.{" "}
          {t("add.statusNote.tail")}
        </p>
      </form>

      <aside className="space-y-3 lg:sticky lg:top-20 lg:self-start">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-medium uppercase tracking-wide text-clay-500">
            {t("add.preview.heading")}
          </p>
          <span
            className={
              "rounded-full px-2.5 py-0.5 text-[11px] font-medium " +
              (isValid
                ? "bg-sage-200 text-sage-600"
                : "bg-amber-100 text-amber-700")
            }
          >
            {isValid
              ? t("add.preview.valid")
              : t("add.preview.errors", { count: Object.keys(errors).length })}
          </span>
        </div>

        <pre className="max-h-[60vh] overflow-auto rounded-soft border border-sand-200 bg-cream-100 p-4 text-xs leading-relaxed text-ink-800">
          <code>{json}</code>
        </pre>

        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-clay-500">{t("add.preview.helper")}</p>
          <button
            type="button"
            disabled={!isValid}
            onClick={() => void copy(json)}
            className="focus-ring shrink-0 rounded-full bg-clay-500 px-4 py-1.5 text-xs font-medium text-cream-50 hover:bg-clay-600 disabled:cursor-not-allowed disabled:bg-sand-300"
          >
            {copied ? t("add.preview.ctaDone") : t("add.preview.cta")}
          </button>
        </div>

        {!isValid && Object.keys(errors).length > 0 ? (
          <details className="rounded-soft border border-sand-200 bg-cream-100 p-3 text-xs text-ink-700">
            <summary className="cursor-pointer font-medium text-clay-600">
              {t("add.errors.toggle")}
            </summary>
            <ul className="mt-2 space-y-1">
              {Object.entries(errors).map(([path, message]) => (
                <li key={path}>
                  <span className="text-clay-500">{path || "(root)"}:</span>{" "}
                  {message}
                </li>
              ))}
            </ul>
          </details>
        ) : null}

        <FilePathHint
          category={draft.category}
          slug={slug}
          parsed={parsed}
        />
      </aside>
    </div>
  );
}

function FilePathHint({
  category,
  slug,
  parsed,
}: {
  category: Category;
  slug: string;
  parsed: z.SafeParseReturnType<unknown, unknown>;
}) {
  const { t } = useI18n();
  if (!parsed.success || !slug) return null;
  return (
    <p className="text-xs text-clay-500">
      {t("add.filePathHint")}{" "}
      <code className="rounded bg-cream-100/70 px-1">
        src/data/{category}/{slug}.json
      </code>
    </p>
  );
}
