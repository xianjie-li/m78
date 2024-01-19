import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.js";
import { throwError } from "../common/index.js";
export var resources = {
    en: en
};
export var COMMON_NS = "common";
export var BUTTON_NS = "button";
export var INPUT_NS = "input";
export var DIALOG_NS = "dialog";
export var FORK_NS = "fork";
export var FORM_LANG_PACK_NS = "formLangPack";
export var FORM_NS = "form";
export var TABLE_NS = "table";
var i18n = i18next.use(initReactI18next).createInstance({
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
        TABLE_NS
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
