import {
  getNamePathValue,
  isArray,
  isObject,
  simplyEqual as isEqual,
} from "@m78/utils";
import { _Context, FormRejectMeta } from "./types.js";
import { _eachState, _getState, isRootName } from "./common.js";

export function _implState(ctx: _Context) {
  const { instance } = ctx;

  instance.getChanged = (name) => {
    if (isRootName(name)) return instance.getFormChanged();

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

  // form本身值是否变更
  instance.getFormChanged = () => {
    return !isEqual(ctx.values, ctx.defaultValue);
  };

  instance.getTouched = (name) => {
    if (isRootName(name)) return instance.getFormTouched();

    const st = _getState(ctx, name);

    return st && !!st.touched;
  };

  instance.setTouched = (name, touched) => {
    if (isRootName(name)) {
      instance.setFormTouched(touched);
      return;
    }

    const st = _getState(ctx, name);
    st.touched = touched;

    if (!ctx.lockNotify) {
      instance.events.update.emit(name);
    }
  };

  // 获取form的touched状态
  instance.getFormTouched = () => {
    for (const key of Object.keys(ctx.state)) {
      const cur = ctx.state[key];
      if (cur.touched) return true;
    }
    return false;
  };

  // 设置form的touched状态
  instance.setFormTouched = (touched: boolean) => {
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
    if (isRootName(name)) {
      const errors: FormRejectMeta = [];

      _eachState(ctx, (st) => {
        if (st.errors?.length) {
          errors.push(...st.errors);
        }
      });

      return errors;
    }

    const st = _getState(ctx, name);
    return st.errors || [];
  };
}
