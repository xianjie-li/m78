import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { COMMON_NS, TABLE_NS, Translation } from "../../i18n/index.js";
import { Bubble, BubbleType } from "../../bubble/index.js";
import { Button, ButtonColor } from "../../button/index.js";
import { Size } from "../../common/index.js";
import { IconSave } from "@m78/icons/icon-save.js";
import React, { useRef } from "react";
import { useFn, useSetState } from "@m78/hooks";
import { _injector } from "../table.js";
import { _useStateAct } from "../state.act.js";
import { TableMutationType } from "../../table-vanilla/plugins/mutation.js";
import { IconAddToPhotos } from "@m78/icons/icon-add-to-photos.js";
import { IconDeleteForever } from "@m78/icons/icon-delete-forever.js";
import { Trigger, TriggerType } from "../../trigger/index.js";
import { _useMethodsAct } from "../methods.act.js";
import { isEmpty } from "@m78/utils";
export function _AddBtn() {
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
                    /*#__PURE__*/ _jsx(IconAddToPhotos, {}),
                    t("add row btn")
                ]
            });
        }
    });
}
export function _SaveBtn() {
    var updateCount = function updateCount() {
        var data = instance.getData();
        setState({
            newCount: data.add.length,
            removeCount: data.remove.length,
            updateCount: data.change.length,
            sorted: data.sorted,
            configChanged: instance.getChangedConfigKeys().length > 0
        });
    };
    var stateDep = _injector.useDeps(_useStateAct);
    var props = _injector.useProps();
    var instance = stateDep.state.instance;
    var ref = _sliced_to_array(useSetState({
        newCount: 0,
        removeCount: 0,
        updateCount: 0,
        configChanged: false,
        sorted: false,
        changed: false
    }), 2), state = ref[0], setState = ref[1];
    instance.event.mutation.useEvent(function(e) {
        if (e.type === TableMutationType.config || e.type === TableMutationType.data) {
            setState({
                changed: instance.getTableChanged()
            });
        }
    });
    instance.event.interactiveChange.useEvent(function(cell, show, isSubmit) {
        if (isSubmit) {
            setState({
                changed: instance.getTableChanged()
            });
        }
    });
    var commonNSOpt = {
        ns: COMMON_NS
    };
    var submit = useFn(function() {
        if (!state.changed || !props.onSubmit) return;
        var d = {};
        var data = instance.getData();
        var changedKeys = instance.getChangedConfigKeys();
        if (data.update.length || data.sorted || data.remove.length) {
            d.data = data;
        }
        if (changedKeys.length) {
            d.config = instance.getPersistenceConfig();
            d.changedConfigKeys = changedKeys;
        }
        if (isEmpty(d)) return;
        props.onSubmit(d);
    });
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
                            children: state.newCount
                        }),
                        t("delete tip"),
                        ":",
                        " ",
                        /*#__PURE__*/ _jsx("span", {
                            className: "color-red bold mr-8",
                            children: state.removeCount
                        }),
                        t("update tip"),
                        ":",
                        " ",
                        /*#__PURE__*/ _jsx("span", {
                            className: "color-blue bold",
                            children: state.updateCount
                        }),
                        (state.configChanged || state.sorted) && /*#__PURE__*/ _jsxs("div", {
                            className: "mt-4",
                            children: [
                                state.configChanged && /*#__PURE__*/ _jsxs("span", {
                                    className: "mr-8",
                                    children: [
                                        t("conf tip"),
                                        ":",
                                        " ",
                                        /*#__PURE__*/ _jsx("span", {
                                            className: "color-blue bold",
                                            children: t("yes", commonNSOpt)
                                        })
                                    ]
                                }),
                                state.sorted && /*#__PURE__*/ _jsxs("span", {
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
                            ]
                        })
                    ]
                }),
                onChange: function(open) {
                    if (open) updateCount();
                },
                children: /*#__PURE__*/ _jsxs(Button, {
                    size: Size.small,
                    color: ButtonColor.primary,
                    disabled: !state.changed,
                    onClick: submit,
                    children: [
                        /*#__PURE__*/ _jsx(IconSave, {}),
                        t("save btn")
                    ]
                })
            });
        }
    });
}
export function _DeleteBtn() {
    var state = _injector.useDeps(_useStateAct).state;
    var instance = state.instance;
    var bubble1 = useRef(null);
    var bubble2 = useRef(null);
    // bubble触发器
    var trigger = useFn(function(e) {
        if (e.type === TriggerType.active) {
            bubble1.current.trigger(e);
        }
        if (e.type === TriggerType.click) {
            bubble2.current.trigger(e);
        }
    });
    var onDelete = useFn(function() {
        instance.removeRow(state.selectedRows.map(function(row) {
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
                        content: t("delete selected rows")
                    }),
                    /*#__PURE__*/ _jsx(Bubble, {
                        instanceRef: bubble2,
                        content: t("confirm delete"),
                        type: BubbleType.confirm,
                        onConfirm: onDelete
                    }),
                    /*#__PURE__*/ _jsx(Trigger, {
                        type: [
                            TriggerType.active,
                            TriggerType.click
                        ],
                        onTrigger: trigger,
                        children: /*#__PURE__*/ _jsx(Button, {
                            className: "color-second",
                            squareIcon: true,
                            disabled: state.selectedRows.length === 0,
                            children: /*#__PURE__*/ _jsx(IconDeleteForever, {})
                        })
                    })
                ]
            });
        }
    });
}
