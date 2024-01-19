export declare const resources: {
    readonly en: {
        common: {
            submit: string;
            confirm: string;
            cancel: string;
            loading: string;
            empty: string;
            alert: string;
            retry: string;
            yes: string;
            no: string;
            "confirm operation": string;
            "confirm delete": string;
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
        table: {
            count: string;
            query: string;
            reset: string;
            "reset filter": string;
            "common filter": string;
            redo: string;
            undo: string;
            "export xlsx": string;
            "u can also": string;
            "export specific": string;
            import: string;
            "download import tpl": string;
            "add row tip1": string;
            "new tip": string;
            "remove tip": string;
            "update tip": string;
            "sorted tip": string;
            "add row btn": string;
            "save btn": string;
            "copy cell": string;
            "paste cell": string;
            "copy cells": string;
            "paste cells": string;
            "insert top": string;
            "insert bottom": string;
            "remove rows": string;
            "setting reading": string;
            "setting load failed": string;
            "setting upload failed": string;
            "enable drag scroll": string;
            "paste unaligned row": "Pasted rows does not match the number of selected rows";
            "paste unaligned column": "Pasted column does not match the number of selected column";
            "paste single value limit": "Paste single value can't exceed {num} cell";
            paste: "Can not paste to non editable cell";
            "add row": "Add row";
            "remove row": "Remove row";
            "restore row": "Restore remove row";
            "soft remove tip": "The row has been removed and will take effect after submission";
            "set value": "Update value";
            "move row": "Move row";
            "move column": "Move column";
            editable: "Editable";
            "editable and required": "Editable (required)";
            "currently not editable": "Currently not editable";
            clipboardWarning: "Can't get clipboard data, bowser not support or does not have permissions.";
            selectAllOrUnSelectAll: "Select All/Cancel";
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
export declare const TABLE_NS = "table";
declare const i18n: import("i18next").i18n;
export { _useTranslation as useTranslation, _Translation as Translation, _Trans as Trans, } from "./translations.js";
export { i18n };
//# sourceMappingURL=index.d.ts.map