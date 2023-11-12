import _class_call_check from "@swc/helpers/src/_class_call_check.mjs";
import _inherits from "@swc/helpers/src/_inherits.mjs";
import _create_super from "@swc/helpers/src/_create_super.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { IconDownloadTwo } from "@m78/icons/download-two.js";
import React from "react";
import { IconUploadTwo } from "@m78/icons/upload-two.js";
import { RCTablePlugin } from "../plugin.js";
import { _useStateAct } from "../injector/state.act.js";
export var _XLSHandlePlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_XLSHandlePlugin, RCTablePlugin);
    var _super = _create_super(_XLSHandlePlugin);
    function _XLSHandlePlugin() {
        _class_call_check(this, _XLSHandlePlugin);
        return _super.apply(this, arguments);
    }
    var _proto = _XLSHandlePlugin.prototype;
    _proto.toolbarTrailingCustomer = function toolbarTrailingCustomer(nodes) {
        var props = this.getProps();
        var ref = this.getDeps(_useStateAct), conf = ref.dataOperations;
        if (props.dataExport) {
            nodes.push(/*#__PURE__*/ _jsx(ExportFileBtn, {}));
        }
        if (props.dataImport && conf.add) {
            nodes.push(/*#__PURE__*/ _jsx(ImportFileBtn, {}));
        }
    };
    return _XLSHandlePlugin;
}(RCTablePlugin);
function ExportFileBtn() {
    return /*#__PURE__*/ _jsx(Translation, {
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
                    squareIcon: true,
                    children: /*#__PURE__*/ _jsx(IconUploadTwo, {})
                })
            });
        }
    });
}
function ImportFileBtn() {
    return /*#__PURE__*/ _jsx(Translation, {
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
                    squareIcon: true,
                    children: /*#__PURE__*/ _jsx(IconDownloadTwo, {})
                })
            });
        }
    });
}
