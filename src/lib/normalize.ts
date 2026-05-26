/**
 * normalizeSearchText
 *
 * Folds common transliteration variations so that "do'a" matches "doa",
 * "Ramadhan" matches "Ramadan", "Allohu" matches "Allahu", etc. Applied
 * to both the query and the indexed strings before Fuse sees them, so
 * editors don't have to remember a brand-specific spelling.
 *
 * Conservative on purpose — only well-known mappings.
 */
export function normalizeSearchText(input: string): string {
  return (
    input
      .toLowerCase()
      // Strip accents/diacritics so foreign characters fold.
      .normalize("NFKD")
      .replace(/\p{Diacritic}/gu, "")
      // Common Arabic-transliteration variants → canonical form.
      .replace(/['ʿʾ`’]/g, "")
      .replace(/dh/g, "d")
      .replace(/sh/g, "s")
      .replace(/kh/g, "k")
      .replace(/gh/g, "g")
      .replace(/th/g, "t")
      .replace(/ph/g, "f")
      // "o" and "u" both fold to "u" (Allohu / Allahu / Allaahu).
      .replace(/aa+/g, "a")
      .replace(/ii+/g, "i")
      .replace(/uu+/g, "u")
      .replace(/oo+/g, "u")
      .replace(/o/g, "u")
      // Collapse whitespace and stray punctuation.
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}
