import { useRef } from "react";
import { useFn, useSetState } from "../../index.js";
import { isFunction, AnyObject } from "@m78/utils";

/**
 * 表单组件的统一接口
 * @type <T> - value类型
 * */
export interface FormLike<T> {
  value?: T;
  onChange?: (value: T) => void;
  defaultValue?: T;
}

/**
 * 表单组件的统一接口， 包含额外参数
 * @type <T> - value类型
 * @type <Ext> - onChange接收的额外参数的类型
 * */
export interface FormLikeWithExtra<T, Ext = any> {
  value?: T;
  onChange?: (value: T, extra: Ext) => void;
  defaultValue?: T;
}

export interface SetFormState<T, Ext = any> {
  (patch: T | ((prev: T) => T), extra?: Ext): void;
}

export interface UseFormStateConfig {
  /** 'value' | 自定义获取value的key */
  valueKey?: string;
  /** 'defaultValue' | 自定义获取defaultValue的key */
  defaultValueKey?: string;
  /** 'onChange' | 自定义onChange的key */
  triggerKey?: string;
}

/**
 * 便捷的实现统一接口的受控、非受控表单组件, 也可用于任何需要受控、非受控状态的场景
 * @param props - 透传消费组件的props，该组件需要实现FormLike接口
 * @param defaultValue - 默认值，会作为value或defaultValue的回退值
 * @param config - 其他配置
 * */
export function useFormState<T, Ext = any>(
  props: AnyObject,
  defaultValue: T,
  config?: UseFormStateConfig
) {
  const {
    valueKey = "value",
    defaultValueKey = "defaultValue",
    triggerKey = "onChange",
  } = config || {};

  const isControllable = valueKey in props; // 允许 props[valueKey] === undefined

  const {
    [valueKey]: value,
    [triggerKey]: onChange,
    [defaultValueKey]: propDefaultValue,
  } = props;

  // 实时存储value
  const stateRef = useRef<T>(value);

  stateRef.current = value;

  // 非受控时使用的表单状态
  const [innerState, setInnerState] = useSetState(() => {
    return {
      value: propDefaultValue === undefined ? defaultValue : propDefaultValue,
    };
  });

  /**
   * 处理修改表单值,
   * 受控组件则将新值通过onChange回传，非受控组件设置本地状态并通过onChange通知
   * */
  const setFormState: SetFormState<T, Ext> = useFn((patch, extra) => {
    if (isFunction(patch)) {
      // patch函数处理
      if (isControllable) {
        const patchResult = patch(stateRef.current!);
        onChange && onChange(patchResult, extra);
      } else {
        const patchResult = patch(innerState.value);

        setInnerState({
          value: patchResult,
        });

        onChange && onChange(patchResult, extra);
      }
    } else {
      // 直接设置
      if (!isControllable) {
        setInnerState({
          value: patch,
        });
      }

      onChange && onChange(patch, extra);
    }
  });

  let v = isControllable ? value : innerState.value;

  if (v === undefined) {
    v = defaultValue;
  }

  return [v, setFormState] as const;
}
