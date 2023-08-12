import { getNamePathValue, isArray, isObject } from "@m78/utils";
import isEqual from "lodash/isEqual.js";
import { _Context } from "./types";
import { _eachState, _getState } from "./common.js";
import { RejectMeta } from "@m78/verify";

export function _implState(ctx: _Context) {
  const { instance } = ctx;

  instance.getChanged = (name) => {
    const cur = getNamePathValue(ctx.values, name);
    const def = getNamePathValue(ctx.defaultValue, name);

    // 这里开始做一些空值处理, 如果默认值本身为undefined, 且新增值也是无效值("", [], {}等), 则认为其未改变

    // 跳过字符串
    if (cur === "" && def === undefined) return false;

    // 跳过空数组
    if (isArray(cur) && cur.length === 0 && def === undefined) return false;

    // 跳过空对象
    if (isObject(cur) && Object.keys(cur).length === 0 && def === undefined)
      return false;

    return !isEqual(cur, def);
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
    if (name) {
      const st = _getState(ctx, name);
      return st.errors || [];
    }

    const errors: RejectMeta = [];

    _eachState(ctx, (st) => {
      if (st.errors?.length) {
        errors.push(...st.errors);
      }
    });

    return errors;
  };
}
