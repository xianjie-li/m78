import { _Context } from "./types.js";
import clone from "lodash/cloneDeep.js";
import { ensureArray, getNamePathValue, setNamePathValue } from "@m78/utils";
import { _recursionDeleteNamePath } from "./common.js";

export function _implValue(ctx: _Context) {
  const { instance } = ctx;

  instance.getValues = () => {
    const [, names] = ctx.getSchemasAndInvalid();
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

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    instance.verify();
  };

  instance.setValue = (name, val) => {
    setNamePathValue(ctx.values, name, val);

    ctx.lockNotify = true;
    instance.setTouched(name, true);
    ctx.lockNotify = false;

    if (!ctx.lockNotify) {
      instance.events.change.emit(name, true);
      instance.events.update.emit(name, true);
    }

    ctx.debounceVerify(name);
  };

  instance.getDefaultValues = () => {
    return clone(ctx.defaultValue);
  };

  instance.setDefaultValues = (values) => {
    ctx.defaultValue = clone(values);
  };
}
