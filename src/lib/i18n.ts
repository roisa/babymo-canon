/**
 * i18n dictionary.
 *
 * Every user-facing string in the UI lives here, keyed by a stable
 * dotted path. Add a key once on the `id` side, then mirror it on `en`.
 * TypeScript enforces that both sides cover the same set.
 *
 * Helpers (used via the `useT` hook):
 *   t("entry.copy.all")            → "Salin semua" / "Copy all"
 *   t("results.count", { shown, total }) → with `{shown}` interpolation
 */

export type Locale = "id" | "en";

const id = {
  // ── Header / chrome ───────────────────────────────────────────────
  "header.brand": "Baby Mo",
  "header.title": "Kanon Doa, Hadis, & Ayat",
  "header.counts.entries": "entri",
  "header.counts.verified": "terverifikasi",
  "header.tabs.library": "Pustaka",
  "header.tabs.add": "Tambah",
  "header.skip": "Lewati ke konten",

  // ── Theme toggle ──────────────────────────────────────────────────
  "theme.system": "Otomatis",
  "theme.light": "Terang",
  "theme.dark": "Gelap",
  "theme.aria": "Tema: {name} (klik untuk ganti)",

  // ── Locale toggle ─────────────────────────────────────────────────
  "locale.id": "ID",
  "locale.en": "EN",
  "locale.aria": "Bahasa: {name} (klik untuk ganti)",
  "locale.name.id": "Bahasa Indonesia",
  "locale.name.en": "English",
  "locale.fallback.title": "(judul Inggris belum tersedia — menampilkan Bahasa Indonesia)",
  "locale.fallback.translation": "(terjemahan Inggris belum tersedia — menampilkan Bahasa Indonesia)",

  // ── Search & filter ───────────────────────────────────────────────
  "search.aria": "Cari kanon",
  "search.placeholder": "Cari judul, terjemahan, atau tag…",
  "search.clear": "Bersihkan pencarian",
  "search.loading": "Memuat pencarian…",
  "filter.title": "Filter",
  "filter.category": "Kategori",
  "filter.type": "Tipe",
  "filter.status": "Status verifikasi",
  "filter.memorization": "Tingkat hafalan",
  "filter.productionOnly": "Hanya tampilkan yang siap produksi",
  "filter.clearAll": "Bersihkan semua filter",

  // ── Category & status labels ──────────────────────────────────────
  "category.doa": "Doa",
  "category.hadith": "Hadis",
  "category.ayat": "Ayat",

  "status.verified": "Terverifikasi",
  "status.in_review": "Sedang ditinjau",
  "status.needs_review": "Perlu ditinjau",
  "status.rejected": "Ditolak",
  "status.aria": "Status verifikasi: {name}",

  "memorization.easy": "Mudah",
  "memorization.medium": "Sedang",
  "memorization.hard": "Sulit",

  // ── Results / empty states ────────────────────────────────────────
  "results.count": "Menampilkan {shown} dari {total} entri.",
  "empty.noResults.title": "Tidak ada hasil yang cocok",
  "empty.noResults.body": "Coba sederhanakan kata pencarian atau bersihkan filter aktif.",
  "empty.noResults.cta": "Bersihkan pencarian & filter",
  "empty.noEntries.title": "Belum ada entri kanon",
  "empty.noEntries.body":
    "Tambahkan berkas JSON di src/data/{doa,hadith,ayat} dan jalankan npm run validate:canon.",
  "empty.loadError.title": "Beberapa entri tidak dapat dimuat",
  "empty.loadError.body":
    "Periksa konsol untuk daftar berkas yang gagal divalidasi. Aplikasi tetap berjalan dengan entri yang valid.",
  "empty.loadError.count": "{count} berkas dilewati.",

  // ── Entry card / modal ────────────────────────────────────────────
  "entry.open.aria": "Buka detail {title}",
  "entry.copy.short": "Salin",
  "entry.copy.done": "Tersalin!",
  "entry.copy.arabic": "Arab",
  "entry.copy.transliteration": "Transliterasi",
  "entry.copy.translation": "Terjemahan",
  "entry.copy.reference": "Rujukan",
  "entry.copy.all": "Salin semua",
  "entry.copy.link": "Salin tautan",
  "entry.copy.linkDone": "Tautan tersalin!",
  "entry.modal.close": "Selesai",
  "entry.production.ready": "Siap produksi",
  "entry.production.notReady": "Belum siap produksi",
  "entry.memorizationLabel": "Hafalan",
  "entry.summary": "Ringkasan",
  "entry.variantNotes": "Catatan varian",
  "entry.verification.section": "Verifikasi",
  "entry.verification.status": "Status",
  "entry.verification.by": "Diverifikasi oleh",
  "entry.verification.at": "Tanggal verifikasi",
  "entry.verification.reviewerNotes": "Catatan reviewer",
  "entry.assets.section": "Aset penggunaan",
  "entry.assets.audio": "Audio",
  "entry.assets.graphic": "Grafis",
  "entry.assets.video": "Video",
  "entry.assets.doc": "Dokumen",
  "entry.assets.other": "Lainnya",
  "entry.meta.section": "Metadata",
  "entry.meta.id": "ID",
  "entry.meta.type": "Tipe",
  "entry.meta.occasion": "Occasion",
  "entry.meta.created": "Dibuat",
  "entry.meta.updated": "Diperbarui",

  // ── Confidence (community) ────────────────────────────────────────
  "confidence.label": "Diakui",
  "confidence.cta": "Saya kenal doa ini",
  "confidence.voted": "Anda mengakui",
  "confidence.aria": "{label}. {count} pengguna telah mengakui.",

  // ── Add Entry view ────────────────────────────────────────────────
  "add.title": "Tambah entri kanon",
  "add.intro":
    "Aplikasi ini tidak menulis berkas. Isi formulir di bawah, salin JSON, lalu buka Pull Request untuk peninjauan.",
  "add.loading": "Memuat formulir…",
  "add.field.category": "Kategori",
  "add.field.title_id": "Judul (Bahasa Indonesia)",
  "add.field.title_en": "Judul (English, opsional)",
  "add.slug.hint": "Slug otomatis: {slug}",
  "add.slug.empty": "Slug akan dibuat dari judul",
  "add.field.arabic": "Teks Arab",
  "add.field.arabic.hint": "Jika belum yakin, isi literal \"VERIFIKASI\".",
  "add.field.transliteration": "Transliterasi",
  "add.field.translation_id": "Terjemahan (Bahasa Indonesia)",
  "add.field.translation_en": "Terjemahan (English, opsional)",
  "add.field.ref.source": "Rujukan — sumber",
  "add.field.ref.source.hint": "Mis. \"HR. Bukhari\", \"QS. Al-Fatihah\".",
  "add.field.ref.citation": "Rujukan — sitasi",
  "add.field.ref.citation.hint": "Mis. \"1:1\", \"5746\".",
  "add.field.ref.grading": "Grading (opsional)",
  "add.field.ref.grading.hint": "Sahih, hasan, da'if — kosongkan jika tidak relevan.",
  "add.field.type": "Tipe (opsional)",
  "add.field.memo": "Tingkat hafalan (opsional)",
  "add.field.tags": "Tag (pisahkan dengan koma)",
  "add.field.tags.hint": "Mis. tidur, malam, harian",
  "add.field.occasion": "Occasion ID (opsional)",
  "add.field.summary": "Ringkasan singkat (opsional)",
  "add.field.variant": "Catatan varian (opsional)",
  "add.field.reviewer": "Catatan untuk reviewer (opsional)",
  "add.statusNote.lead": "Status verifikasi akan otomatis di-set ke",
  "add.statusNote.tail":
    "Entri ini tidak akan langsung tersimpan — salin JSON di sebelah lalu buka Pull Request.",
  "add.preview.heading": "JSON yang akan disimpan",
  "add.preview.valid": "Valid",
  "add.preview.errors": "{count} kesalahan",
  "add.preview.cta": "Salin JSON",
  "add.preview.ctaDone": "Tersalin!",
  "add.preview.helper":
    "Tempel JSON ini ke folder data melalui Pull Request untuk direview.",
  "add.errors.toggle": "Lihat daftar kesalahan",
  "add.filePathHint": "Simpan sebagai",

  // ── Footer ────────────────────────────────────────────────────────
  "footer.powered": "Powered by",
  "footer.tagline": "Hanya entri Terverifikasi yang dianggap kanonik.",
} as const;

