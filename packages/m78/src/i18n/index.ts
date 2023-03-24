import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.js";
import { throwError } from "../common/index.js";

export const resources = {
  en,
} as const;

export const COMMON_NS = "common";
export const BUTTON_NS = "button";
export const INPUT_NS = "input";
export const DIALOG_NS = "dialog";
export const FORK_NS = "fork";
export const FORM_LANG_PACK_NS = "formLangPack";
export const FORM_NS = "form";

const i18n = i18next.use(initReactI18next).createInstance(
  {
    fallbackLng: "en",
    fallbackNS: "common",
    defaultNS: "common",
    ns: [
      COMMON_NS,
      BUTTON_NS,
      INPUT_NS,
      DIALOG_NS,
      FORK_NS,
      FORM_LANG_PACK_NS,
      FORM_NS,
    ],
    debug: process.env.NODE_ENV === "development",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources,
  },
  (error) => {
    if (error) throwError(error);
  }
);

export {
  _useTranslation as useTranslation,
  _Translation as Translation,
  _Trans as Trans,
} from "./translations.js";

export { i18n };
