import { BaseRequestOptions } from "../interfaces";
import { Response } from "../response";
import { ResponseError } from "../response-error";
import qs from "query-string";

export interface FetchOptions<Ext = {}>
  extends Omit<RequestInit, "body" | "headers">,
    Omit<BaseRequestOptions<Ext>, "method"> {}

/** Fetch adapter */
export function fetchAdapter(opt: FetchOptions) {
  return fetch(`${opt.url}${qs.stringify(opt?.query || {})}`, opt)
    .then(async (res) => {
      const response = new Response();

      response.message = res.statusText;
      response.code = res.status;

      const h: any = {};

      for (const [k, v] of res.headers.entries()) {
        h[k] = v;
      }

      response.headers = h;

      const type = h["content-type"] || h["Content-Type"];

      if (type.includes("application/json")) {
        response.data = await res.json();
      }

      if (type.includes("text/")) {
        response.data = await res.text();
      }

      response.original = res;
      return response;
    })
    .catch((err) => {
      let msg = "";

      if (err.name || err.message) {
        msg = `${err.name || ""}: ${err.message || ""}`;
      }

      return Promise.reject(new ResponseError(msg));
    });
}
