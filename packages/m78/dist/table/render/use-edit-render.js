import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx } from "react/jsx-runtime";
import { useFn } from "@m78/hooks";
import React, { cloneElement, isValidElement } from "react";
import { delay, isBoolean, isFunction, isString, stringifyNamePath } from "@m78/utils";
import { _useStateAct } from "../injector/state.act.js";
import { _injector } from "../table.js";
import { throwError } from "../../common/index.js";
import { m78Config } from "../../config/index.js";
import { _getTableCtx } from "../common.js";
import { Overlay } from "../../overlay/index.js";
import { TransitionType } from "../../transition/index.js";
// 自定义编辑逻辑
export function _useEditRender() {
    var _injector_useDeps = _injector.useDeps(_useStateAct), state = _injector_useDeps.state, self = _injector_useDeps.self, dataOperations = _injector_useDeps.dataOperations;
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
        if (state.instance) {
            var ctx = _getTableCtx(state.instance);
            var meta = ctx.getRowMeta(cell.row.key);
            var isNew = meta.new;
            if (!isNew) {
                if (dataOperations.edit === false) return false;
                if (isFunction(dataOperations.edit) && !dataOperations.edit(cell)) return false;
            }
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
    var _injector_useDeps = _injector.useDeps(_useStateAct), self = _injector_useDeps.self, state = _injector_useDeps.state;
    var _React_useState = _sliced_to_array(React.useState([]), 2), list = _React_useState[0], setList = _React_useState[1];
    // 更新渲染列表
    var update = useFn(function() {
        var ls = Object.keys(self.editMap).map(function(key) {
            return self.editMap[key];
        });
        setList(ls);
    });
    state.instance.event.interactiveChange.useEvent(update);
    return list.map(function(i) {
        return /*#__PURE__*/ _jsx(Overlay, {
            content: i.element,
            target: i.node,
            open: true,
            transitionType: TransitionType.none,
            autoFocus: false,
            lockScroll: false,
            clickAwayClosable: false,
            clickAwayQueue: false,
            escapeClosable: false,
            style: {
                width: i.node.clientWidth,
                height: i.node.clientHeight,
                borderRadius: 0
            }
        }, i.cell.key);
    });
}
