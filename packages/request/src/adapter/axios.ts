import { BaseRequestOptions, Options } from "../interfaces";
import { Response } from "../response";
import { ResponseError } from "../response-error";

import axios, { AxiosRequestConfig } from "axios";
import { omit } from "@m78/utils";

export interface AxiosOptions<Ext = {}>
  extends Omit<AxiosRequestConfig, "url" | "data" | "headers">,
    BaseRequestOptions<Options<AxiosOptions<Ext>> & Ext> {}

const responseProcess = (res: any) => {
  const response = new Response();

  response.message = res.statusText;
  response.code = res.status;
  response.headers = res.headers;
  response.data = res.data;
  response.original = res;

  return response;
};

/** axios适配 */
export function axiosAdapter(opt: AxiosOptions) {
  return axios(opt.url, {
    ...omit(opt, ["body", "query"]),
    data: opt.body,
    params: opt.query,
  })
    .then((res) => responseProcess(res))
    .catch((err) => {
      return Promise.reject(
        new ResponseError(
          `${err.name}: ${err.message}` || "",
          err?.response ? responseProcess(err.response) : undefined
        )
      );
    });
}
