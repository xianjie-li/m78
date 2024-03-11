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
  simplyEqual as isEqual,
} from "@m78/utils";
import { _clearChildAndSelf, isRootName } from "./common.js";

export function _implValue(ctx: _Context) {
  const { instance, config } = ctx;

  instance.getValue = (name) => {
    if (isRootName(name)) return instance.getValues();

    return getNamePathValue(ctx.values, name);
  };

  // 获取经过处理后的当前值
  instance.getValues = () => {
    const [, values] = ctx.getFormatterValuesAndSchema();
    return values;
  };

  ctx.getFormatterValuesAndSchema = (values) => {
    const { schemas, invalidNames } = instance.getSchemas();

    const cloneValues = clone(values === undefined ? ctx.values : values);

    // 移除invalid值
    deleteNamePathValues(cloneValues, invalidNames);

    return [schemas, cloneValues];
  };

  if (!ctx.verifyOnly) {
    // 设置所有值
    instance.setValues = (values: any) => {
      ctx.values = values;

      ctx.cacheSchema = null;

      if (!ctx.lockListState) {
        ctx.listState = {};
      }

      if (!ctx.lockNotify) {
        instance.events.change.emit();
        instance.events.update.emit();
      }

      if (config.autoVerify) {
        instance.verify();
      }
    };

    instance.setValue = (name, val) => {
      if (isRootName(name)) {
        instance.setValues(val);
        return;
      }

      setNamePathValue(ctx.values, name, val);

      ctx.cacheSchema = null;

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
      if (!isObject(values) && !isArray(values)) {
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
