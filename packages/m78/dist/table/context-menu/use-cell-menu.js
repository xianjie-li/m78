import _async_to_generator from "@swc/helpers/src/_async_to_generator.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import _ts_generator from "@swc/helpers/src/_ts_generator.mjs";
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
import { COMMON_NS, TABLE_NS, useTranslation } from "../../i18n/index.js";
import { isTruthyOrZero } from "@m78/utils";
import { _useMethodsAct } from "../injector/methods.act.js";
import { Dialog } from "../../dialog/index.js";
var MenuValues;
(function(MenuValues) {
    MenuValues[MenuValues["copy"] = 0] = "copy";
    MenuValues[MenuValues["paste"] = 1] = "paste";
    MenuValues[MenuValues["insertTop"] = 2] = "insertTop";
    MenuValues[MenuValues["insertBottom"] = 3] = "insertBottom";
    MenuValues[MenuValues["delete"] = 4] = "delete";
})(MenuValues || (MenuValues = {}));
export function _useCellMenu() {
    var state = _injector.useDeps(_useStateAct).state;
    var methods = _injector.useDeps(_useMethodsAct);
    var instance = state.instance;
    var confirm = useFn(function(val, option) {
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
                    var ref;
                    return (ref = i[0]) === null || ref === void 0 ? void 0 : ref.row;
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
                value: MenuValues.copy,
                context: function() {
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
                value: MenuValues.paste,
                context: function() {
                    if (!hasMultipleSelected) {
                        // 选中当前单元格
                        instance.selectCells(item.key);
                    }
                    instance.paste();
                }
            }, 
        ];
        // 插入数据相关菜单
        var insertMenus = item.row.isFixed ? [] : [
            {
                label: t("insert top"),
                leading: /*#__PURE__*/ _jsx(IconToTop, {}),
                value: MenuValues.insertTop,
                context: function() {
                    instance.addRow(methods.getDefaultNewData(), item.row.key, false);
                }
            },
            {
                label: t("insert bottom"),
                leading: /*#__PURE__*/ _jsx(IconToBottom, {}),
                value: MenuValues.insertBottom,
                context: function() {
                    instance.addRow(methods.getDefaultNewData(), item.row.key, true);
                }
            }, 
        ];
        return {
            xy: [
                e.x,
                e.y
            ],
            cb: confirm,
            menu: _to_consumable_array(cellOnlyMenu).concat(_to_consumable_array(insertMenus), [
                // 删除行
                {
                    label: /*#__PURE__*/ _jsxs("span", {
                        children: [
                            hasMultipleSelectedRow ? t("delete rows") : t("delete row"),
                            selectedRows.length > 1 ? /*#__PURE__*/ _jsxs("span", {
                                children: [
                                    " (",
                                    selectedRows.length,
                                    ")"
                                ]
                            }) : null
                        ]
                    }),
                    value: MenuValues.delete,
                    leading: /*#__PURE__*/ _jsx(IconDeleteOne, {
                        className: "color-error"
                    }),
                    className: "color-error",
                    context: function() {
                        return _async_to_generator(function() {
                            var conf, _tmp, _$e;
                            return _ts_generator(this, function(_state) {
                                switch(_state.label){
                                    case 0:
                                        _state.trys.push([
                                            0,
                                            2,
                                            3,
                                            4
                                        ]);
                                        _tmp = {};
                                        conf = (_tmp.ns = [
                                            COMMON_NS
                                        ], _tmp);
                                        methods.overlayStackChange(true);
                                        return [
                                            4,
                                            Dialog.quicker(t("confirm delete", conf), t("alert", conf), true)
                                        ];
                                    case 1:
                                        _state.sent();
                                        instance.removeRow(selectedRows.map(function(i) {
                                            return i.key;
                                        }));
                                        return [
                                            3,
                                            4
                                        ];
                                    case 2:
                                        _$e = _state.sent();
                                        return [
                                            3,
                                            4
                                        ];
                                    case 3:
                                        methods.overlayStackChange(false);
                                        return [
                                            7
                                        ];
                                    case 4:
                                        return [
                                            2
                                        ];
                                }
                            });
                        })();
                    }
                }, 
            ])
        };
    });
}
