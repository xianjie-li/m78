import { getNamePathValue } from "@m78/utils";
import isEqual from "lodash/isEqual.js";
import { _Context } from "./types";
import { _getState } from "./common.js";

export function _implState(ctx: _Context) {
  const { instance } = ctx;

  instance.getChanged = (name) => {
    const cur = getNamePathValue(ctx.values, name);
    const def = getNamePathValue(ctx.defaultValue, name);
    return cur !== def;
  };

  instance.getFormChanged = () => {
    return !isEqual(ctx.values, ctx.defaultValue);
  };

  instance.getTouched = (name) => {
    const st = _getState(ctx, name);

    return st && !!st.touched;
  };

  instance.setTouched = (name, touched) => {
    const st = _getState(ctx, name);
    st.touched = touched;

    if (!ctx.lockNotify) {
      instance.events.update.emit(name);
    }
  };

  instance.getFormTouched = () => {
    for (const key of Object.keys(ctx.state)) {
      const cur = ctx.state[key];
      if (cur.touched) return true;
    }
    return false;
  };

  instance.setFormTouched = (touched) => {
    for (const key of Object.keys(ctx.state)) {
      const cur = ctx.state[key];

      if (cur) {
        cur.touched = touched;
      }
    }
    if (!ctx.lockNotify) {
      instance.events.update.emit();
    }
  };

  instance.getErrors = (name) => {
    const st = _getState(ctx, name);
    return st.errors || [];
  };
}
