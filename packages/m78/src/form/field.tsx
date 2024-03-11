import {
  _FormContext,
  _FieldContext,
  FormLayoutType,
  FormListCustomRenderArgs,
  FormListProps,
  FormCustomRenderWrapperArgs,
  FormSchema,
} from "./types.js";
import { useSetState } from "@m78/hooks";
import React, { isValidElement, useMemo, useRef } from "react";
import {
  createRandString,
  ensureArray,
  getNamePathValue,
  isEmpty,
  isFunction,
  isTruthyOrZero,
  stringifyNamePath,
  createTempID,
} from "@m78/utils";
import { Lay } from "../lay/index.js";
import { Bubble } from "../bubble/index.js";
import { IconAttention } from "@m78/icons/attention.js";
import clsx from "clsx";
import { _useFieldMethods } from "./use-field-methods.js";
import { _useFieldLifeCircle } from "./use-field-life-circle.js";
import { _listLayoutRenderImpl, _listRenderImpl } from "./list.js";
import { requiredValidatorKey } from "@m78/form/validator/index.js";
import { _defaultAdaptor, EMPTY_NAME } from "./common.js";
import { isRootName } from "@m78/form";

export function _fieldImpl(ctx: _FormContext) {
  const { form } = ctx;

  /** 实现Field组件 */
  form.Field = (props) => {
    const { name: _name } = props;

    const [name, strName, isRoot] = useMemo(() => {
      if (!isTruthyOrZero(_name)) return [EMPTY_NAME, EMPTY_NAME, false];
      if (isRootName(_name)) return [[], "[]", true];
      return [_name!, stringifyNamePath(_name!), false];
    }, [_name]);

    const id = useMemo(() => createRandString(2), []);

    const [state, setState] = useSetState(() => ({
      /** 当前组件的schema */
      schema: isRoot
        ? (form.getSchemas().schemas as any as FormSchema)
        : form.getSchema(name),
      /** 手动更新组件的标记 */
      renderKey: createTempID(),
    }));

    const schema = state.schema;
    const validator = ensureArray(schema?.validator) || [];

    // 由于 list 和 field 逻辑基本一致, 所以通过私有 props 来区分, 并在内部做特殊处理
    const isList = getNamePathValue(props, "__isList");

    const wrapRef = useRef<HTMLDivElement>(null!);

    // 在组件内共享的上下文对象
    const filedCtx: _FieldContext = {
      state,
      setState,
      isList,
      props,
      name,
      wrapRef,
      id,
      strName,
      isRoot,
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
    const preventDefaultRenders = getProps("preventDefaultRenders");
    const bubbleDescribe = getProps("bubbleDescribe");
    const leftNode = getProps("leftNode");
    const rightNode = getProps("rightNode");
    const bottomNode = getProps("bottomNode");
    const topNode = getProps("topNode");
    const crossAlign = getProps("crossAlign") || "start";
    let spacePadding = getProps("spacePadding");

    const { adaptorConf, elementRender } = methods.getAdaptor();

    console.log(adaptorConf);

    if (spacePadding === undefined) spacePadding = true;

    const touched = form.getTouched(name);
    const changed = form.getChanged(name);
    const error = methods.getError(name);

    // 是否应显示error / 显示何种类型的错误
    const showError = error && touched;

    // 是否显示必填标记
    const hasRequired = useMemo(() => {
      const marker = getProps("requireMarker");

      if (marker === false) return false;

      return validator.find((i) => i.key === requiredValidatorKey);
    }, [validator]);

    // 阻止渲染 valid/hidden 等
    if (!methods.shouldRender()) return null;

    // 无样式渲染
    if (preventDefaultRenders) return renderWidget();

    // 布局渲染
    const bubbleDescribeNode = renderBubbleDescribe();

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

    // 渲染表单控件 或 list
    function renderWidget(): React.ReactNode {
      // 列表渲染
      if (isList) return renderList();

      if (elementRender) {
        return elementRender(methods.getRenderArgs());
      }

      if (!adaptorConf) return null;

      let ele: React.ReactElement | null = adaptorConf.element;

      const { formAdaptor = _defaultAdaptor } = adaptorConf;

      if (formAdaptor) {
        ele = formAdaptor(methods.getRenderArgs());
      }

      if (!isValidElement<any>(ele)) return null;

      const elementProps = getProps("elementProps");

      if (isEmpty(elementProps)) return ele;

      return React.cloneElement(ele, {
        ...ele.props,
        ...elementProps,
      });
    }

    // list渲染逻辑
    function renderList() {
      if (!isList) return null;

      const listProps = props as FormListProps;

      const hasRender = isFunction(listProps.render);
      const hasLayoutRender = isFunction(listProps.layoutRender);

      if ((!hasRender && !hasLayoutRender) || !schema?.list) {
        console.warn(
          `Form: "${filedCtx.strName}" - <List/> must passed render or layoutRender, and schema must set list = true`
        );
        return null;
      }

      const args: FormListCustomRenderArgs = {
        form: ctx.form,
        config: ctx.config,
        props,
        getProps,
        render: _listRenderImpl(ctx, props), // there
        ...methods.listApiSimplify(name),
      };

      if (hasRender) {
        return listProps.render!(args);
      }

      if (hasLayoutRender) {
        return _listLayoutRenderImpl(
          filedCtx,
          methods,
          schema
        )(args, listProps.layoutRender!);
      }
    }

    // 渲染使用气泡展示的错误消息
    function renderError() {
      return (
        <div
          className="m78-form_bubble-error"
          role="alert"
          style={{
            opacity: showError ? 1 : 0,
            visibility: showError ? "visible" : "hidden",
          }}
        >
          {error}
        </div>
      );
    }

    // 渲染气泡形式的描述
    function renderBubbleDescribe() {
      if (!describe || !bubbleDescribe) return null;
      return (
        <Bubble content={describe}>
          <IconAttention className="m78-form_describe-icon" />
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
            {bubbleDescribeNode}
          </div>
        );
      }

      return _leftNode;
    }

    // 渲染lay组件的trailing部分
    function renderLayTrailing() {
      return methods.extraNodeRenderHelper(rightNode);
    }

    // 处理customer渲染
    function customerRender(node: React.ReactElement) {
      const customerList = [
        props.customer,
        schema?.customer,
        ctx.config.customer,
      ];

      let prevent = false;

      const args: FormCustomRenderWrapperArgs = {
        ...methods.getRenderArgs(),
        element: node,
        preventNext() {
          prevent = true;
        },
      };

      for (const cus of customerList) {
        if (prevent) break;
        if (cus) {
          args.element = cus(args);
        }
      }

      return args.element as any;
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
            `__${layoutType}`,
            size && `__${size}`,
            !spacePadding && `__no-pad`,
            getProps("className")
          )}
          style={{ maxWidth: methods.getWidth(), ...getProps("style") }}
          trailing={renderLayTrailing()}
        >
          {layoutType === FormLayoutType.vertical && shouldShowLabel && (
            <div className="m78-form_label m78-form_vertical-label">
              {labelNode}
              {bubbleDescribeNode}
            </div>
          )}
          <div className="m78-form_unit">
            {renderWidget()}
            {renderError()}
          </div>
          {!bubbleDescribe && describe && (
            <div className="m78-form_describe">{describe}</div>
          )}
          {changed && <span className="m78-form_changed-mark" />}
        </Lay>
      );
    }

    const _topNode = methods.extraNodeRenderHelper(topNode);
    const _bottomNode = methods.extraNodeRenderHelper(bottomNode);

    if (_topNode || _bottomNode) {
      return customerRender(
        <>
          {_topNode}
          {renderMain()}
          {_bottomNode}
        </>
      );
    }

    return customerRender(renderMain());
  };

  (form.Field as React.FunctionComponent).displayName = "Field";
}
