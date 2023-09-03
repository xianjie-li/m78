import { english } from "@m78/verify";
import { tableDefaultTexts } from "../../table-vanilla/index.js";

export default {
  common: {
    submit: "submit",
    confirm: "confirm",
    cancel: "cancel",
    loading: "loading",
    empty: "no data",
    "confirm delete": "are you sure to delete?",
  },
  input: {
    "word count": " chars",
  },
  button: {
    test: "test something",
  },
  dialog: {
    "default title": "note",
  },
  fork: {
    error: "request exception",
    timeout: "request timeout",
    reload: "reload",
    "retry tip": "please try again later",
    "retry tip with button": "please try again later or ",
  },
  formLangPack: english,
  form: {
    "delete current item": "delete current item",
    "drag sort": "drag sort",
    "add item": "add item",
    submit: "submit",
    reset: "reset",
  },
  table: {
    ...tableDefaultTexts,

    // react version
    count: "{{count}} rows / {{selectedCount}} selected",
    query: "query",
    reset: "reset",
    "reset filter": "reset filter condition",
    "common filter": "common filter",
    redo: "redo",
    undo: "undo",
    "export xlsx": "export as xlsx file",
    "u can also": "you can also",
    "export specific": "export specific columns",
    import: "import data from xlsx file",
    "download import tpl": "download import template",
    "delete selected rows": "delete selected rows",
    "add row tip1": "add a new row",
    "new tip": "new",
    "delete tip": "delete",
    "update tip": "update",
    "add row btn": "new",
    "save btn": "save",
  },
};
