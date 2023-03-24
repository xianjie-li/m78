export declare const resources: {
    readonly en: {
        common: {
            submit: string;
            confirm: string;
            cancel: string;
            loading: string;
            empty: string;
        };
        input: {
            "word count": string;
        };
        button: {
            test: string;
        };
        dialog: {
            "default title": string;
        };
        fork: {
            error: string;
            timeout: string;
            reload: string;
            "retry tip": string;
            "retry tip with button": string;
        };
        formLangPack: {
            commonMessage: {
                strangeValue: string;
            };
            required: string;
            object: string;
            bool: string;
            fn: string;
            symbol: string;
            regexp: string;
            regexpString: string;
            url: string;
            email: string;
            pattern: string;
            specific: string;
            equality: string;
            within: string;
            without: string;
            string: {
                notExpected: string;
                max: string;
                min: string;
                length: string;
            };
            array: {
                notExpected: string;
                max: string;
                min: string;
                length: string;
            };
            number: {
                notExpected: string;
                notInteger: string;
                max: string;
                min: string;
                size: string;
            };
            date: {
                notExpected: string;
                max: string;
                min: string;
                at: string;
                between: string;
            };
            match: string;
            list: {
                miss: string;
                diffLength: string;
            };
        };
        form: {
            "delete current item": string;
            "drag sort": string;
            "add item": string;
            submit: string;
            reset: string;
        };
    };
};
export declare const COMMON_NS = "common";
export declare const BUTTON_NS = "button";
export declare const INPUT_NS = "input";
export declare const DIALOG_NS = "dialog";
export declare const FORK_NS = "fork";
export declare const FORM_LANG_PACK_NS = "formLangPack";
export declare const FORM_NS = "form";
declare const i18n: import("i18next").i18n;
export { _useTranslation as useTranslation, _Translation as Translation, _Trans as Trans, } from "./translations.js";
export { i18n };
//# sourceMappingURL=index.d.ts.map