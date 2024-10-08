import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _inherits } from "@swc/helpers/_/_inherits";
import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _create_super } from "@swc/helpers/_/_create_super";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { COMMON_NS, TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble } from "../../bubble/index.js";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconSaveOne } from "@m78/icons/save-one.js";
import React, { useRef, useState } from "react";
import { useFn, useSetState } from "@m78/hooks";
import { _injector } from "../table.js";
import { _useStateAct } from "../injector/state.act.js";
import { IconAdd } from "@m78/icons/add.js";
import { IconDeleteOne } from "@m78/icons/delete-one.js";
import { TriggerType } from "@m78/trigger";
import { _useMethodsAct } from "../injector/methods.act.js";
import { RCTablePlugin } from "../plugin.js";
import { Divider } from "../../layout/index.js";
import { Trigger } from "@m78/trigger/react/trigger.js";
export var _DataActionPlugin = /*#__PURE__*/ function(RCTablePlugin) {
    "use strict";
    _inherits(_DataActionPlugin, RCTablePlugin);
    var _super = _create_super(_DataActionPlugin);
    function _DataActionPlugin() {
        _class_call_check(this, _DataActionPlugin);
        return _super.apply(this, arguments);
    }
    _create_class(_DataActionPlugin, [
        {
            key: "toolbarTrailingCustomer",
            value: function toolbarTrailingCustomer(nodes) {
                var _nodes;
                var _this_getDeps = this.getDeps(_useStateAct), conf = _this_getDeps.dataOperations;
                var newNodes = [];
                if (conf.delete) newNodes.push(/*#__PURE__*/ _jsx(DeleteBtn, {}));
                if (conf.add) newNodes.push(/*#__PURE__*/ _jsx(AddBtn, {}));
                if (conf.delete || conf.add) newNodes.push(/*#__PURE__*/ _jsx(SaveBtn, {}));
                if (newNodes.length) (_nodes = nodes).push.apply(_nodes, [
                    /*#__PURE__*/ _jsx(Divider, {
                        vertical: true
                    })
                ].concat(_to_consumable_array(newNodes)));
            }
        }
    ]);
    return _DataActionPlugin;
}(RCTablePlugin);
function AddBtn() {
    var state = _injector.useDeps(_useStateAct).state;
    var methods = _injector.useDeps(_useMethodsAct);
    var instance = state.instance;
    var add = useFn(function() {
        instance.addRow(methods.getDefaultNewData());
    });
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsxs(Button, {
                size: Size.small,
                onClick: add,
                children: [
                    /*#__PURE__*/ _jsx(IconAdd, {}),
                    t("add row btn")
                ]
            });
        }
    });
}
function SaveBtn() {
    var stateDep = _injector.useDeps(_useStateAct);
    var props = _injector.useProps();
    var instance = stateDep.state.instance;
    var _useSetState = _sliced_to_array(useSetState({
        length: 0,
        add: 0,
        change: 0,
        update: 0,
        remove: 0,
        sorted: false
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    var _useState = _sliced_to_array(useState(false), 2), changed = _useState[0], setChanged = _useState[1];
    instance.event.mutation.useEvent(function(e) {
        setChanged(instance.getTableChanged());
    });
    function updateCount() {
        setState(instance.getChangeStatus());
    }
    var commonNSOpt = {
        ns: COMMON_NS
    };
    var submit = useFn(/*#__PURE__*/ _async_to_generator(function() {
        var data;
        return _ts_generator(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!changed || !props.onSubmit) return [
                        2
                    ];
                    return [
                        4,
                        instance.getData()
                    ];
                case 1:
                    data = _state.sent();
                    if (data.update.length || data.sorted || data.remove.length) {
                        props.onSubmit(data);
                    }
                    return [
                        2
                    ];
            }
        });
    }));
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsx(Bubble, {
                style: {
                    maxWidth: 500
                },
                content: /*#__PURE__*/ _jsxs("div", {
                    children: [
                        t("new tip"),
                        ":",
                        " ",
                        /*#__PURE__*/ _jsx("span", {
                            className: "color-green bold mr-8",
                            children: state.add
                        }),
                        t("remove tip"),
                        ":",
                        " ",
                        /*#__PURE__*/ _jsx("span", {
                            className: "color-red bold mr-8",
                            children: state.remove
                        }),
                        t("change tip"),
                        ":",
                        " ",
                        /*#__PURE__*/ _jsx("span", {
                            className: "color-blue bold",
                            children: state.change
                        }),
                        state.sorted && /*#__PURE__*/ _jsx("div", {
                            className: "mt-4",
                            children: state.sorted && /*#__PURE__*/ _jsxs("span", {
                                children: [
                                    t("sorted tip"),
                                    ":",
                                    " ",
                                    /*#__PURE__*/ _jsx("span", {
                                        className: "color-blue bold",
                                        children: t("yes", commonNSOpt)
                                    })
                                ]
                            })
                        })
                    ]
                }),
                onChange: function(open) {
                    if (open) updateCount();
                },
                children: /*#__PURE__*/ _jsxs(Button, {
                    size: Size.small,
                    color: ButtonColor.primary,
                    disabled: !changed,
                    onClick: submit,
                    children: [
                        /*#__PURE__*/ _jsx(IconSaveOne, {}),
                        t("save btn")
                    ]
                })
            });
        }
    });
}
function DeleteBtn() {
    var state = _injector.useDeps(_useStateAct).state;
    var instance = state.instance;
    var bubble1 = useRef(null);
    // bubble触发器
    var trigger = useFn(function(e) {
        if (e.type === TriggerType.active) {
            bubble1.current.trigger(e);
        }
    });
    var onDelete = useFn(function() {
        instance.softRemove(state.selectedRows.map(function(row) {
            return row.key;
        }));
    });
    return /*#__PURE__*/ _jsx(Translation, {
        ns: TABLE_NS,
        children: function(t) {
            return /*#__PURE__*/ _jsxs(_Fragment, {
                children: [
                    /*#__PURE__*/ _jsx(Bubble, {
                        instanceRef: bubble1,
                        content: t("remove rows")
                    }),
                    /*#__PURE__*/ _jsx(Trigger, {
                        type: [
                            TriggerType.active
                        ],
                        onTrigger: trigger,
                        children: /*#__PURE__*/ _jsx(Button, {
                            squareIcon: true,
                            disabled: state.selectedRows.length === 0,
                            onClick: onDelete,
                            children: /*#__PURE__*/ _jsx(IconDeleteOne, {})
                        })
                    })
                ]
            });
        }
    });
}
