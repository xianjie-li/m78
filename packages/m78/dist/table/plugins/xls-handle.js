import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
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
    _create_class(_XLSHandlePlugin, [
        {
            key: "toolbarTrailingCustomer",
            value: function toolbarTrailingCustomer(nodes) {
                var props = this.getProps();
                var _this_getDeps = this.getDeps(_useStateAct), conf = _this_getDeps.dataOperations;
                if (props.dataExport) {
                    nodes.push(/*#__PURE__*/ _jsx(ExportFileBtn, {}));
                }
                if (props.dataImport && conf.add) {
                    nodes.push(/*#__PURE__*/ _jsx(ImportFileBtn, {}));
                }
            }
        }
    ]);
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
