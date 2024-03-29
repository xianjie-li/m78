import { _Context } from "./types.js";
import {
  deleteNamePathValues,
  getNamePathValue,
  isArray,
  isEmpty,
  isObject,
  isString,
  setNamePathValue,
  simplyDeepClone as clone,
} from "@m78/utils";
import { _clearChildAndSelf } from "./common.js";
import isEqual from "lodash/isEqual.js";

export function _implValue(ctx: _Context) {
  const { instance, config } = ctx;

  instance.getValue = (name) => {
    return getNamePathValue(ctx.values, name);
  };

  ctx.getFormatterValuesAndSchema = (values) => {
    const [schemas, names] = ctx.getFormatterSchemas();

    const cloneValues = clone(values === undefined ? ctx.values : values);

    // 移除invalid值
    deleteNamePathValues(cloneValues, names);

    return [schemas, cloneValues];
  };

  if (!ctx.verifyOnly) {
    instance.getValues = () => {
      const [, values] = ctx.getFormatterValuesAndSchema();
      return values;
    };

    instance.setValues = (values) => {
      ctx.values = values;

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
        ctx.isValueChangeTrigger = true;
        instance.debounceVerify(name);
      }
    };

    instance.getDefaultValues = () => {
      return ctx.defaultValue;
    };

    instance.setDefaultValues = (values) => {
      ctx.defaultValue = values;
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
}
