import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
import { throwError } from "../common";

export const resources = {
  "en-US": enUS,
} as const;

const i18n = i18next.use(initReactI18next).createInstance(
  {
    fallbackLng: "en-US",
    fallbackNS: "common",
    defaultNS: "common",
    ns: ["common", "button"],
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
} from "./translations";

export { i18n };