export type TKey = keyof typeof id;

const en: Record<TKey, string> = {
  "header.brand": "Baby Mo",
  "header.title": "Canon of Doa, Hadith, & Verses",
  "header.counts.entries": "entries",
  "header.counts.verified": "verified",
  "header.tabs.library": "Library",
  "header.tabs.add": "Add",
  "header.skip": "Skip to content",

  "theme.system": "Auto",
  "theme.light": "Light",
  "theme.dark": "Dark",
  "theme.aria": "Theme: {name} (click to change)",

  "locale.id": "ID",
  "locale.en": "EN",
  "locale.aria": "Language: {name} (click to change)",
  "locale.name.id": "Indonesian",
  "locale.name.en": "English",
  "locale.fallback.title": "(English title not yet available — showing Indonesian)",
  "locale.fallback.translation":
    "(English translation not yet available — showing Indonesian)",

  "search.aria": "Search the canon",
  "search.placeholder": "Search title, translation, or tag…",
  "search.clear": "Clear search",
  "search.loading": "Loading search…",
  "filter.title": "Filter",
  "filter.category": "Category",
  "filter.type": "Type",
  "filter.status": "Verification status",
  "filter.memorization": "Memorization level",
  "filter.productionOnly": "Show only production-ready",
  "filter.clearAll": "Clear all filters",

  "category.doa": "Doa",
  "category.hadith": "Hadith",
  "category.ayat": "Verse",

  "status.verified": "Verified",
  "status.in_review": "In review",
  "status.needs_review": "Needs review",
  "status.rejected": "Rejected",
  "status.aria": "Verification status: {name}",

  "memorization.easy": "Easy",
  "memorization.medium": "Medium",
  "memorization.hard": "Hard",

  "results.count": "Showing {shown} of {total} entries.",
  "empty.noResults.title": "No matching results",
  "empty.noResults.body": "Try a simpler query or clear the active filters.",
  "empty.noResults.cta": "Clear search & filters",
  "empty.noEntries.title": "No canon entries yet",
  "empty.noEntries.body":
    "Add JSON files under src/data/{doa,hadith,ayat} and run npm run validate:canon.",
  "empty.loadError.title": "Some entries failed to load",
  "empty.loadError.body":
    "Check the console for the list of files that failed validation. The app keeps running with the valid entries.",
  "empty.loadError.count": "{count} files skipped.",

  "entry.open.aria": "Open detail for {title}",
  "entry.copy.short": "Copy",
  "entry.copy.done": "Copied!",
  "entry.copy.arabic": "Arabic",
  "entry.copy.transliteration": "Transliteration",
  "entry.copy.translation": "Translation",
  "entry.copy.reference": "Reference",
  "entry.copy.all": "Copy all",
  "entry.copy.link": "Copy link",
  "entry.copy.linkDone": "Link copied!",
  "entry.modal.close": "Done",
  "entry.production.ready": "Production ready",
  "entry.production.notReady": "Not production ready",
  "entry.memorizationLabel": "Memorization",
  "entry.summary": "Summary",
  "entry.variantNotes": "Variant notes",
  "entry.verification.section": "Verification",
  "entry.verification.status": "Status",
  "entry.verification.by": "Verified by",
  "entry.verification.at": "Verified on",
  "entry.verification.reviewerNotes": "Reviewer notes",
  "entry.assets.section": "Usage assets",
  "entry.assets.audio": "Audio",
  "entry.assets.graphic": "Graphic",
  "entry.assets.video": "Video",
  "entry.assets.doc": "Document",
  "entry.assets.other": "Other",
  "entry.meta.section": "Metadata",
  "entry.meta.id": "ID",
  "entry.meta.type": "Type",
  "entry.meta.occasion": "Occasion",
  "entry.meta.created": "Created",
  "entry.meta.updated": "Updated",

  "confidence.label": "Recognized",
  "confidence.cta": "I recognize this",
  "confidence.voted": "You recognized this",
  "confidence.aria": "{label}. Recognized by {count} people.",

  "add.title": "Add a canon entry",
  "add.intro":
    "This app never writes files. Fill out the form, copy the JSON, then open a Pull Request for review.",
  "add.loading": "Loading form…",
  "add.field.category": "Category",
  "add.field.title_id": "Title (Indonesian)",
  "add.field.title_en": "Title (English, optional)",
  "add.slug.hint": "Auto slug: {slug}",
  "add.slug.empty": "Slug will be generated from the title",
  "add.field.arabic": "Arabic text",
  "add.field.arabic.hint": 'If unsure, fill the literal "VERIFIKASI".',
  "add.field.transliteration": "Transliteration",
  "add.field.translation_id": "Translation (Indonesian)",
  "add.field.translation_en": "Translation (English, optional)",
  "add.field.ref.source": "Reference — source",
  "add.field.ref.source.hint": 'e.g. "Bukhari", "QS. Al-Fatihah".',
  "add.field.ref.citation": "Reference — citation",
  "add.field.ref.citation.hint": 'e.g. "1:1", "5746".',
  "add.field.ref.grading": "Grading (optional)",
  "add.field.ref.grading.hint": "Sahih, hasan, da'if — leave empty if not relevant.",
  "add.field.type": "Type (optional)",
  "add.field.memo": "Memorization level (optional)",
  "add.field.tags": "Tags (comma separated)",
  "add.field.tags.hint": "e.g. sleep, night, daily",
  "add.field.occasion": "Occasion ID (optional)",
  "add.field.summary": "Short summary (optional)",
  "add.field.variant": "Variant notes (optional)",
  "add.field.reviewer": "Notes for the reviewer (optional)",
  "add.statusNote.lead": "Verification status will be auto-set to",
  "add.statusNote.tail":
    "This entry will not be saved automatically — copy the JSON beside it and open a Pull Request.",
  "add.preview.heading": "JSON that will be saved",
  "add.preview.valid": "Valid",
  "add.preview.errors": "{count} errors",
  "add.preview.cta": "Copy JSON",
  "add.preview.ctaDone": "Copied!",
  "add.preview.helper":
    "Paste this JSON into the data folder via a Pull Request for review.",
  "add.errors.toggle": "Show error list",
  "add.filePathHint": "Save as",

  "footer.powered": "Powered by",
  "footer.tagline": "Only Verified entries are treated as canonical.",
};

