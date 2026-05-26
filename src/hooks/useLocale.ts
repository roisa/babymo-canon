import { useContext } from "react";
import { I18nContext, fallbackValue, type I18nContextValue } from "../i18n/context";

export function useI18n(): I18nContextValue {
  return useContext(I18nContext) ?? fallbackValue;
}

export function useT() {
  return useI18n().t;
}

export { I18nProvider } from "../i18n/I18nProvider";
