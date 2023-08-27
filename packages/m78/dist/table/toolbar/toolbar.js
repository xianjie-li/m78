import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { Bubble } from "../../bubble/index.js";
import { Divider, Row } from "../../layout/index.js";
import { IconFileDownload } from "@m78/icons/icon-file-download.js";
import { IconFileUpload } from "@m78/icons/icon-file-upload.js";
import { IconDeleteForever } from "@m78/icons/icon-delete-forever.js";
import { IconAddToPhotos } from "@m78/icons/icon-add-to-photos.js";
import { IconSave } from "@m78/icons/icon-save.js";
import { _getTableCtx } from "../common.js";
import { _getHistoryButtons } from "./get-history-buttons.js";
import { TABLE_NS, Trans, Translation } from "../../i18n/index.js";
import { _renderToolBarQueryBtn, _ToolBarFilterBtn, _ToolbarCommonFilter } from "../filter/filter-btn.js";
export function _Toolbar(param) {
    var ctx = param.ctx;
    var renderLeading = function renderLeading() {
        if (!state.instance) return null;
        var searchBtn = _renderToolBarQueryBtn(ctx);
        var resetFilterBtn = /*#__PURE__*/ _jsx(_ToolBarFilterBtn, {
            ctx: ctx
        });
        var filterBtn = /*#__PURE__*/ _jsx(_ToolbarCommonFilter, {
            ctx: ctx
        });
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
        var exportBtn = /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsx(Bubble, {
                    content: /*#__PURE__*/ _jsxs("div", {
                        children: [
                            /*#__PURE__*/ _jsx("div", {
                                children: t("export xlsx")
                            }),
                            /*#__PURE__*/ _jsxs("div", {
                                className: "fs-12 color-second",
                                children: [
                                    t("u can also"),
                                    " ",
                                    /*#__PURE__*/ _jsx("a", {
                                        children: t("export specific")
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
            }
        });
        var importBtn = /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsx(Bubble, {
                    content: /*#__PURE__*/ _jsxs("div", {
                        children: [
                            t("import"),
                            /*#__PURE__*/ _jsx("div", {
                                className: "fs-12 color-second",
                                children: /*#__PURE__*/ _jsx("a", {
                                    children: t("download import tpl")
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
            }
        });
        var deleteBtn = /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsx(Bubble, {
                    content: t("delete selected rows"),
                    children: /*#__PURE__*/ _jsx(Button, {
                        className: "color-second",
                        squareIcon: true,
                        disabled: selectedCount === 0,
                        children: /*#__PURE__*/ _jsx(IconDeleteForever, {})
                    })
                });
            }
        });
        var addBtn = /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsx(Bubble, {
                    content: /*#__PURE__*/ _jsxs("div", {
                        children: [
                            t("add row tip1"),
                            /*#__PURE__*/ _jsx("div", {
                                className: "fs-12 color-second",
                                children: t("add row tip2")
                            })
                        ]
                    }),
                    children: /*#__PURE__*/ _jsxs(Button, {
                        size: Size.small,
                        children: [
                            /*#__PURE__*/ _jsx(IconAddToPhotos, {}),
                            t("add row btn")
                        ]
                    })
                });
            }
        });
        var saveBtn = /*#__PURE__*/ _jsx(Translation, {
            ns: TABLE_NS,
            children: function(t) {
                return /*#__PURE__*/ _jsx(Bubble, {
                    content: /*#__PURE__*/ _jsxs("div", {
                        children: [
                            t("new tip"),
                            ": ",
                            /*#__PURE__*/ _jsx("span", {
                                className: "color-green bold mr-8",
                                children: "3"
                            }),
                            t("delete tip"),
                            ":",
                            " ",
                            /*#__PURE__*/ _jsx("span", {
                                className: "color-red bold mr-8",
                                children: "2"
                            }),
                            t("update tip"),
                            ": ",
                            /*#__PURE__*/ _jsx("span", {
                                className: "color-blue bold",
                                children: "7"
                            })
                        ]
                    }),
                    children: /*#__PURE__*/ _jsxs(Button, {
                        size: Size.small,
                        color: ButtonColor.primary,
                        children: [
                            /*#__PURE__*/ _jsx(IconSave, {}),
                            t("save btn")
                        ]
                    })
                });
            }
        });
        var nodes = /*#__PURE__*/ _jsxs(_Fragment, {
            children: [
                exportBtn,
                importBtn,
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
    var count = ((ref = _getTableCtx(state.instance)) === null || ref === void 0 ? void 0 : ref.allRowKeys.length) || 0;
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
