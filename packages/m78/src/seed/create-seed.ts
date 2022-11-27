import create, { CreateSeedConfig } from "@m78/seed";
import { RCSeed, RCSeedCreator } from "./types.js";
import { _insideMiddleware } from "./middleware.js";

export const _CreateSeed: RCSeedCreator = (conf) => {
  const middleware: CreateSeedConfig["middleware"] = [_insideMiddleware];

  if (conf?.middleware?.length) {
    middleware.push(...conf.middleware);
  }

  return create({
    ...conf,
    middleware,
  }) as RCSeed<any>;
};
