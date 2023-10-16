import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { FormLayoutType } from "./types.js";
import { ensureArray } from "@m78/utils";
import { Button, ButtonColor } from "../button/index.js";
import { Cell, Cells, Row } from "../layout/index.js";
import { _useUpdatePropsChange } from "./use-update-props-change.js";
import { useUpdate } from "@m78/hooks";
import { COMMON_NS, FORM_NS, Translation } from "../i18n/index.js";
import { EMPTY_NAME } from "./common.js";
import { Bubble, BubbleType } from "../bubble/index.js";
import { Status } from "../common/index.js";
export function _schemaRenderImpl(ctx) {
    var form = ctx.form;
    form.SchemaRender = function(props) {
        var renderCellCond = // 根据条件渲染Cell或直接渲染原节点
        function renderCellCond(isSchemaRoot, node) {
            if (isSchemaRoot) {
                return /*#__PURE__*/ _jsx(Cell, _object_spread_props(_object_spread({
                    col: 12
                }, props.cellProps), {
                    children: node
                }));
            }
            return node;
        };
        var _showActionButtons = props.showActionButtons, showActionButtons = _showActionButtons === void 0 ? true : _showActionButtons;
        var config = ctx.config;
        var schemas = config.schemas;
        // 监听updateProps更新组件
        _useUpdatePropsChange(ctx, useUpdate());
        form.events.submit.useEvent(function() {
            if (props.onSubmit) {
                props.onSubmit(form.getValues());
            }
        });
        // 渲染一项schema
        function renderSchemaItem(schema, parentNames) {
            var isRoot = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, isSchemaRoot = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
            if (!schema) return null;
            // 需要添加到所有field的props
            var commonFiledProps = {};
            // 没有name且非root schema视为无效schema
            if (!("name" in schema) && !isRoot) return null;
            var name = _to_consumable_array(parentNames);
            if ("name" in schema) name.push(schema.name);
            if (!schema.list) {
                var ref;
                // 包含schema配置
                if ((ref = schema.schema) === null || ref === void 0 ? void 0 : ref.length) {
                    var /*#__PURE__*/ _React;
                    var node = schema.schema.map(function(sch) {
                        if (isRoot) return renderSchemaItem(sch, name, false, isRoot);
                        // 嵌套菜单渲染为多列
                        return(// 使用createElement展开, 所以不需要key
                        // eslint-disable-next-line react/jsx-key
                        /*#__PURE__*/ _jsx("div", {
                            className: "m78-form_multi-column",
                            children: renderSchemaItem(sch, name)
                        }));
                    });
                    var nodeWrap = (_React = React).createElement.apply(_React, [
                        React.Fragment,
                        {}
                    ].concat(_to_consumable_array(node)));
                    // 根节点不需要容器
                    if (isRoot) return nodeWrap;
                    return renderCellCond(isSchemaRoot, /*#__PURE__*/ _jsx(form.Field, _object_spread_props(_object_spread({}, commonFiledProps), {
                        name: name,
                        element: function() {
                            return /*#__PURE__*/ _jsx(Row, {
                                children: nodeWrap
                            });
                        }
                    })));
                }
                // eachSchema只对list有效
                if (schema.eachSchema) return null;
                // console.log(name);
                return renderCellCond(isSchemaRoot, /*#__PURE__*/ _jsx(form.Field, _object_spread_props(_object_spread({}, commonFiledProps), {
                    name: name
                })));
            }
            // list模式只有配置了eachSchema才有效
            if (!schema.eachSchema) return null;
            var eachSchema = schema.eachSchema;
            return renderCellCond(isSchemaRoot, /*#__PURE__*/ _jsx(form.List, _object_spread_props(_object_spread({}, commonFiledProps), {
                name: name,
                layoutRender: function(meta) {
                    var /*#__PURE__*/ _React;
                    var node;
                    if (eachSchema.schema) {
                        node = eachSchema.schema.map(function(sch) {
                            return(// eslint-disable-next-line react/jsx-key
                            /*#__PURE__*/ _jsx("div", {
                                className: "m78-form_multi-column",
                                children: renderSchemaItem(sch, ensureArray(meta.getName()))
                            }));
                        });
                    } else {
                        // eslint-disable-next-line react/jsx-key
                        node = [
                            /*#__PURE__*/ _jsx(form.Field, {
                                name: meta.getName()
                            })
                        ];
                    }
                    return (_React = React).createElement.apply(_React, [
                        React.Fragment,
                        {}
                    ].concat(_to_consumable_array(node)));
                }
            })));
        }
        var formNode = renderSchemaItem(schemas, [], true);
        if (!formNode) return null;
        var hasCellGutter = !!props.cellProps && config.layoutType === FormLayoutType.vertical;
        return /*#__PURE__*/ _jsxs(Cells, _object_spread_props(_object_spread({
            gutter: hasCellGutter ? 12 : 0
        }, props.cellsProps), {
            children: [
                formNode,
                showActionButtons && renderCellCond(true, /*#__PURE__*/ _jsx(form.Field, {
                    name: EMPTY_NAME,
                    label: " ",
                    element: function() {
                        return /*#__PURE__*/ _jsxs("div", {
                            children: [
                                /*#__PURE__*/ _jsx(Translation, {
                                    ns: [
                                        FORM_NS,
                                        COMMON_NS
                                    ],
                                    children: function(t) {
                                        return /*#__PURE__*/ _jsx(Bubble, {
                                            type: BubbleType.confirm,
                                            content: t("confirm operation"),
                                            status: Status.warning,
                                            onConfirm: form.reset,
                                            children: /*#__PURE__*/ _jsx(Button, {
                                                size: config.size,
                                                children: t("reset")
                                            })
                                        });
                                    }
                                }),
                                /*#__PURE__*/ _jsx(Button, {
                                    style: {
                                        minWidth: 80
                                    },
                                    color: ButtonColor.primary,
                                    onClick: function() {
                                        form.submit().catch(function() {});
                                    },
                                    size: config.size,
                                    children: /*#__PURE__*/ _jsx(Translation, {
                                        ns: FORM_NS,
                                        children: function(t) {
                                            return t("submit");
                                        }
                                    })
                                })
                            ]
                        });
                    }
                }))
            ]
        }));
    };
    form.SchemaRender.displayName = "SchemaRender";
}
