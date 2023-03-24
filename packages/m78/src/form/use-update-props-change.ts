import { AnyFunction } from "@m78/utils";
import { _Context } from "./types.js";

export function _useUpdatePropsChange(ctx: _Context, update: AnyFunction) {
  ctx.updatePropsEvent.useEvent(() => {
    update();
  });
}
