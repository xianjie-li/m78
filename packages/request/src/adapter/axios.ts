import { BaseRequestOptions, Options } from "../interfaces";
import { Response } from "../response";
import { ResponseError } from "../response-error";

import axios, { AxiosRequestConfig } from "axios";
import { omit } from "@m78/utils";

export interface AxiosOptions<Ext = {}>
  extends Omit<AxiosRequestConfig, "url" | "data" | "headers">,
    Omit<BaseRequestOptions<Options<AxiosOptions<Ext>> & Ext>, "method"> {}

const responseProcess = (res: any) => {
  const response = new Response();

  response.message = res.statusText;
  response.code = res.status;
  response.headers = res.headers;
  response.data = res.data;
  response.original = res;

  return response;
};

/** Axios adapter */
export function axiosAdapter(opt: AxiosOptions) {
  return axios(opt.url, {
    ...omit(opt, ["body", "query"]),
    data: opt.body,
    params: opt.query,
  })
    .then(responseProcess)
    .catch((err) => {
      let msg = "";

      if (err.name || err.message) {
        msg = `${err.name || ""}: ${err.message || ""}`;
      }

      return Promise.reject(
        new ResponseError(
          msg,
          err?.response ? responseProcess(err.response) : undefined
        )
      );
    });
}
