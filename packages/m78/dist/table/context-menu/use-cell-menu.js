import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { useFn } from "@m78/hooks";
import { TriggerType } from "../../trigger/index.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { IconClipboard } from "@m78/icons/clipboard.js";
import { IconCopy } from "@m78/icons/copy.js";
import { IconToTop } from "@m78/icons/to-top.js";
import { IconToBottom } from "@m78/icons/to-bottom.js";
import { IconDeleteOne } from "@m78/icons/delete-one.js";
import { IconBack } from "@m78/icons/back.js";
import { TABLE_NS, useTranslation } from "../../i18n/index.js";
import { isTruthyOrZero } from "@m78/utils";
import { _useMethodsAct } from "../injector/methods.act.js";
var MenuValues;
(function(MenuValues) {
    MenuValues[MenuValues["copy"] = 0] = "copy";
    MenuValues[MenuValues["paste"] = 1] = "paste";
    MenuValues[MenuValues["insertTop"] = 2] = "insertTop";
    MenuValues[MenuValues["insertBottom"] = 3] = "insertBottom";
    MenuValues[MenuValues["remove"] = 4] = "remove";
    MenuValues[MenuValues["restoreRemove"] = 5] = "restoreRemove";
})(MenuValues || (MenuValues = {}));
export function _useCellMenu() {
    var state = _injector.useDeps(_useStateAct).state;
    var methods = _injector.useDeps(_useMethodsAct);
    var props = _injector.useProps();
    var instance = state.instance;
    var confirm = useFn(function(_, option) {
        if (option.context) option.context();
    });
    var t = useTranslation(TABLE_NS).t;
    // 根据事件对象获取右键菜单信息
    return useFn(function(e) {
        if (e.type !== TriggerType.contextMenu) return;
        var point = instance.transformViewportPoint([
            e.offsetX,
            e.offsetY
        ]);
        var item = instance.getBoundItems(point.xy).cells[0];
        if (!item) return;
        if (item.row.isHeader) return;
        // 当前单元格是否选中, 会影响部分上下文行为
        var isSelected = item.column.isHeader ? instance.isSelectedRow(item.row.key) : instance.isSelectedCell(item.key);
        // 当前单元格选中时, 检测选中单元格并改为对选中单元格进行操作
        var selected = isSelected ? instance.getSelectedCells() : [];
        var selectedRows = [
            item.row
        ];
        if (isSelected) {
            // 根据操作的列是否是行头来确定选中行
            if (item.column.isHeader) {
                selectedRows = instance.getSelectedRows();
            } else if (isSelected) {
                selectedRows = instance.getSortedSelectedCells().map(function(i) {
                    var _i_;
                    return (_i_ = i[0]) === null || _i_ === void 0 ? void 0 : _i_.row;
                }).filter(isTruthyOrZero);
            }
        }
        var hasMultipleSelected = selected.length > 1;
        var hasMultipleSelectedRow = selectedRows.length > 1;
        // 仅限单元格显示的菜单
        var cellOnlyMenu = item.column.isHeader ? [] : [
            {
                label: hasMultipleSelected ? t("copy cells") : t("copy cell"),
                leading: /*#__PURE__*/ _jsx(IconCopy, {}),
                value: 0,
                context: function context() {
                    if (!hasMultipleSelected) {
                        // 选中当前单元格
                        instance.selectCells(item.key);
                    }
                    instance.copy();
                }
            },
            {
                label: hasMultipleSelected ? t("paste cells") : t("paste cell"),
                leading: /*#__PURE__*/ _jsx(IconClipboard, {}),
                value: 1,
                context: function context() {
                    if (!hasMultipleSelected) {
                        // 选中当前单元格
                        instance.selectCells(item.key);
                    }
                    instance.paste();
                }
            }
        ];
        // 插入数据相关菜单
        var insertMenus = item.row.isFixed ? [] : [
            {
                label: t("insert top"),
                leading: /*#__PURE__*/ _jsx(IconToTop, {}),
                value: 2,
                context: function context() {
                    instance.addRow(methods.getDefaultNewData(), item.row.key, false);
                }
            },
            {
                label: t("insert bottom"),
                leading: /*#__PURE__*/ _jsx(IconToBottom, {}),
                value: 3,
                context: function context() {
                    instance.addRow(methods.getDefaultNewData(), item.row.key, true);
                }
            }
        ];
        var removeMenus = [];
        if (instance.isSoftRemove(item.row.key)) {
            removeMenus.push({
                label: /*#__PURE__*/ _jsxs("span", {
                    children: [
                        t("restore row"),
                        selectedRows.length > 1 ? /*#__PURE__*/ _jsxs("span", {
                            children: [
                                " (",
                                selectedRows.length,
                                ")"
                            ]
                        }) : null
                    ]
                }),
                value: 5,
                leading: /*#__PURE__*/ _jsx(IconBack, {}),
                context: function context() {
                    instance.restoreSoftRemove(selectedRows.map(function(i) {
                        return i.key;
                    }));
                }
            });
        } else {
            removeMenus.push({
                label: /*#__PURE__*/ _jsxs("span", {
                    children: [
                        hasMultipleSelectedRow ? t("remove rows") : t("remove row"),
                        selectedRows.length > 1 ? /*#__PURE__*/ _jsxs("span", {
                            children: [
                                " (",
                                selectedRows.length,
                                ")"
                            ]
                        }) : null
                    ]
                }),
                value: 4,
                leading: /*#__PURE__*/ _jsx(IconDeleteOne, {
                    className: "color-error"
                }),
                className: "color-error",
                context: function context() {
                    props.softRemove ? instance.softRemove(selectedRows.map(function(i) {
                        return i.key;
                    })) : instance.removeRow(selectedRows.map(function(i) {
                        return i.key;
                    }));
                }
            });
        }
        return {
            xy: [
                e.x,
                e.y
            ],
            cb: confirm,
            menu: _to_consumable_array(cellOnlyMenu).concat(_to_consumable_array(insertMenus), _to_consumable_array(removeMenus))
        };
    });
}
