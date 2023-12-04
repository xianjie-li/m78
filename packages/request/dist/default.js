import { dumpFn } from "@m78/utils";
export var defaultCreateConfig = {
    feedBack: dumpFn,
    format: function(res) {
        return res;
    },
    start: dumpFn,
    finish: dumpFn,
    batchInterval: 200,
    keyBuilder: function(option) {
        // @ts-ignore
        var method = option.method;
        if (method === "GET" || method === "get") {
            return encodeURI("GET#".concat(option.url, "#").concat(JSON.stringify(option.query || ""), "#").concat(JSON.stringify(option.headers || "")));
        }
    }
};
