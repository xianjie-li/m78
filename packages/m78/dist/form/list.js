import _define_property from "@swc/helpers/src/_define_property.mjs";
import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { isValidElement } from "react";
import { ensureArray, isFunction, isTruthyOrZero } from "@m78/utils";
import { throwError } from "../common/index.js";
import { DND } from "../dnd/index.js";
import { Row } from "../layout/index.js";
import clsx from "clsx";
import { Button } from "../button/index.js";
import { IconDeleteSweep } from "@m78/icons/icon-delete-sweep.js";
import { IconDragIndicator } from "@m78/icons/icon-drag-indicator.js";
import { IconAddCircleOutline } from "@m78/icons/icon-add-circle-outline.js";
import { FORM_NS, Translation } from "../i18n/index.js";
export function _listImpl(ctx) {
    var form = ctx.form;
    form.List = function(props) {
        return /*#__PURE__*/ _jsx(form.Field, _object_spread_props(_object_spread({}, props), {
            // @ts-ignore
            __isList: true
        }));
    };
    form.List.displayName = "FieldList";
}
/** FormListCustomRenderArgs.render核心逻辑实现 */ export function _listRenderImpl(ctx, props) {
    var form = ctx.form;
    var name = props.name;
    return function(renderCB) {
        if (!isFunction(renderCB)) {
            throwError("Form: List args.render must passed a function as argument.");
        }
        var list = form.getList(name) || [];
        var listNode = list.map(function(i, index) {
            var element = renderCB({
                item: i.item,
                index: index,
                length: list.length,
                getName: function(childName) {
                    return _to_consumable_array(ensureArray(name)).concat([
                        index, 
                    ], _to_consumable_array(ensureArray(childName)));
                }
            });
            if (!/*#__PURE__*/ isValidElement(element)) {
                throwError("Form: List args.render must return a valid react element.");
            }
            return /*#__PURE__*/ React.cloneElement(element, _object_spread_props(_object_spread({}, element.props), {
                key: i.key
            }));
        });
        return /*#__PURE__*/ _jsx(_Fragment, {
            children: listNode
        });
    };
}
/** 实现内置list布局 */ export function _listLayoutRenderImpl(ctx, filedCtx, methods, schema) {
    var group = "".concat(filedCtx.id, "-").concat(filedCtx.strName);
    return function(args, render) {
        return /*#__PURE__*/ _jsxs("div", {
            className: "m78-form_list-wrap",
            children: [
                args.render(function(meta) {
                    var node = render(meta);
                    return /*#__PURE__*/ _jsx(DND, {
                        group: group,
                        data: meta.index,
                        enableDrag: true,
                        enableDrop: {
                            top: true,
                            bottom: true
                        },
                        onSourceAccept: function(param) {
                            var source = param.source, target = param.target, status = param.status;
                            var sIndex = source.data;
                            var tIndex = target.data;
                            var isDropTop = status.top;
                            var isDropBottom = status.bottom;
                            var isIncrement = tIndex > sIndex;
                            var topIndex = Math.max(0, isIncrement ? tIndex - 1 : tIndex);
                            var bottomIndex = Math.min(meta.length - 1, isIncrement ? tIndex : tIndex + 1);
                            isDropTop && args.move(sIndex, topIndex);
                            isDropBottom && args.move(sIndex, bottomIndex);
                        },
                        children: function(param) {
                            var status = param.status, ref = param.ref, handleRef = param.handleRef;
                            var _obj;
                            return /*#__PURE__*/ _jsxs(Row, {
                                innerRef: ref,
                                className: clsx("m78-form_list-item", (_obj = {}, _define_property(_obj, "__d-top", status.top), _define_property(_obj, "__d-bottom", status.bottom), _define_property(_obj, "__dragging", status.dragging), _obj)),
                                children: [
                                    node,
                                    /*#__PURE__*/ _jsxs("div", {
                                        className: "m78-form_multi-column_suffix",
                                        children: [
                                            /*#__PURE__*/ _jsx(Translation, {
                                                ns: [
                                                    FORM_NS
                                                ],
                                                children: function(t) {
                                                    return /*#__PURE__*/ _jsx(Button, {
                                                        icon: true,
                                                        size: "small",
                                                        squareIcon: true,
                                                        title: t("delete current item"),
                                                        onClick: function() {
                                                            args.remove(meta.index);
                                                        },
                                                        children: /*#__PURE__*/ _jsx(IconDeleteSweep, {})
                                                    });
                                                }
                                            }),
                                            /*#__PURE__*/ _jsx(Translation, {
                                                ns: [
                                                    FORM_NS
                                                ],
                                                children: function(t) {
                                                    return /*#__PURE__*/ _jsx(Button, {
                                                        icon: true,
                                                        size: "small",
                                                        squareIcon: true,
                                                        title: t("drag sort"),
                                                        innerRef: handleRef,
                                                        children: /*#__PURE__*/ _jsx(IconDragIndicator, {})
                                                    });
                                                }
                                            })
                                        ]
                                    })
                                ]
                            });
                        }
                    });
                }),
                /*#__PURE__*/ _jsx("div", {
                    children: /*#__PURE__*/ _jsxs(Button, {
                        disabled: args.getProps("disabled"),
                        onClick: function() {
                            return args.add(isTruthyOrZero(schema === null || schema === void 0 ? void 0 : schema.listDefaultValue) ? schema.listDefaultValue : {});
                        },
                        size: methods.getProps("size"),
                        children: [
                            /*#__PURE__*/ _jsx(Translation, {
                                ns: [
                                    FORM_NS
                                ],
                                children: function(t) {
                                    return t("add item");
                                }
                            }),
                            /*#__PURE__*/ _jsx(IconAddCircleOutline, {})
                        ]
                    })
                })
            ]
        });
    };
}
