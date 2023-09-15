import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Button } from "../../button/index.js";
import { Bubble } from "../../bubble/index.js";
import { Divider, Row } from "../../layout/index.js";
import { _getHistoryButtons } from "./get-history-buttons.js";
import { TABLE_NS, Trans, Translation } from "../../i18n/index.js";
import { _renderToolBarQueryBtn, _ToolBarFilterBtn, _ToolbarCommonFilter } from "../filter/filter-btn.js";
import { _injector } from "../table.js";
import { _useStateAct } from "../state.act.js";
import { _AddBtn, _DeleteBtn, _SaveBtn } from "./data-actions.js";
import { IconModeEdit } from "@m78/icons/icon-mode-edit.js";
import { _ExportFileBtn, _ImportFileBtn } from "./xls.js";
export function _Toolbar() {
    var renderLeading = function renderLeading() {
        if (!state.instance) return null;
        var searchBtn = _renderToolBarQueryBtn(stateDep);
        var resetFilterBtn = /*#__PURE__*/ _jsx(_ToolBarFilterBtn, {});
        var filterBtn = /*#__PURE__*/ _jsx(_ToolbarCommonFilter, {});
        var ref = _getHistoryButtons(state.instance.history), redoBtn = ref.redoBtn, undoBtn = ref.undoBtn;
        var countText = /*#__PURE__*/ _jsx("div", {
            className: "color-second fs-12",
            children: /*#__PURE__*/ _jsx(Translation, {
                ns: TABLE_NS,
                children: function(t) {
                    return /*#__PURE__*/ _jsxs(Trans, {
                        i18nKey: "count",
                        t: t,
                        count: count,
                        selectedCount: selectedCount,
                        children: [
                            {
                                count: count
                            },
                            " rows / ",
                            {
                                selectedCount: selectedCount
                            },
                            " selected"
                        ]
                    });
                }
            })
        });
        var nodes = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                searchBtn,
                /*#__PURE__*/ _jsx(Divider, {
                    vertical: true
                }),
                resetFilterBtn,
                filterBtn,
                /*#__PURE__*/ _jsx(Divider, {
                    vertical: true
                }),
                redoBtn,
                undoBtn,
                /*#__PURE__*/ _jsx(Divider, {
                    vertical: true
                }),
                countText
            ]
        });
        var nodesData = {
            nodes: nodes,
            searchBtn: searchBtn,
            resetFilterBtn: resetFilterBtn,
            filterBtn: filterBtn,
            redoBtn: redoBtn,
            undoBtn: undoBtn,
            countText: countText
        };
        if (props.toolBarLeadingCustomer) {
            return props.toolBarLeadingCustomer(nodesData, state.instance);
        }
        return nodes;
    };
    var renderTrailing = function renderTrailing() {
        if (!state.instance) return null;
        var exportBtn = props.dataExport && /*#__PURE__*/ _jsx(_ExportFileBtn, {});
        var importBtn = props.dataImport && /*#__PURE__*/ _jsx(_ImportFileBtn, {});
        var editByDialogBtn = /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsx(Bubble, {
                    content: t("edit by dialog"),
                    children: /*#__PURE__*/ _jsx(Button, {
                        className: "color-second",
                        squareIcon: true,
                        disabled: state.selectedRows.length !== 1,
                        children: /*#__PURE__*/ _jsx(IconModeEdit, {})
                    })
                });
            }
        });
        var deleteBtn = /*#__PURE__*/ _jsx(_DeleteBtn, {});
        var addBtn = /*#__PURE__*/ _jsx(_AddBtn, {});
        var saveBtn = /*#__PURE__*/ _jsx(_SaveBtn, {});
        var nodes = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                exportBtn,
                importBtn,
                editByDialogBtn,
                deleteBtn,
                /*#__PURE__*/ _jsx(Divider, {
                    vertical: true
                }),
                addBtn,
                saveBtn
            ]
        });
        var nodesData = {
            nodes: nodes,
            exportBtn: exportBtn,
            importBtn: importBtn,
            deleteBtn: deleteBtn,
            addBtn: addBtn,
            saveBtn: saveBtn,
            editByDialogBtn: editByDialogBtn
        };
        if (props.toolBarTrailingCustomer) {
            return props.toolBarTrailingCustomer(nodesData, state.instance);
        }
        return nodes;
    };
    var props = _injector.useProps();
    var stateDep = _injector.useDeps(_useStateAct);
    var state = stateDep.state;
    var selectedCount = state.selectedRows.length;
    var count = state.rowCount;
    return /*#__PURE__*/ _jsxs(Row, {
        className: "m78-table_toolbar",
        mainAlign: "between",
        children: [
            /*#__PURE__*/ _jsx(Row, {
                crossAlign: "center",
                children: renderLeading()
            }),
            /*#__PURE__*/ _jsx(Row, {
                crossAlign: "center",
                children: renderTrailing()
            })
        ]
    });
}
