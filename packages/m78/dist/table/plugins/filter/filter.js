import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { RCTablePlugin } from "../../plugin.js";
import React from "react";
import { _FilterBtn, _ToolbarCommonFilterBtn, _ToolBarFilterBtn, _ToolBarQueryBtn } from "./filter-btn.js";
import { Divider } from "../../../layout/index.js";
export var _FilterPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_FilterPlugin, RCTablePlugin);
    var _super = _create_super(_FilterPlugin);
    function _FilterPlugin() {
        _class_call_check(this, _FilterPlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _FilterPlugin.prototype;
    // 扩展左侧按钮
    _proto.toolbarLeadingCustomer = function toolbarLeadingCustomer(nodes) {
        var searchBtn = /*#__PURE__*/ _jsx(_ToolBarQueryBtn, {});
        var resetFilterBtn = /*#__PURE__*/ _jsx(_ToolBarFilterBtn, {});
        var filterBtn = /*#__PURE__*/ _jsx(_ToolbarCommonFilterBtn, {});
        nodes.unshift(searchBtn, /*#__PURE__*/ _jsx(Divider, {
            vertical: true
        }), resetFilterBtn, filterBtn);
    };
    // 表头绘制控制, 添加过滤/排序按钮
    _proto.rcCellRender = function rcCellRender(data) {
        var cell = data.cell;
        var column = cell.column;
        if (cell.row.isHeader && !column.isHeader) {
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx("span", {
                        children: cell.text
                    }),
                    /*#__PURE__*/ _jsx("span", {
                        className: "m78-table_header-icons",
                        children: /*#__PURE__*/ _jsx(_FilterBtn, {
                            cell: cell
                        })
                    })
                ]
            });
        }
    };
    return _FilterPlugin;
}(RCTablePlugin);
