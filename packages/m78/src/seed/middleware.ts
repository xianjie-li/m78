import { Middleware } from "@m78/seed";
import { _createUseState } from "./create-use-state.js";
import { _createState } from "./create-state.js";

export const _insideMiddleware: Middleware = (bonus) => {
  if (bonus.init) {
    return bonus.config;
  }

  const useState = _createUseState(bonus.apis);
  (bonus.apis as any).useState = useState;
  (bonus.apis as any).State = _createState(bonus.apis, useState);
};