export const dict: Record<Locale, Record<TKey, string>> = { id, en };

export function translate(
  locale: Locale,
  key: TKey,
  vars?: Record<string, string | number>,
): string {
  // Fallback chain: requested locale → Indonesian (primary) → literal key.
  const raw = dict[locale][key] ?? dict.id[key] ?? key;
  if (!vars) return raw;
  return raw.replace(/\{(\w+)\}/g, (_, name) =>
    name in vars ? String(vars[name]) : `{${name}}`,
  );
}

/** Pick the right localized string from an entry, with safe fallback. */
export function localizedTitle(
  entry: { title_id: string; title_en?: string },
  locale: Locale,
): { value: string; fallback: boolean } {
  if (locale === "en" && entry.title_en)
    return { value: entry.title_en, fallback: false };
  if (locale === "en") return { value: entry.title_id, fallback: true };
  return { value: entry.title_id, fallback: false };
}

export function localizedTranslation(
  translation: { translation_id: string; translation_en?: string },
  locale: Locale,
): { value: string; fallback: boolean } {
  if (locale === "en" && translation.translation_en)
    return { value: translation.translation_en, fallback: false };
  if (locale === "en")
    return { value: translation.translation_id, fallback: true };
  return { value: translation.translation_id, fallback: false };
}
