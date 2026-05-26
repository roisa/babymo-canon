import { z } from "zod";

/**
 * CanonEntry — the canonical record for every doa, hadith, and ayat in Baby Mo.
 *
 * Religious safety rules (enforced editorially, surfaced in schema):
 *  - Never invent Arabic, references, or grading.
 *  - If uncertain, use the literal string "VERIFIKASI" in that field.
 *  - New entries default to verification.status = "needs_review".
 *  - Only "verified" entries are treated as canonical records.
 *
 * Validation is strict: unknown fields are rejected so silent schema drift
 * cannot slip into production data.
 */

const isoDate = z
  .string()
  .refine((value) => {
    if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})?)?$/.test(value)) {
      return false;
    }
    const parsed = new Date(value);
    return !Number.isNaN(parsed.getTime());
  }, "Harus berupa string tanggal ISO 8601 yang valid (mis. 2026-05-26 atau 2026-05-26T10:00:00Z).");

export const CategorySchema = z.enum(["doa", "hadith", "ayat"]);
export type Category = z.infer<typeof CategorySchema>;

export const VerificationStatusSchema = z.enum([
  "needs_review",
  "in_review",
  "verified",
  "rejected",
]);
export type VerificationStatus = z.infer<typeof VerificationStatusSchema>;

/** Memorization difficulty hint for parents/kids. */
export const MemorizationLevelSchema = z.enum(["easy", "medium", "hard"]);
export type MemorizationLevel = z.infer<typeof MemorizationLevelSchema>;

/**
 * Free-form sub-classification within a category — e.g. doa: "harian" /
 * "khusus"; hadith: "qudsi" / "nabawi"; ayat: "makkiyah" / "madaniyah".
 * Kept as a slug so it stays filterable and URL-safe.
 */
const typeSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, "type harus kebab-case ASCII huruf kecil.");

/** Source reference — kitab, surah:ayat, or collection citation. */
export const ReferenceSchema = z
  .object({
    /** e.g. "HR. Bukhari", "QS. Al-Fatihah", "Sunan Abu Dawud". */
    source: z.string().min(1, "source wajib diisi (gunakan 'VERIFIKASI' jika belum jelas)."),
    /** e.g. "1:1", "5746", "Bab Adab". */
    citation: z.string().min(1, "citation wajib diisi (gunakan 'VERIFIKASI' jika belum jelas)."),
    /** Hadith grading where applicable: sahih, hasan, da'if, etc. */
    grading: z.string().optional(),
    /** Optional URL to a trusted external source. */
    url: z.string().url().optional(),
  })
  .strict();
export type Reference = z.infer<typeof ReferenceSchema>;

/** Translation/transliteration pair for the Arabic body. */
export const TranslationSchema = z
  .object({
    transliteration: z.string().min(1),
    translation_id: z.string().min(1, "Terjemahan Bahasa Indonesia wajib diisi."),
  })
  .strict();
export type Translation = z.infer<typeof TranslationSchema>;

export const VerificationSchema = z
  .object({
    status: VerificationStatusSchema,
    verified_by: z.string().optional(),
    verified_at: isoDate.optional(),
    notes: z.string().optional(),
  })
  .strict();
export type Verification = z.infer<typeof VerificationSchema>;

/** Asset reference for the design team (graphics, audio, doc templates). */
export const UsageAssetKindSchema = z.enum([
  "audio",
  "graphic",
  "video",
  "doc",
  "other",
]);
export type UsageAssetKind = z.infer<typeof UsageAssetKindSchema>;

export const UsageAssetSchema = z
  .object({
    kind: UsageAssetKindSchema,
    url: z.string().url("URL aset tidak valid."),
    label: z.string().optional(),
  })
  .strict();
export type UsageAsset = z.infer<typeof UsageAssetSchema>;

/** Slug — lowercase, kebab-case, ASCII only. */
const slugSchema = z
  .string()
  .min(1)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u, "Slug harus kebab-case ASCII huruf kecil.");

export const CanonEntrySchema = z
  .object({
    id: slugSchema,
    category: CategorySchema,
    title_id: z.string().min(1, "Judul Bahasa Indonesia wajib diisi."),
    arabic: z.string().min(1, "Teks Arab wajib diisi (gunakan 'VERIFIKASI' jika belum jelas)."),
    translation: TranslationSchema,
    reference: ReferenceSchema,
    tags: z.array(z.string().min(1)).default([]),
    type: typeSchema.optional(),
    memorization_level: MemorizationLevelSchema.optional(),
    production_ready: z.boolean().default(false),
    occasion_id: z.string().optional(),
    summary_id: z.string().optional(),
    /** Notes about textual variants / alternate riwayat. */
    variant_notes: z.string().optional(),
    /** Linked assets (audio recordings, graphic templates, etc.). */
    usage_assets: z.array(UsageAssetSchema).default([]),
    verification: VerificationSchema,
    created_at: isoDate,
    updated_at: isoDate,
  })
  .strict()
  .refine(
    (entry) => new Date(entry.updated_at).getTime() >= new Date(entry.created_at).getTime(),
    {
      message: "updated_at tidak boleh lebih awal dari created_at.",
      path: ["updated_at"],
    },
  )
  .refine(
    (entry) => !entry.production_ready || entry.verification.status === "verified",
    {
      message:
        "production_ready hanya boleh true jika verification.status = 'verified'.",
      path: ["production_ready"],
    },
  );

export type CanonEntry = z.infer<typeof CanonEntrySchema>;

/**
 * Used by tooling. Returns a discriminated result so callers can group
 * errors by file path rather than failing on the first invalid entry.
 */
export function safeParseCanonEntry(input: unknown):
  | { success: true; data: CanonEntry }
  | { success: false; errors: z.ZodIssue[] } {
  const result = CanonEntrySchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error.issues };
}
