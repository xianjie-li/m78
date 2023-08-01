import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconManageSearch } from "@m78/icons/icon-manage-search.js";
import { Bubble } from "../../bubble/index.js";
import { IconSync } from "@m78/icons/icon-sync.js";
import { IconFilterAlt } from "@m78/icons/icon-filter-alt.js";
import { Divider, Row } from "../../layout/index.js";
import { IconFileDownload } from "@m78/icons/icon-file-download.js";
import { IconFileUpload } from "@m78/icons/icon-file-upload.js";
import { IconDeleteForever } from "@m78/icons/icon-delete-forever.js";
import { IconAddToPhotos } from "@m78/icons/icon-add-to-photos.js";
import { IconSave } from "@m78/icons/icon-save.js";
import { IconModeEdit } from "@m78/icons/icon-mode-edit.js";
import { _getTableCtx } from "../common.js";
import { _getHistoryButtons } from "./get-history-buttons.js";
export function _Toolbar(param) {
    var ctx = param.ctx;
    var renderLeading = function renderLeading() {
        if (!state.instance) return null;
        var searchBtn = /*#__PURE__*/ _jsxs(Button, {
            text: true,
            children: [
                /*#__PURE__*/ _jsx(IconManageSearch, {
                    className: "color-second fs-16"
                }),
                "查询"
            ]
        });
        var resetFilterBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: "重置筛选条件",
            children: /*#__PURE__*/ _jsx(Button, {
                squareIcon: true,
                children: /*#__PURE__*/ _jsx(IconSync, {
                    className: "color-second"
                })
            })
        });
        var filterBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: "通用筛选条件",
            children: /*#__PURE__*/ _jsx(Button, {
                squareIcon: true,
                children: /*#__PURE__*/ _jsx(IconFilterAlt, {
                    className: "color-second"
                })
            })
        });
        var ref = _getHistoryButtons(state.instance.history), redoBtn = ref.redoBtn, undoBtn = ref.undoBtn;
        var countText = /*#__PURE__*/ _jsxs("div", {
            className: "color-second fs-12",
            children: [
                "共",
                rowCount,
                "行",
                rowCount ? " / 选中".concat(selectedCount, "行") : ""
            ]
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
        var exportBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: /*#__PURE__*/ _jsxs("div", {
                children: [
                    /*#__PURE__*/ _jsx("div", {
                        children: "导出为xlsx文件"
                    }),
                    /*#__PURE__*/ _jsxs("div", {
                        className: "fs-12 color-second",
                        children: [
                            "你也可以 ",
                            /*#__PURE__*/ _jsx("a", {
                                children: "导出指定列"
                            })
                        ]
                    })
                ]
            }),
            children: /*#__PURE__*/ _jsx(Button, {
                className: "color-second",
                squareIcon: true,
                children: /*#__PURE__*/ _jsx(IconFileDownload, {})
            })
        });
        var importBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: /*#__PURE__*/ _jsxs("div", {
                children: [
                    "从xlsx文件导入数据",
                    /*#__PURE__*/ _jsx("div", {
                        className: "fs-12 color-second",
                        children: /*#__PURE__*/ _jsx("a", {
                            children: "下载导入模板"
                        })
                    })
                ]
            }),
            children: /*#__PURE__*/ _jsx(Button, {
                className: "color-second",
                squareIcon: true,
                children: /*#__PURE__*/ _jsx(IconFileUpload, {})
            })
        });
        var deleteBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: "删除选中项",
            children: /*#__PURE__*/ _jsx(Button, {
                className: "color-second",
                squareIcon: true,
                disabled: selectedCount === 0,
                children: /*#__PURE__*/ _jsx(IconDeleteForever, {})
            })
        });
        var editBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: /*#__PURE__*/ _jsx("div", {
                children: "在独立窗口中编辑选中行"
            }),
            children: /*#__PURE__*/ _jsx(Button, {
                className: "color-second",
                squareIcon: true,
                disabled: selectedCount === 0,
                children: /*#__PURE__*/ _jsx(IconModeEdit, {})
            })
        });
        var addBtn = /*#__PURE__*/ _jsx(Bubble, {
            content: /*#__PURE__*/ _jsxs("div", {
                children: [
                    "新增一条记录",
                    /*#__PURE__*/ _jsx("div", {
                        className: "fs-12 color-second",
                        children: "选中行时, 在选中行上方插入"
                    })
                ]
            }),
            children: /*#__PURE__*/ _jsxs(Button, {
                size: Size.small,
                disabled: true,
                children: [
                    /*#__PURE__*/ _jsx(IconAddToPhotos, {}),
                    "新建"
                ]
            })
        });
        var saveBtn = /*#__PURE__*/ _jsxs(Button, {
            size: Size.small,
            color: ButtonColor.primary,
            disabled: true,
            children: [
                /*#__PURE__*/ _jsx(IconSave, {}),
                "保存"
            ]
        });
        var nodes = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                exportBtn,
                importBtn,
                deleteBtn,
                editBtn,
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
            editBtn: editBtn,
            addBtn: addBtn,
            saveBtn: saveBtn
        };
        if (props.toolBarTrailingCustomer) {
            return props.toolBarTrailingCustomer(nodesData, state.instance);
        }
        return nodes;
    };
    var ref;
    var props = ctx.props, state = ctx.state;
    var selectedCount = state.selectedRows.length;
    var rowCount = ((ref = _getTableCtx(state.instance)) === null || ref === void 0 ? void 0 : ref.allRowKeys.length) || 0;
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
