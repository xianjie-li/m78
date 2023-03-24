import {
  _Context,
  _FieldContext,
  FormLayoutType,
  FormListCustomRenderArgs,
  FormListProps,
} from "./types.js";
import { useSetState } from "@m78/hooks";
import React, { isValidElement, useMemo, useRef } from "react";
import {
  createRandString,
  ensureArray,
  isFunction,
  stringifyNamePath,
} from "@m78/utils";
import { Lay } from "../lay/index.js";
import { Bubble } from "../bubble/index.js";
import { IconErrorOutline } from "@m78/icons/icon-error-outline.js";
import clsx from "clsx";
import { _useFieldMethods } from "./use-field-methods.js";
import { _useFieldLifeCircle } from "./use-field-life-circle.js";
import { _listLayoutRenderImpl, _listRenderImpl } from "./list.js";
import { requiredValidatorKey } from "@m78/verify/index.js";

export function _fieldImpl(ctx: _Context) {
  const { form } = ctx;

  /** 实现Field组件 */
  form.Field = (props) => {
    const { name, children } = props;

    const id = useMemo(() => createRandString(2), []);

    const [state, setState] = useSetState(() => ({
      /** 当前组件的schema */
      schema: form.getSchema(name),
      /** 手动更新组件的标记 */
      renderKey: Math.random(),
    }));

    const schema = state.schema;
    const validator = ensureArray(schema?.validator) || [];

    // 由于 list 和 field 逻辑基本一致, 所以通过私有 props 来区分, 并在内部做特殊处理
    const isList = (props as any).__isList;
    // 是否由schema render的根级渲染, 只在这个情况下需要进行wrapCustomer处理
    const isSchemaRootRender = (props as any).__isSchemaRoot;

    const wrapRef = useRef<HTMLDivElement>(null!);

    const filedCtx: _FieldContext = {
      state,
      setState,
      isList,
      props,
      name,
      wrapRef,
      id,
      strName: stringifyNamePath(name),
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
    const leftNode = getProps("leftNode");
    const rightNode = getProps("rightNode");
    const bottomNode = getProps("bottomNode");
    const topNode = getProps("topNode");
    const wrapCustomer = getProps("wrapCustomer");
    const crossAlign = getProps("crossAlign") || "start";
    let spacePad = getProps("spacePad");

    if (spacePad === undefined) spacePad = true;

    const touched = form.getTouched(name);
    const changed = form.getChanged(name);
    const error = methods.getError(name);

    // 是否应显示error / 显示何种类型的错误
    const showError = error && touched;
    const showRegularError = showError && !bubbleFeedback;
    const showBubbleError = showError && bubbleFeedback;

    const hasRequired = useMemo(() => {
      const marker = getProps("requireMarker");

      if (marker === false) return false;

      return validator.find((i) => i.key === requiredValidatorKey);
    }, [validator]);

    if (!methods.shouldRender()) return null;

    // 无样式渲染
    if (noLayout) {
      return render();
    }

    // 布局渲染
    const bubbleDescribe = renderBubbleDescribe();
    // 是否应该显示label容器, 有label或者有气泡描述时显示
    const shouldShowLabel = !!label || !!bubbleDescribe;
    const labelNode = hasRequired ? (
      <>
        <span className="color-red fs-md vm mr">*</span>
        {label}
      </>
    ) : (
      label
    );

    // 渲染表单控件
    function render(): React.ReactNode {
      // 列表渲染
      if (isList) return renderList();

      const bind = methods.getBind();

      if (isFunction(fieldCustomer)) {
        return fieldCustomer(methods.getRenderArgs()) as React.ReactElement;
      }

      // children 渲染
      if (isFunction(children)) {
        return children(methods.getRenderArgs()) as React.ReactElement;
      }

      if (isValidElement<any>(children)) {
        return React.cloneElement(children, bind);
      }

      // 注册组件渲染
      const component = methods.getRegisterComponent();
      const componentProps = getProps("componentProps");

      if (!isValidElement<any>(component)) {
        console.warn(
          `Form: "${filedCtx.strName} - Failed to get form component with rendering, please configure it through children/fieldCustomer or register.`
        );
        return;
      }

      return React.cloneElement(component, {
        ...component.props,
        ...componentProps,
        ...bind,
      });
    }

    // list渲染逻辑
    function renderList() {
      if (!isList) return null;

      const listProps = props as FormListProps;

      const hasChildren = isFunction(listProps.children);
      const hasLayoutRender = isFunction(listProps.layoutRender);

      if ((!hasChildren && !hasLayoutRender) || !schema?.list) {
        console.warn(
          `Form: "${filedCtx.strName}" - List must passed a function as children or layoutRender, and schema must have list config.`
        );
        return null;
      }

      const args: FormListCustomRenderArgs = {
        config: ctx.config,
        form: ctx.form,
        props,
        getProps,
        render: _listRenderImpl(ctx, props),
        ...methods.listApiSimplify(name),
      };

      if (hasChildren) {
        // 由于是复用field, 这里可以确认children类型是FormListRenderChildren
        return listProps.children!(args);
      }

      if (hasLayoutRender) {
        return _listLayoutRenderImpl(
          ctx,
          filedCtx,
          methods,
          schema
        )(args, listProps.layoutRender!);
      }
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

    // 渲染lay组件的leading部分
    function renderLayLeading() {
      const _leftNode = methods.extraNodeRenderHelper(leftNode);

      if (layoutType === FormLayoutType.horizontal && shouldShowLabel) {
        return (
          <div className="m78-form_label m78-form_horizontal-label">
            {_leftNode}
            {labelNode}
            {bubbleDescribe}
          </div>
        );
      }

      return _leftNode;
    }

    // 渲染lay组件的trailing部分
    function renderLayTrailing() {
      return methods.extraNodeRenderHelper(rightNode);
    }

    // 处理wrapCustomer渲染
    function wrapCustomerRender(node: React.ReactElement) {
      if (isSchemaRootRender && isFunction(wrapCustomer)) {
        return wrapCustomer(methods.getRenderArgs(), node) as any;
      }
      return node;
    }

    // 主内容
    function renderMain() {
      return (
        <Lay
          innerRef={wrapRef}
          crossAlign={crossAlign}
          leading={renderLayLeading()}
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
          trailing={renderLayTrailing()}
        >
          {layoutType === FormLayoutType.vertical && shouldShowLabel && (
            <div className="m78-form_label m78-form_vertical-label">
              {labelNode}
              {bubbleDescribe}
            </div>
          )}
          <div className="m78-form_unit">
            {render()}
            {renderBubbleError()}
          </div>
          {!bubbleFeedback && describe && (
            <div className="m78-form_describe">{describe}</div>
          )}
          <div
            className={clsx(
              "m78-form_error",
              !spacePad && "m78-form_empty-hide"
            )}
            role="alert"
            style={{
              opacity: showRegularError ? 1 : 0,
              visibility: showRegularError ? "visible" : "hidden",
            }}
          >
            {bubbleFeedback || !showRegularError ? "" : error}
          </div>
          {changed && getProps("modifyMarker") && (
            <span className="m78-form_changed-mark" />
          )}
        </Lay>
      );
    }

    const _topNode = methods.extraNodeRenderHelper(topNode);
    const _bottomNode = methods.extraNodeRenderHelper(bottomNode);

    if (_topNode || _bottomNode) {
      return wrapCustomerRender(
        <>
          {_topNode}
          {renderMain()}
          {_bottomNode}
        </>
      );
    }

    return wrapCustomerRender(renderMain());
  };

  (form.Field as React.FunctionComponent).displayName = "Field";
}
