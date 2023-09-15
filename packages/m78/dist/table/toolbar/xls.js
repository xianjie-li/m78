import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button } from "../../button/index.js";
import { IconFileDownload } from "@m78/icons/icon-file-download.js";
import React from "react";
import { IconFileUpload } from "@m78/icons/icon-file-upload.js";
export function _ExportFileBtn() {
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
                    className: "color-second",
                    squareIcon: true,
                    children: /*#__PURE__*/ _jsx(IconFileDownload, {})
                })
            });
        }
    });
}
export function _ImportFileBtn() {
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
                    className: "color-second",
                    squareIcon: true,
                    children: /*#__PURE__*/ _jsx(IconFileUpload, {})
                })
            });
        }
    });
}
