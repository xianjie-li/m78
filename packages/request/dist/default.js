import { dumpFn } from "@m78/utils";
export var defaultCreateConfig = {
    feedBack: dumpFn,
    format: function(res) {
        return res;
    },
    start: dumpFn,
    finish: dumpFn
};
