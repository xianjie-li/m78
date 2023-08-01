import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { FormLayoutType } from "./types.js";
import { useSetState } from "@m78/hooks";
import React, { isValidElement, useMemo, useRef } from "react";
import { createRandString, ensureArray, isFunction, stringifyNamePath } from "@m78/utils";
import { Lay } from "../lay/index.js";
import { Bubble } from "../bubble/index.js";
import { IconErrorOutline } from "@m78/icons/icon-error-outline.js";
import clsx from "clsx";
import { _useFieldMethods } from "./use-field-methods.js";
import { _useFieldLifeCircle } from "./use-field-life-circle.js";
import { _listLayoutRenderImpl, _listRenderImpl } from "./list.js";
import { requiredValidatorKey } from "@m78/verify";
export function _fieldImpl(ctx) {
    var form = ctx.form;
    /** 实现Field组件 */ form.Field = function(props) {
        var render = // 渲染表单控件
        function render() {
            // 列表渲染
            if (isList) return renderList();
            var bind = methods.getBind();
            if (isFunction(fieldCustomer)) {
                return fieldCustomer(methods.getRenderArgs());
            }
            // children 渲染
            if (isFunction(children)) {
                return children(methods.getRenderArgs());
            }
            if (/*#__PURE__*/ isValidElement(children)) {
                return /*#__PURE__*/ React.cloneElement(children, bind);
            }
            // 注册组件渲染
            var component = methods.getRegisterComponent();
            var componentProps = getProps("componentProps");
            if (!/*#__PURE__*/ isValidElement(component)) {
                console.warn('Form: "'.concat(filedCtx.strName, " - Failed to get form component with rendering, please configure it through children/fieldCustomer or register."));
                return;
            }
            return /*#__PURE__*/ React.cloneElement(component, _object_spread({}, component.props, componentProps, bind));
        };
        var renderList = // list渲染逻辑
        function renderList() {
            if (!isList) return null;
            var listProps = props;
            var hasChildren = isFunction(listProps.children);
            var hasLayoutRender = isFunction(listProps.layoutRender);
            if (!hasChildren && !hasLayoutRender || !(schema === null || schema === void 0 ? void 0 : schema.list)) {
                console.warn('Form: "'.concat(filedCtx.strName, '" - List must passed a function as children or layoutRender, and schema must have list config.'));
                return null;
            }
            var args = _object_spread({
                config: ctx.config,
                form: ctx.form,
                props: props,
                getProps: getProps,
                render: _listRenderImpl(ctx, props)
            }, methods.listApiSimplify(name));
            if (hasChildren) {
                // 由于是复用field, 这里可以确认children类型是FormListRenderChildren
                return listProps.children(args);
            }
            if (hasLayoutRender) {
                return _listLayoutRenderImpl(ctx, filedCtx, methods, schema)(args, listProps.layoutRender);
            }
        };
        var renderBubbleError = // 渲染使用气泡展示的错误消息
        function renderBubbleError() {
            if (showRegularError) return null;
            return /*#__PURE__*/ _jsx("div", {
                className: "m78-form_bubble-error",
                style: {
                    opacity: showBubbleError ? 1 : 0,
                    visibility: showBubbleError ? "visible" : "hidden"
                },
                children: error
            });
        };
        var renderBubbleDescribe = // 渲染气泡形式的描述
        function renderBubbleDescribe() {
            if (!describe || !bubbleFeedback) return null;
            return /*#__PURE__*/ _jsx(Bubble, {
                content: describe,
                children: /*#__PURE__*/ _jsx(IconErrorOutline, {
                    className: "m78-form_describe-icon"
                })
            });
        };
        var renderLayLeading = // 渲染lay组件的leading部分
        function renderLayLeading() {
            var _leftNode = methods.extraNodeRenderHelper(leftNode);
            if (layoutType === FormLayoutType.horizontal && shouldShowLabel) {
                return /*#__PURE__*/ _jsxs("div", {
                    className: "m78-form_label m78-form_horizontal-label",
                    children: [
                        _leftNode,
                        labelNode,
                        bubbleDescribe
                    ]
                });
            }
            return _leftNode;
        };
        var renderLayTrailing = // 渲染lay组件的trailing部分
        function renderLayTrailing() {
            return methods.extraNodeRenderHelper(rightNode);
        };
        var wrapCustomerRender = // 处理wrapCustomer渲染
        function wrapCustomerRender(node) {
            if (isSchemaRootRender && isFunction(wrapCustomer)) {
                return wrapCustomer(methods.getRenderArgs(), node);
            }
            return node;
        };
        var renderMain = // 主内容
        function renderMain() {
            return /*#__PURE__*/ _jsxs(Lay, {
                innerRef: wrapRef,
                crossAlign: crossAlign,
                leading: renderLayLeading(),
                effect: false,
                overflowVisible: true,
                className: clsx("m78-form_field", "m78-form_".concat(layoutType), size && "__".concat(size), bubbleFeedback && "__bubble", getProps("className")),
                style: _object_spread({
                    maxWidth: methods.getWidth()
                }, getProps("style")),
                trailing: renderLayTrailing(),
                children: [
                    layoutType === FormLayoutType.vertical && shouldShowLabel && /*#__PURE__*/ _jsxs("div", {
                        className: "m78-form_label m78-form_vertical-label",
                        children: [
                            labelNode,
                            bubbleDescribe
                        ]
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "m78-form_unit",
                        children: [
                            render(),
                            renderBubbleError()
                        ]
                    }),
                    !bubbleFeedback && describe && /*#__PURE__*/ _jsx("div", {
                        className: "m78-form_describe",
                        children: describe
                    }),
                    /*#__PURE__*/ _jsx("div", {
                        className: clsx("m78-form_error", !spacePad && "m78-form_empty-hide"),
                        role: "alert",
                        style: {
                            opacity: showRegularError ? 1 : 0,
                            visibility: showRegularError ? "visible" : "hidden"
                        },
                        children: bubbleFeedback || !showRegularError ? "" : error
                    }),
                    changed && getProps("modifyMarker") && /*#__PURE__*/ _jsx("span", {
                        className: "m78-form_changed-mark"
                    })
                ]
            });
        };
        var name = props.name, children = props.children;
        var id = useMemo(function() {
            return createRandString(2);
        }, []);
        var ref = _sliced_to_array(useSetState(function() {
            return {
                /** 当前组件的schema */ schema: form.getSchema(name),
                /** 手动更新组件的标记 */ renderKey: Math.random()
            };
        }), 2), state = ref[0], setState = ref[1];
        var schema = state.schema;
        var validator = ensureArray(schema === null || schema === void 0 ? void 0 : schema.validator) || [];
        // 由于 list 和 field 逻辑基本一致, 所以通过私有 props 来区分, 并在内部做特殊处理
        var isList = props.__isList;
        // 是否由schema render的根级渲染, 只在这个情况下需要进行wrapCustomer处理
        var isSchemaRootRender = props.__isSchemaRoot;
        var wrapRef = useRef(null);
        var filedCtx = {
            state: state,
            setState: setState,
            isList: isList,
            props: props,
            name: name,
            wrapRef: wrapRef,
            id: id,
            strName: stringifyNamePath(name)
        };
        // 组件方法
        var methods = _useFieldMethods(ctx, filedCtx);
        // 组件生命周期
        _useFieldLifeCircle(ctx, filedCtx, methods);
        var getProps = methods.getProps;
        var layoutType = getProps("layoutType");
        var label = getProps("label");
        var describe = getProps("describe");
        var size = getProps("size");
        var noLayout = getProps("noLayout");
        var fieldCustomer = getProps("fieldCustomer");
        var bubbleFeedback = getProps("bubbleFeedback");
        var leftNode = getProps("leftNode");
        var rightNode = getProps("rightNode");
        var bottomNode = getProps("bottomNode");
        var topNode = getProps("topNode");
        var wrapCustomer = getProps("wrapCustomer");
        var crossAlign = getProps("crossAlign") || "start";
        var spacePad = getProps("spacePad");
        if (spacePad === undefined) spacePad = true;
        var touched = form.getTouched(name);
        var changed = form.getChanged(name);
        var error = methods.getError(name);
        // 是否应显示error / 显示何种类型的错误
        var showError = error && touched;
        var showRegularError = showError && !bubbleFeedback;
        var showBubbleError = showError && bubbleFeedback;
        var hasRequired = useMemo(function() {
            var marker = getProps("requireMarker");
            if (marker === false) return false;
            return validator.find(function(i) {
                return i.key === requiredValidatorKey;
            });
        }, [
            validator
        ]);
        if (!methods.shouldRender()) return null;
        // 无样式渲染
        if (noLayout) {
            return render();
        }
        // 布局渲染
        var bubbleDescribe = renderBubbleDescribe();
        // 是否应该显示label容器, 有label或者有气泡描述时显示
        var shouldShowLabel = !!label || !!bubbleDescribe;
        var labelNode = hasRequired ? /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                /*#__PURE__*/ _jsx("span", {
                    className: "color-red fs-md vm mr",
                    children: "*"
                }),
                label
            ]
        }) : label;
        var _topNode = methods.extraNodeRenderHelper(topNode);
        var _bottomNode = methods.extraNodeRenderHelper(bottomNode);
        if (_topNode || _bottomNode) {
            return wrapCustomerRender(/*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    _topNode,
                    renderMain(),
                    _bottomNode
                ]
            }));
        }
        return wrapCustomerRender(renderMain());
    };
    form.Field.displayName = "Field";
}
