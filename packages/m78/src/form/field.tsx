import {
  _Context,
  FormLayoutType,
  _formPropsKeys,
  FormCommonPropsGetter,
  FormListRenderChildren,
  FormListCustomRenderArgs,
  _lisIgnoreKeys,
  _FieldContext,
} from "./types";
import { useFn, useSetState } from "@m78/hooks";
import React, { isValidElement, useRef } from "react";
import {
  ensureArray,
  isArray,
  isBoolean,
  isFunction,
  isObject,
  NamePath,
  stringifyNamePath,
} from "@m78/utils";
import { Lay } from "../lay/index.js";
import { Bubble } from "../bubble/index.js";
import { IconErrorOutline } from "@m78/icons/icon-error-outline.js";
import clsx from "clsx";
import { throwError } from "../common/index.js";
import { _useFieldMethods } from "./use-field-methods.js";
import { _useFieldLifeCircle } from "./use-field-life-circle.js";

export function _implField(ctx: _Context) {
  const { form } = ctx;

  /** 实现Field组件 */
  form.Field = (props) => {
    const { name, children } = props;

    const [state, setState] = useSetState(() => ({
      /** 当前组件的schema */
      schema: form.getSchema(name),
      /** 手动更新组件的标记 */
      renderKey: Math.random(),
    }));

    const schema = state.schema;

    // 由于 list 和 field 逻辑基本一致, 所以通过私有 props 来区分, 并在内部做特殊处理
    const isList = (props as any).__isList;

    const wrapRef = useRef<HTMLDivElement>(null!);

    const filedCtx: _FieldContext = {
      state,
      setState,
      isList,
      props,
      name,
      wrapRef,
    };

    // 组件方法
    const methods = _useFieldMethods(ctx, filedCtx);

    // 组件生命周期
    _useFieldLifeCircle(ctx, filedCtx, methods);

    const { getProps } = methods;

    const layoutType = getProps("layoutType")!;
    const label = getProps("label");
    const describe = getProps("describe");
    const size = getProps("size");
    const noLayout = getProps("noLayout");
    const fieldCustomer = getProps("fieldCustomer");
    const bubbleFeedback = getProps("bubbleFeedback");

    const touched = form.getTouched(name);
    const error = methods.getError(name);

    // 是否应显示error / 显示何种类型的错误
    const showError = error && touched;
    const showRegularError = showError && !bubbleFeedback;
    const showBubbleError = showError && bubbleFeedback;

    // 显示tile类型的表单布局
    const showTileFormUnit = layoutType === FormLayoutType.tile;

    if (!methods.shouldRender()) return null;

    // 无样式渲染
    if (noLayout) {
      return render();
    }

    // 布局渲染
    const bubbleDescribe = renderBubbleDescribe();
    // 是否应该显示label容器, 有label或者有气泡描述时显示
    const shouldShowLabel = !!label || !!bubbleDescribe;

    // 渲染表单控件
    function render(): any {
      // 列表渲染
      if (isList) return renderList();

      const bind = methods.getBind();

      // chidren 渲染
      if (isFunction(children)) {
        return children({
          ...ctx,
          bind,
          props,
          getProps,
        }) as React.ReactElement;
      }

      if (isFunction(fieldCustomer)) {
        return fieldCustomer({
          ...ctx,
          bind,
          props,
          getProps,
        }) as React.ReactElement;
      }

      if (isValidElement<any>(children)) {
        return React.cloneElement(children, bind);
      }

      // 注册组件渲染
      const component = methods.getRegisterComponent();
      const componentProps = getProps("componentProps");

      if (!isValidElement<any>(component)) return;

      return React.cloneElement(component, {
        ...component.props,
        ...componentProps,
        ...bind,
      });
    }

    // list渲染逻辑
    function renderList() {
      if (!isList) return null;

      if (!isFunction(children) || !schema?.list) {
        console.warn(
          `Form: "${stringifyNamePath(
            name
          )}" - List must passed a function as children, and schema must have list config.`
        );
        return null;
      }

      const list = form.getList(name) || [];

      const renderImpl: FormListCustomRenderArgs["render"] = (renderCB) => {
        if (!isFunction(renderCB)) {
          throwError(
            "Form: List args.render must passed a function as argument."
          );
        }
        return list.map((i, index) => {
          const element = renderCB({
            item: i.item,
            index,
            length: list.length,
            getName: (childName) => [
              ...ensureArray(name),
              index,
              ...ensureArray(childName),
            ],
          });

          if (!isValidElement<any>(element)) {
            throwError(
              `Form: List args.render must return a valid react element.`
            );
          }

          return React.cloneElement(element, {
            ...element.props,
            key: i.key,
          });
        });
      };

      return (children as any as FormListRenderChildren)({
        ...ctx,
        props,
        getProps,
        render: renderImpl,
        ...methods.listApiSimplify(name),
      });
    }

    // 渲染使用气泡展示的错误消息
    function renderBubbleError() {
      if (showRegularError) return null;
      return (
        <div
          className="m78-form_bubble-error"
          style={{
            opacity: showBubbleError ? 1 : 0,
            visibility: showBubbleError ? "visible" : "hidden",
          }}
        >
          {error}
        </div>
      );
    }

    // 渲染气泡形式的描述
    function renderBubbleDescribe() {
      if (!describe || !bubbleFeedback) return null;
      return (
        <Bubble content={describe}>
          <IconErrorOutline className="m78-form_describe-icon" />
        </Bubble>
      );
    }

    return (
      <Lay
        innerRef={wrapRef}
        disabled={getProps("disabled")}
        crossAlign="start"
        leading={
          layoutType === FormLayoutType.horizontal &&
          shouldShowLabel && (
            <div className="m78-form_label m78-form_horizontal-label">
              {label}
              {bubbleDescribe}
            </div>
          )
        }
        effect={false}
        overflowVisible={true}
        className={clsx(
          "m78-form_field",
          `m78-form_${layoutType}`,
          size && `__${size}`,
          bubbleFeedback && "__bubble",
          getProps("className")
        )}
        style={{ maxWidth: methods.getWidth(), ...getProps("style") }}
        trailing={
          showTileFormUnit && (
            <div className="m78-form_unit">
              {render()}
              {renderBubbleError()}
            </div>
          )
        }
      >
        {layoutType === FormLayoutType.vertical && shouldShowLabel && (
          <div className="m78-form_label m78-form_vertical-label">
            {label}
            {bubbleDescribe}
          </div>
        )}
        {layoutType === FormLayoutType.tile && shouldShowLabel && (
          <div className="m78-form_label m78-form_tile-label">
            {label}
            {bubbleDescribe}
          </div>
        )}
        {!showTileFormUnit && (
          <div className="m78-form_unit">
            {render()}
            {renderBubbleError()}
          </div>
        )}
        {!bubbleFeedback && describe && (
          <div className="m78-form_describe">{describe}</div>
        )}
        {!bubbleFeedback && (
          <div
            className="m78-form_error"
            role="alert"
            style={{
              opacity: showRegularError ? 1 : 0,
              visibility: showRegularError ? "visible" : "hidden",
            }}
          >
            {error}
          </div>
        )}
      </Lay>
    );
  };

  (form.Field as React.FunctionComponent).displayName = "Field";
}
