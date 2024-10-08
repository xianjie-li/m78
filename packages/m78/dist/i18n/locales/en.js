import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import formLangPack from "@m78/form/language-pack/en.js";
import { tableDefaultTexts } from "../../table-vanilla/index.js";
export default {
    common: {
        submit: "Submit",
        confirm: "Confirm",
        cancel: "Cancel",
        loading: "Loading",
        empty: "No data",
        alert: "Alert",
        retry: "Retry",
        yes: "Yes",
        no: "No",
        "confirm operation": "Do you want to continue with this?",
        "confirm delete": "Are you sure to delete?"
    },
    input: {
        "word count": " chars"
    },
    button: {
        test: "Test something"
    },
    dialog: {
        "default title": "Note"
    },
    fork: {
        error: "Request exception",
        timeout: "Request timeout",
        reload: "Reload",
        "retry tip": "Please try again later",
        "retry tip with button": "Please try again later or "
    },
    formLangPack: formLangPack,
    form: {
        "delete current item": "Delete current item",
        "drag sort": "Drag sort",
        "add item": "Add item",
        submit: "Submit",
        reset: "Reset"
    },
    table: _object_spread_props(_object_spread({}, tableDefaultTexts), {
        // react version
        count: "{{count}} rows / {{selectedCount}} selected",
        query: "Query",
        reset: "Reset",
        "reset filter": "Reset filter condition",
        "common filter": "Common filter",
        redo: "Redo",
        undo: "Undo",
        "export xlsx": "Export as xlsx file",
        "u can also": "You can also",
        "export specific": "export specific columns",
        import: "Import data from xlsx file",
        "download import tpl": "download import template",
        "add row tip1": "Add a new row",
        "new tip": "New",
        "remove tip": "Remove",
        "update tip": "Update",
        "change tip": "Change",
        "sorted tip": "Sorted",
        "add row btn": "New",
        "save btn": "Save",
        "copy cell": "Copy",
        "paste cell": "Paste",
        "copy cells": "Copy selected cells",
        "paste cells": "Paste to selected cells",
        "insert top": "Insert row to top",
        "insert bottom": "Insert row to bottom",
        "remove rows": "Remove selected rows",
        "setting reading": "Setting reading",
        "setting load failed": "Setting load failed",
        "setting upload failed": "Setting upload failed, click to retry",
        "enable drag scroll": "Enable drag scrolling (shortcut keys: Space + drag)"
    })
};
