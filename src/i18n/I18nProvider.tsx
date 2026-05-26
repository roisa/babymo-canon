import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { translate, type Locale } from "../lib/i18n";
import { I18nContext, STORAGE_KEY } from "./context";

function readInitial(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "id") return v;
    const lang = navigator?.language?.toLowerCase() ?? "";
    if (lang.startsWith("en")) return "en";
  } catch {
    /* private mode etc. */
  }
  return "id";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => readInitial());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => setLocaleState(next), []);
  const toggleLocale = useCallback(
    () => setLocaleState((l) => (l === "id" ? "en" : "id")),
    [],
  );

  const t = useCallback(
    (key: Parameters<typeof translate>[1], vars?: Parameters<typeof translate>[2]) =>
      translate(locale, key, vars),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, t }),
    [locale, setLocale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
