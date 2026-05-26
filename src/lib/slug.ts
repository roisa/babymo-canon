/**
 * Convert a title to a kebab-case ASCII slug suitable for CanonEntry.id.
 * Returns an empty string for input that contains no slug-able characters.
 */
export function toSlug(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}
