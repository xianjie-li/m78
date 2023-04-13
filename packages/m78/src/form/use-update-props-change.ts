import { AnyFunction } from "@m78/utils";
import { _FormContext } from "./types.js";

export function _useUpdatePropsChange(ctx: _FormContext, update: AnyFunction) {
  ctx.updatePropsEvent.useEvent(() => {
    update();
  });
}
