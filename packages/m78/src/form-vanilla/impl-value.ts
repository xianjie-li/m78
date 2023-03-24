import { _Context } from "./types.js";
import clone from "lodash/cloneDeep.js";
import {
  ensureArray,
  getNamePathValue,
  isArray,
  isEmpty,
  isObject,
  isString,
  NameItem,
  setNamePathValue,
} from "@m78/utils";
import { _clearChildAndSelf, _recursionDeleteNamePath } from "./common.js";
import isEqual from "lodash/isEqual.js";

export function _implValue(ctx: _Context) {
  const { instance, config } = ctx;

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

    if (!ctx.lockListState) {
      ctx.listState = {};
    }

    if (!ctx.lockNotify) {
      instance.events.change.emit();
      instance.events.update.emit();
    }

    if (config.autoVerify) {
      instance.verify().catch(() => {});
    }
  };

  instance.setValue = (name, val) => {
    setNamePathValue(ctx.values, name, val);

    if (!ctx.lockListState) {
      _clearChildAndSelf(ctx, name);
    }

    ctx.lockNotify = true;
    instance.setTouched(name, true);
    ctx.lockNotify = false;

    if (!ctx.lockNotify) {
      instance.events.change.emit(name, true);
      instance.events.update.emit(name, true);
    }

    if (config.autoVerify) {
      ctx.debounceVerify(name);
    }
  };

  instance.getDefaultValues = () => {
    return clone(ctx.defaultValue);
  };

  instance.setDefaultValues = (values) => {
    ctx.defaultValue = clone(values);
  };

  instance.getChangedValues = () => {
    const values = instance.getValues();
    const defaultValues = instance.getDefaultValues();

    // 非数组和对象时, 直接比较
    if (!isObject(values) && !Array.isArray(values)) {
      if (!isEqual(values, defaultValues)) {
        return values;
      }
      return null;
    }

    // 变更或新增的值
    let cValues: any | null = null;

    // 递归处理和获取当前values的变更
    function changeProcess() {
      if (isObject(values)) {
        const keys = Object.keys(values);
        keys.forEach((key) => {
          const changed = instance.getChanged(key);

          if (changed) {
            if (cValues === null) cValues = {};

            setNamePathValue(cValues, key, values[key]);
          }
        });
        return;
      }

      if (isArray(values)) {
        values.forEach((value, index) => {
          const changed = instance.getChanged(index);
          if (changed) {
            if (cValues === null) cValues = [];

            setNamePathValue(cValues, index, value);
          }

          if (isArray(cValues)) {
            // 过滤掉不连续索引
            cValues = cValues.filter(() => true);
          }
        });
        return;
      }
    }

    // 处理从defaultValue中删除的元素
    function defaultValueProcess() {
      if (isObject(defaultValues)) {
        const keys = Object.keys(defaultValues);
        keys.forEach((key) => {
          const val = defaultValues[key];
          const cVal = values[key];
          // 包含在defaultValue中, 但是不包含在values中, 为其设置初始值
          if (!isEmpty(val) && isEmpty(cVal)) {
            // 字符串类型设置为空字符串, 其他类型设置为null
            if (isString(val)) {
              setNamePathValue(cValues, key, "");
            } else {
              setNamePathValue(cValues, key, null);
            }
          }
        });
      }
    }

    changeProcess();

    defaultValueProcess();

    return cValues;
  };
}
