import _define_property from "@swc/helpers/src/_define_property.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { _formKeyCustomerKeys, _formPropsKeys, _lisIgnoreKeys, FormLayoutType } from "./types.js";
import { useFn } from "@m78/hooks";
import { ensureArray, isArray, isBoolean, isFunction, isString } from "@m78/utils";
import { _defaultValueGetter } from "./common.js";
import React, { isValidElement } from "react";
export function _useFieldMethods(ctx, fieldCtx) {
    var shouldRender = // 是否应该渲染实际内容
    function shouldRender() {
        if (!name) return false;
        if (isArray(name) && !name.length) return false;
        if ((schema === null || schema === void 0 ? void 0 : schema.valid) === false || getProps("hidden")) return false;
        //.
        return true;
    };
    var getWidth = // 根据layoutType/props获取宽度
    function getWidth() {
        var maxWidth = getProps("maxWidth");
        var layoutType = getProps("layoutType");
        if (maxWidth) return maxWidth;
        if (layoutType === FormLayoutType.vertical) return 348;
        if (layoutType === FormLayoutType.horizontal) return 440;
        return undefined;
    };
    var getBind = // 获取绑定到表单控件的属性
    function getBind() {
        var _obj;
        var bindProps = (_obj = {}, _define_property(_obj, valueKey, form.getValue(name)), _define_property(_obj, changeKey, onChange), _obj);
        if (isBoolean(disabled)) {
            bindProps[disabledKey] = disabled;
        }
        if (size) {
            bindProps[sizeKey] = size;
        }
        var ignoreBindKeys = ensureArray(getProps("ignoreBindKeys"));
        if (ignoreBindKeys.length) {
            ignoreBindKeys.forEach(function(key) {
                delete bindProps[key];
            });
        }
        return bindProps;
    };
    var getComponent = /** 获取注册的组件及其信息 */ function getComponent() {
        var nil = [
            null,
            null
        ];
        var componentKey = props.component || (schema === null || schema === void 0 ? void 0 : schema.component);
        if (/*#__PURE__*/ isValidElement(componentKey)) return [
            componentKey,
            null
        ];
        if (!isString(componentKey)) return nil;
        var componentConfig = ctx.components;
        var cur = componentConfig[componentKey];
        if (!cur) {
            console.warn("component ".concat(componentKey, " is not registered. Please register it in the components attribute in the Form.config"));
            return nil;
        }
        if (/*#__PURE__*/ isValidElement(cur)) return [
            cur,
            null
        ];
        if (!/*#__PURE__*/ isValidElement(cur.component)) return nil;
        return [
            cur.component,
            cur
        ];
    };
    var getRegisterComponent = /** 获取注册的组件 */ function getRegisterComponent() {
        return component;
    };
    var extraNodeRenderHelper = /** 渲染 node | (arg) => node 定制节点 */ function extraNodeRenderHelper(node) {
        if (isFunction(node)) {
            return node({
                config: config,
                form: form,
                bind: getBind(),
                props: props,
                getProps: getProps
            });
        }
        return node;
    };
    var getRenderArgs = /** 获取render arg */ function getRenderArgs() {
        return {
            config: config,
            form: form,
            bind: getBind(),
            props: props,
            getProps: getProps
        };
    };
    var form = ctx.form, config = ctx.config;
    var state = fieldCtx.state, isList = fieldCtx.isList, props = fieldCtx.props, name = fieldCtx.name;
    var schema = state.schema;
    var ref = _sliced_to_array(getComponent(), 2), component = ref[0], componentData = ref[1];
    // 依次从props, schema, config中获取通用属性
    var getProps = function(key) {
        // 排序需要从 list 中去除的属性
        if (isList && _lisIgnoreKeys.includes(key)) return;
        if (props[key] !== undefined) return props[key];
        if ((schema === null || schema === void 0 ? void 0 : schema[key]) !== undefined) return schema === null || schema === void 0 ? void 0 : schema[key];
        if (componentData && _formKeyCustomerKeys.includes(key)) {
            var cur = componentData[key];
            if (cur !== undefined) return cur;
            return;
        }
        if (_formPropsKeys.includes(key)) {
            return config === null || config === void 0 ? void 0 : config[key];
        }
    };
    var valueGetter = getProps("valueGetter");
    var valueKey = getProps("valueKey") || "value";
    var changeKey = getProps("changeKey") || "onChange";
    var disabledKey = getProps("disabledKey") || "disabled";
    var sizeKey = getProps("sizeKey") || "size";
    var disabled = getProps("disabled");
    var size = getProps("size");
    // change handle
    var onChange = useFn(function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        var value = valueGetter ? valueGetter.apply(void 0, _to_consumable_array(args)) : _defaultValueGetter(args[0]);
        form.setValue(name, value);
    });
    /** 获取第一条错误 */ var getError = function(name) {
        var err = form.getErrors(name);
        if (!err.length) return "";
        return err[0].message;
    };
    /** 根据传入 name 缩短 form list 系列 api 签名 */ var listApiSimplify = function(name) {
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
    };
    return {
        getProps: getProps,
        onChange: onChange,
        shouldRender: shouldRender,
        getWidth: getWidth,
        getBind: getBind,
        getError: getError,
        listApiSimplify: listApiSimplify,
        getRegisterComponent: getRegisterComponent,
        extraNodeRenderHelper: extraNodeRenderHelper,
        getRenderArgs: getRenderArgs
    };
}
