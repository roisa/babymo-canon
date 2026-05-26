import { createContext } from "react";
import { translate, type Locale, type TKey } from "../lib/i18n";

export interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
  t: (key: TKey, vars?: Record<string, string | number>) => string;
}

export const STORAGE_KEY = "babymo-locale";

export const I18nContext = createContext<I18nContextValue | null>(null);

/** Used by useI18n() when the provider is missing (tests, snippets). */
export const fallbackValue: I18nContextValue = {
  locale: "id",
  setLocale: () => {},
  toggleLocale: () => {},
  t: (key, vars) => translate("id", key, vars),
};
