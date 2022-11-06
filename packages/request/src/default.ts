import { dumpFn } from "@m78/utils";
import { BaseRequestOptions, CreateOptions } from "./interfaces";

export const defaultCreateConfig: Partial<CreateOptions<BaseRequestOptions>> = {
  feedBack: dumpFn,
  format: (res) => res,
  start: dumpFn,
  finish: dumpFn,
};
