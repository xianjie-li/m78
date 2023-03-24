import {
  _Context,
  _FieldContext,
  _formKeyCustomerKeys,
  _formPropsKeys,
  _lisIgnoreKeys,
  FormCommonPropsGetter,
  FormCustomRender,
  FormCustomRenderArgs,
  FormLayoutType,
  FormListCustomRenderArgs,
} from "./types.js";
import { useFn } from "@m78/hooks";
import {
  ensureArray,
  isArray,
  isBoolean,
  isFunction,
  isString,
  NamePath,
} from "@m78/utils";
import { _defaultValueGetter } from "./common.js";
import React, { isValidElement } from "react";

export function _useFieldMethods(ctx: _Context, fieldCtx: _FieldContext) {
  const { form, config } = ctx;

  const { state, isList, props, name } = fieldCtx;

  const schema = state.schema;

  const [component, componentData] = getComponent();

  // 依次从props, schema, config中获取通用属性
  const getProps: FormCommonPropsGetter = (key) => {
    // 排序需要从 list 中去除的属性
    if (isList && _lisIgnoreKeys.includes(key)) return;

    if (props[key] !== undefined) return props[key];
    if (schema?.[key] !== undefined) return schema?.[key];

    if (componentData && _formKeyCustomerKeys.includes(key)) {
      const cur = (componentData as any)[key];
      if (cur !== undefined) return cur;
      return;
    }

    if (_formPropsKeys.includes(key)) {
      return (config as any)?.[key];
    }
  };

  const valueGetter = getProps("valueGetter");
  const valueKey = getProps("valueKey") || "value";
  const changeKey = getProps("changeKey") || "onChange";
  const disabledKey = getProps("disabledKey") || "disabled";
  const sizeKey = getProps("sizeKey") || "size";
  const disabled = getProps("disabled");
  const size = getProps("size");

  // change handle
  const onChange = useFn((...args) => {
    const value = valueGetter
      ? valueGetter(...args)
      : _defaultValueGetter(args[0]);

    form.setValue(name, value);
  });

  // 是否应该渲染实际内容
  function shouldRender() {
    if (!name) return false;
    if (isArray(name) && !name.length) return false;
    if (schema?.valid === false || getProps("hidden")) return false;
    //.
    return true;
  }

  // 根据layoutType/props获取宽度
  function getWidth() {
    const maxWidth = getProps("maxWidth");
    const layoutType = getProps("layoutType")!;

    if (maxWidth) return maxWidth;
    if (layoutType === FormLayoutType.vertical) return 348;
    if (layoutType === FormLayoutType.horizontal) return 440;
    return undefined;
  }

  // 获取绑定到表单控件的属性
  function getBind() {
    const bindProps: any = {
      [valueKey]: form.getValue(name),
      [changeKey]: onChange,
    };

    if (isBoolean(disabled)) {
      bindProps[disabledKey] = disabled;
    }

    if (size) {
      bindProps[sizeKey] = size;
    }

    const ignoreBindKeys = ensureArray(getProps("ignoreBindKeys"));

    if (ignoreBindKeys.length) {
      ignoreBindKeys.forEach((key) => {
        delete bindProps[key];
      });
    }
    return bindProps;
  }

  /** 获取第一条错误 */
  const getError = (name: NamePath) => {
    const err = form.getErrors(name);
    if (!err.length) return "";
    return err[0].message;
  };

  /** 根据传入 name 缩短 form list 系列 api 签名 */
  const listApiSimplify = (name: NamePath) => {
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
  };

  /** 获取注册的组件及其信息 */
  function getComponent() {
    const nil = [null, null] as const;

    const componentKey = props.component || schema?.component;

    if (isValidElement<any>(componentKey)) return [componentKey, null] as const;

    if (!isString(componentKey)) return nil;

    const componentConfig = ctx.components!;

    const cur = componentConfig[componentKey];

    if (!cur) {
      console.warn(
        `component ${componentKey} is not registered. Please register it in the components attribute in the Form.config`
      );
      return nil;
    }

    if (isValidElement<any>(cur)) return [cur, null] as const;

    if (!isValidElement<any>(cur.component)) return nil;

    return [cur.component, cur] as const;
  }

  /** 获取注册的组件 */
  function getRegisterComponent() {
    return component;
  }

  /** 渲染 node | (arg) => node 定制节点 */
  function extraNodeRenderHelper(node: React.ReactNode | FormCustomRender) {
    if (isFunction(node)) {
      return node({
        config,
        form,
        bind: getBind(),
        props,
        getProps,
      });
    }

    return node;
  }

  /** 获取render arg */
  function getRenderArgs(): FormCustomRenderArgs {
    return {
      config,
      form,
      bind: getBind(),
      props,
      getProps,
    };
  }

  return {
    getProps,
    onChange,
    shouldRender,
    getWidth,
    getBind,
    getError,
    listApiSimplify,
    getRegisterComponent,
    extraNodeRenderHelper,
    getRenderArgs,
  };
}

export type _UseFieldMethods = ReturnType<typeof _useFieldMethods>;
