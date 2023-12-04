import { dumpFn } from "@m78/utils";
import { BaseRequestOptions, CreateOptions } from "./interfaces";

export const defaultCreateConfig: Partial<CreateOptions<BaseRequestOptions>> = {
  feedBack: dumpFn,
  format: (res) => res,
  start: dumpFn,
  finish: dumpFn,
  batchInterval: 200,
  keyBuilder: (option) => {
    // @ts-ignore
    const method = option.method;

    if (method === "GET" || method === "get") {
      return encodeURI(
        `GET#${option.url}#${JSON.stringify(
          option.query || ""
        )}#${JSON.stringify(option.headers || "")}`
      );
    }
  },
};
