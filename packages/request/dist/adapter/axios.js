import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import { Response } from "../response";
import { ResponseError } from "../response-error";
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
        return Promise.reject(new ResponseError("".concat(err.name, ": ").concat(err.message) || "", (err === null || err === void 0 ? void 0 : err.response) ? responseProcess(err.response) : undefined));
    });
}
