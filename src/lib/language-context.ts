import { createContext, useContext } from "react";

export type Language = "en" | "am";

export const LanguageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
}>({ language: "en", setLanguage: () => undefined });

export function useLanguage() {
  return useContext(LanguageContext);
}
