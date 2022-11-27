import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import enUS from "./locales/en-US.json";
import { throwError } from "../common/index.js";
export var resources = {
    "en-US": enUS
};
var i18n = i18next.use(initReactI18next).createInstance({
    fallbackLng: "en-US",
    fallbackNS: "common",
    defaultNS: "common",
    ns: [
        "common",
        "button"
    ],
    debug: process.env.NODE_ENV === "development",
    interpolation: {
        escapeValue: false
    },
    resources: resources
}, function(error) {
    if (error) throwError(error);
});
export { _useTranslation as useTranslation, _Translation as Translation, _Trans as Trans } from "./translations.js";
export { i18n };
