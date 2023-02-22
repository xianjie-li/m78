import { _Context } from "./types.js";
import clone from "lodash/cloneDeep.js";
import {
  ensureArray,
  getNamePathValue,
  setNamePathValue,
  stringifyNamePath,
} from "@m78/utils";
import { _recursionDeleteNamePath } from "./common.js";

export function _implValue(ctx: _Context) {
  const { instance } = ctx;

  instance.getValues = () => {
    const [, names] = ctx.getFormatterSchemas();
    const values = clone(ctx.values);

    // 移除invalid值
    names.forEach((name) => {
      const na = ensureArray(name);

      _recursionDeleteNamePath(values, na);
    });

    return values;
  };

  instance.getValue = (name) => {
    const schema = instance.getSchema(name);

    // 移除invalid值
    if (schema && "name" in schema && schema.valid === false) {
      return undefined;
    }

    return getNamePathValue(ctx.values, name);
  };

  instance.setValues = (values) => {
    ctx.values = clone(values);

    // 清空现有list信息, 并使用新的values进行一次刷新, 同步list
    ctx.listData = {};
    ctx.syncLists();

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    instance.verify().catch(() => {});
  };

  instance.setValue = (name, val) => {
    ctx.setValueInner(name, val);
  };

  instance.getDefaultValues = () => {
    return clone(ctx.defaultValue);
  };

  instance.setDefaultValues = (values) => {
    ctx.defaultValue = clone(values);
  };

  ctx.setValuesInner = (values, skipListSync) => {
    ctx.values = clone(values);

    // 清空现有list信息, 并使用新的values进行一次刷新, 同步list
    if (!skipListSync) {
      ctx.listData = {};
      ctx.syncLists();
    }

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    instance.verify().catch(() => {});
  };

  ctx.setValueInner = (name, val, skipListSync = false) => {
    setNamePathValue(ctx.values, name, val);

    const sName = stringifyNamePath(name);

    // 若有, 清空记录的list信息并进行一次更新
    if (!skipListSync) {
      ctx.listData[sName] = [];
      ctx.syncLists();
    }

    ctx.lockNotify = true;
    instance.setTouched(name, true);
    ctx.lockNotify = false;

    if (!ctx.lockNotify) {
      instance.events.change.emit(name, true);
      instance.events.update.emit(name, true);
    }

    ctx.debounceVerify(name);
  };
}
