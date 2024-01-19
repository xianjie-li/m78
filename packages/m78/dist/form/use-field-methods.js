import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _formPropsKeys, _lisIgnoreKeys, FormLayoutType } from "./types.js";
import { useFn } from "@m78/hooks";
import { isBoolean, isFunction, isString } from "@m78/utils";
import React, { cloneElement, isValidElement } from "react";
import { _defaultValueGetter } from "./common.js";
export function _useFieldMethods(ctx, fieldCtx) {
    var form = ctx.form, config = ctx.config, adaptorsMap = ctx.adaptorsMap, adaptorsNameMap = ctx.adaptorsNameMap;
    var state = fieldCtx.state, isList = fieldCtx.isList, props = fieldCtx.props, name = fieldCtx.name;
    var schema = state.schema;
    // 依次从props, schema, config中获取通用属性
    var getProps = useFn(function(key) {
        // 排序需要从 list 中去除的属性
        if (isList && _lisIgnoreKeys.includes(key)) return;
        if (props[key] !== undefined) return props[key];
        if ((schema === null || schema === void 0 ? void 0 : schema[key]) !== undefined) return schema === null || schema === void 0 ? void 0 : schema[key];
        if (_formPropsKeys.includes(key)) {
            return config === null || config === void 0 ? void 0 : config[key];
        }
    });
    var disabled = getProps("disabled");
    var size = getProps("size");
    // change handle
    var onChange = useFn(function(value) {
        form.setValue(name, _defaultValueGetter(value));
    });
    // 是否应该渲染实际内容
    var shouldRender = useFn(function() {
        if ((schema === null || schema === void 0 ? void 0 : schema.valid) === false || getProps("hidden")) return false;
        return true;
    });
    // 根据layoutType/props获取宽度
    var getWidth = useFn(function() {
        var maxWidth = getProps("maxWidth");
        var layoutType = getProps("layoutType");
        if (maxWidth) return maxWidth;
        if (layoutType === FormLayoutType.vertical) return 348;
        if (layoutType === FormLayoutType.horizontal) return 440;
        return undefined;
    });
    // 获取绑定到表单控件的属性
    var getBind = useFn(function() {
        var bindProps = {
            value: form.getValue(name),
            onChange: onChange
        };
        if (isBoolean(disabled)) {
            bindProps.disabled = disabled;
        }
        if (size) {
            bindProps.size = size;
        }
        return bindProps;
    });
    /** 获取第一条错误 */ var getError = useFn(function(name) {
        var err = form.getErrors(name);
        if (!err.length) return "";
        return err[0].message;
    });
    /** 根据传入 name 缩短 list api 签名 */ var listApiSimplify = useFn(function(name) {
        var add = function(items, index) {
            return form.listAdd(name, items, index);
        };
        var remove = function(index) {
            return form.listRemove(name, index);
        };
        var move = function(from, to) {
            return form.listMove(name, from, to);
        };
        var swap = function(from, to) {
            return form.listSwap(name, from, to);
        };
        return {
            add: add,
            remove: remove,
            move: move,
            swap: swap
        };
    });
    /** 获取组件适配器配置信息 */ var getAdaptor = useFn(function() {
        var element = props.element || (schema === null || schema === void 0 ? void 0 : schema.element);
        var adaptor = props.adaptor || (schema === null || schema === void 0 ? void 0 : schema.adaptor);
        var aConf;
        if (isFunction(element)) {
            return {
                elementRender: element
            };
        }
        if (/*#__PURE__*/ isValidElement(element)) {
            var conf = adaptorsMap.get(element.type);
            aConf = _object_spread_props(_object_spread({}, conf), {
                element: element
            });
            if (adaptor) aConf.formAdaptor = adaptor;
            return {
                adaptorConf: aConf
            };
        } else if (isString(element)) {
            var aConf1 = adaptorsNameMap.get(element);
            if (!aConf1) {
                console.warn("form widget ".concat(element, " is not config. Please config it in the adaptors attribute in the Form.config or m78Config"));
                return {};
            }
            if (adaptor) aConf1.formAdaptor = adaptor;
            return {
                adaptorConf: aConf1
            };
        }
        return {};
    });
    var adaptorConf = getAdaptor().adaptorConf;
    /** 获取render arg */ var getRenderArgs = useFn(function() {
        return {
            bind: getBind(),
            binder: function(element, pp) {
                if (!/*#__PURE__*/ isValidElement(element)) return null;
                return /*#__PURE__*/ cloneElement(element, pp);
            },
            form: form,
            config: config,
            props: props,
            getProps: getProps,
            element: (adaptorConf === null || adaptorConf === void 0 ? void 0 : adaptorConf.element) || null
        };
    });
    /** 渲染 node | (arg) => node 定制节点 */ var extraNodeRenderHelper = useFn(function(node) {
        if (isFunction(node)) {
            return node(getRenderArgs());
        }
        return node;
    });
    return {
        getProps: getProps,
        getAdaptor: getAdaptor,
        onChange: onChange,
        shouldRender: shouldRender,
        getWidth: getWidth,
        getBind: getBind,
        getError: getError,
        listApiSimplify: listApiSimplify,
        extraNodeRenderHelper: extraNodeRenderHelper,
        getRenderArgs: getRenderArgs
    };
}
