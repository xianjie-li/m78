import {
  _FormContext,
  _FieldContext,
  _formPropsKeys,
  _lisIgnoreKeys,
  FormCommonPropsGetter,
  FormCustomRender,
  FormCustomRenderBasicArgs,
  FormLayoutType,
  FormListCustomRenderArgs,
  FormAdaptorsItem,
  FormAdaptor,
} from "./types.js";
import { useFn } from "@m78/hooks";
import {
  AnyObject,
  isBoolean,
  isFunction,
  isString,
  NamePath,
} from "@m78/utils";
import React, { cloneElement, isValidElement } from "react";
import { _defaultValueGetter } from "./common.js";

export function _useFieldMethods(ctx: _FormContext, fieldCtx: _FieldContext) {
  const { form, config, adaptorsMap, adaptorsNameMap } = ctx;

  const { state, isList, props, name } = fieldCtx;

  const schema = state.schema;

  // 依次从props, schema, config中获取通用属性
  const getProps: FormCommonPropsGetter = useFn((key) => {
    // 排序需要从 list 中去除的属性
    if (isList && _lisIgnoreKeys.includes(key)) return;

    if (props[key] !== undefined) return props[key];
    if (schema?.[key] !== undefined) return schema?.[key];

    if (_formPropsKeys.includes(key)) {
      return (config as any)?.[key];
    }
  });

  const disabled = getProps("disabled");
  const size = getProps("size");

  // change handle
  const onChange = useFn((value: any) => {
    form.setValue(name, _defaultValueGetter(value));
  });

  // 是否应该渲染实际内容
  const shouldRender = useFn(() => {
    if (schema?.valid === false || getProps("hidden")) return false;
    return true;
  });

  // 根据layoutType/props获取宽度
  const getWidth = useFn(() => {
    const maxWidth = getProps("maxWidth");
    const layoutType = getProps("layoutType")!;

    if (maxWidth) return maxWidth;
    if (layoutType === FormLayoutType.vertical) return 348;
    if (layoutType === FormLayoutType.horizontal) return 440;
    return undefined;
  });

  // 获取绑定到表单控件的属性
  const getBind = useFn(() => {
    const bindProps: FormCustomRenderBasicArgs["bind"] = {
      value: form.getValue(name),
      onChange,
    };

    if (isBoolean(disabled)) {
      bindProps.disabled = disabled;
    }

    if (size) {
      bindProps.size = size;
    }

    return bindProps;
  });

  /** 获取第一条错误 */
  const getError = useFn((name: NamePath) => {
    const err = form.getErrors(name);
    if (!err.length) return "";
    return err[0].message;
  });

  /** 根据传入 name 缩短 list api 签名 */
  const listApiSimplify = useFn((name: NamePath) => {
    const add: FormListCustomRenderArgs["add"] = (items, index) => {
      return form.listAdd(name, items, index);
    };

    const remove: FormListCustomRenderArgs["remove"] = (index) => {
      return form.listRemove(name, index);
    };

    const move: FormListCustomRenderArgs["move"] = (
      from: number,
      to: number
    ) => {
      return form.listMove(name, from, to);
    };
    const swap: FormListCustomRenderArgs["swap"] = (
      from: number,
      to: number
    ) => {
      return form.listSwap(name, from, to);
    };

    return {
      add,
      remove,
      move,
      swap,
    };
  });

  /** 获取组件适配器配置信息 */
  const getAdaptor = useFn(
    (): {
      adaptorConf?: FormAdaptorsItem;
      /** 用户在schema或field传入了函数类型的element时, 此项为该函数 */
      elementRender?: FormAdaptor;
    } => {
      const element = props.element || schema?.element;
      const adaptor = props.adaptor || schema?.adaptor;

      let aConf: FormAdaptorsItem;

      if (isFunction(element)) {
        return {
          elementRender: element,
        };
      }

      if (isValidElement<any>(element)) {
        const conf = adaptorsMap.get(element.type);

        aConf = {
          ...conf,
          element: element,
        };

        if (adaptor) aConf.formAdaptor = adaptor;

        return {
          adaptorConf: aConf,
        };
      } else if (isString(element)) {
        const aConf = adaptorsNameMap.get(element);

        if (!aConf) {
          console.warn(
            `form widget ${element} is not config. Please config it in the adaptors attribute in the Form.config or m78Config`
          );
          return {};
        }

        if (adaptor) aConf.formAdaptor = adaptor;

        return {
          adaptorConf: aConf,
        };
      }

      return {};
    }
  );

  const { adaptorConf } = getAdaptor();

  /** 获取render arg */
  const getRenderArgs = useFn((): FormCustomRenderBasicArgs => {
    return {
      bind: getBind(),
      binder: (element, pp) => {
        if (!isValidElement<any>(element)) return null;
        return cloneElement(element, pp as AnyObject);
      },
      form,
      config,
      props,
      getProps,
      element: adaptorConf?.element || null,
    };
  });

  /** 渲染 node | (arg) => node 定制节点 */
  const extraNodeRenderHelper = useFn(
    (node: React.ReactNode | FormCustomRender) => {
      if (isFunction(node)) {
        return node(getRenderArgs());
      }

      return node;
    }
  );

  return {
    getProps,
    getAdaptor,
    onChange,
    shouldRender,
    getWidth,
    getBind,
    getError,
    listApiSimplify,
    extraNodeRenderHelper,
    getRenderArgs,
  };
}

export type _UseFieldMethods = ReturnType<typeof _useFieldMethods>;
