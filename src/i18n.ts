import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import bgTranslation from "./locales/bg/translation.json";
import LanguageDetector from "i18next-browser-languagedetector";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    lng: localStorage.getItem("lang") || undefined,
    returnEmptyString: false, // allows empty string as valid translation
    fallbackLng: "bg",
    defaultNS: "translation",
    resources: {
      en: { translation: enTranslation },
      bg: { translation: bgTranslation },
    },
  });

export default i18next;
