import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { Response } from "../response.js";
import { ResponseError } from "../response-error.js";
import axios from "axios";
import { omit } from "@m78/utils";
var responseProcess = function(res) {
    var response = new Response();
    response.message = res.statusText;
    response.code = res.status;
    response.headers = res.headers;
    response.data = res.data;
    response.original = res;
    return response;
};
/** Axios adapter */ export function axiosAdapter(opt) {
    return axios(opt.url, _object_spread_props(_object_spread({}, omit(opt, [
        "body",
        "query"
    ])), {
        data: opt.body,
        params: opt.query
    })).then(responseProcess).catch(function(err) {
        var msg = "";
        if (err.name || err.message) {
            msg = "".concat(err.name || "", ": ").concat(err.message || "");
        }
        return Promise.reject(new ResponseError(msg, (err === null || err === void 0 ? void 0 : err.response) ? responseProcess(err.response) : undefined));
    });
}
