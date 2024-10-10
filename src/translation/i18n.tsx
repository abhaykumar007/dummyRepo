import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import translationEnglish from "./en/translation.json";

const resources = {
  en: {
    translation: translationEnglish,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: "en",
});

export const getTranslation = (key: string) => {
  return i18next.t(key);
};

export default i18next;
