import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { _TablePrivateProperty } from "../../table-vanilla/index.js";
import { useFn } from "@m78/hooks";
import React, { cloneElement, isValidElement } from "react";
import ReactDom from "react-dom";
import { delay, getNamePathValue, isBoolean, isFunction, isString, stringifyNamePath } from "@m78/utils";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { throwError } from "../../common/index.js";
import { m78Config } from "../../config/index.js";
// 自定义编辑逻辑
export function _useEditRender() {
    var ref = _injector.useDeps(_useStateAct), state = ref.state, self = ref.self, dataOperations = ref.dataOperations;
    var props = _injector.useProps();
    // 从表格配置/全局配置中获取指定节点的适配器
    var getAdaptors = useFn(function(ele) {
        var item = null;
        var globalAdaptors = m78Config.get().formAdaptors;
        var ls = _to_consumable_array(props.adaptors || []).concat(_to_consumable_array(globalAdaptors));
        if (ls.length) {
            for(var i = 0; i < ls.length; i++){
                var adaptor = ls[i];
                if (/*#__PURE__*/ isValidElement(ele) && /*#__PURE__*/ isValidElement(adaptor.element) && adaptor.element.type === ele.type) {
                    item = adaptor;
                    break;
                }
                if (isString(ele) && adaptor.name === ele) {
                    item = adaptor;
                    break;
                }
            }
        }
        return item;
    });
    /** 检测是否可编辑 */ var checkEditable = useFn(function(name) {
        var sName = stringifyNamePath(name);
        var cache = self.editStatusMap[sName];
        if (isBoolean(cache)) return cache;
        var sh = self.editCheckForm.getSchema(name);
        var editable = !!(sh === null || sh === void 0 ? void 0 : sh.element);
        self.editStatusMap[sName] = editable;
        return editable;
    });
    // 检测单元格是否可编辑
    var interactiveEnableChecker = useFn(function(cell) {
        if (cell.column.isFake || cell.row.isFake) return false;
        var isNew = getNamePathValue(cell.row.data, _TablePrivateProperty.new);
        if (!isNew) {
            if (dataOperations.edit === false) return false;
            if (isFunction(dataOperations.edit) && !dataOperations.edit(cell)) return false;
        }
        return checkEditable(cell.column.config.originalKey);
    });
    // 自定义编辑渲染
    var interactiveRender = useFn(function(param) {
        var cell = param.cell, value = param.value, done = param.done, node = param.node, form = param.form;
        var time = 0;
        var val = value;
        var schema = form.getSchema(cell.column.config.originalKey);
        var schemaElement = schema === null || schema === void 0 ? void 0 : schema.element;
        if (!schemaElement) {
            throwError("can't find element for schema: ".concat(cell.column.key));
        }
        if (isFunction(schemaElement)) {
            throwError("element can't be function: ".concat(cell.column.key));
        }
        var adaptor = getAdaptors(schemaElement);
        if (!adaptor) {
            throwError("can't find adaptor for element: ".concat(cell.column.key, ", please set it in table config or global config."));
        }
        if (!adaptor.tableAdaptor) {
            throwError("can't find tableAdaptor for element: ".concat(cell.column.key));
        }
        var arg = {
            cell: cell,
            table: state.instance,
            context: props.context || {},
            value: value,
            change: function(_val) {
                val = _val;
            },
            form: form,
            submit: function() {
                return done();
            },
            cancel: function() {
                return done(false);
            },
            delayClose: function(t) {
                time = t;
            },
            element: adaptor.element,
            binder: function(element, pp) {
                return /*#__PURE__*/ cloneElement(element, pp);
            },
            prevElement: null
        };
        var ret = adaptor.tableAdaptor(arg);
        self.editMap[cell.key] = {
            cell: cell,
            node: node,
            element: ret
        };
        // 清理/状态同步
        var finish = function(isSubmit) {
            delete self.editMap[cell.key];
            if (isSubmit && val !== value) {
                state.instance.setValue(cell, val);
            }
        };
        return function(isSubmit) {
            // 延迟清理
            if (time > 0) {
                return delay(time).then(function() {
                    finish(isSubmit);
                });
            }
            // 正常清理
            finish(isSubmit);
        };
    });
    return {
        interactiveEnableChecker: interactiveEnableChecker,
        interactiveRender: interactiveRender
    };
}
// 自定义编辑渲染, 组件部分, 用于避免频繁render影响外部作用域
export function _CustomEditRender() {
    var props = _injector.useProps();
    var ref = _injector.useDeps(_useStateAct), self = ref.self, state = ref.state;
    var ref1 = _sliced_to_array(React.useState([]), 2), list = ref1[0], setList = ref1[1];
    // 更新渲染列表
    var update = useFn(function() {
        var ls = Object.keys(self.editMap).map(function(key) {
            return self.editMap[key];
        });
        setList(ls);
    });
    state.instance.event.interactiveChange.useEvent(update);
    return /*#__PURE__*/ _jsx(_Fragment, {
        children: list.map(function(i) {
            return /*#__PURE__*/ ReactDom.createPortal(i.element, i.node, String(i.cell.key));
        })
    });
}
