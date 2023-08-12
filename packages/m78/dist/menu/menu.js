import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useImperativeHandle, useRef } from "react";
import { DEFAULT_CHILDREN_KEY, DEFAULT_LABEL_KEY, DEFAULT_VALUE_KEY, getChildrenByDataSource, getLabelByDataSource, getValueByDataSource, Size, Z_INDEX_MESSAGE } from "../common/index.js";
import { Overlay, OverlayDirection } from "../overlay/index.js";
import { useClickAway, useFn, useSelect, useSelf, useSetState } from "@m78/hooks";
import { Lay } from "../lay/index.js";
import { isArray, isFunction, isMobileDevice, isTruthyOrZero, omit } from "@m78/utils";
import { _getOptionAllValues } from "./common.js";
import { useKeyboardHandle } from "./use-keyboard-handle.js";
import clsx from "clsx";
import { Trigger, TriggerType } from "../trigger/index.js";
import { TransitionType } from "../transition/index.js";
var defaultProps = {
    direction: OverlayDirection.bottomStart
};
/** 共有props */ var commonProps = {
    autoFocus: false,
    lockScroll: false,
    zIndex: Z_INDEX_MESSAGE,
    namespace: "MENU",
    childrenAsTarget: true,
    clickAwayClosable: false
};
var MAIN_MENU = "__MAIN_MENU__";
var MAIN_TRIGGER = "__MAIN_TRIGGER__";
export var _Menu = function(props) {
    var self = useSelf({
        menuTargets: {},
        targets: [],
        lastActive: null,
        flatMap: {}
    });
    // 使用useSetState确保能实时获取到最新的type
    var ref = _sliced_to_array(useSetState({
        xy: undefined,
        current: null,
        subMenuTriggerType: TriggerType.active
    }), 2), state = ref[0], setState = ref[1];
    var overlayRef = useRef(null);
    useImperativeHandle(props.instanceRef, function() {
        return overlayRef.current;
    }, [
        overlayRef.current
    ]);
    /** 管理所有展开的项, 值为项的value */ var openSelect = useSelect();
    var hasSelected = openSelect.state.selected.length > 0;
    /** 关闭所有 */ var close = useFn(function() {
        if (openSelect.state.selected.length === 0) return;
        self.lastActive = null;
        setState({
            current: null
        });
        openSelect.unSelectAll();
    });
    /** 点击区域外关闭 */ useClickAway({
        target: self.targets,
        onTrigger: close
    });
    /** 处理overlay open, sibling用于处理所有兄弟节点的关闭 */ var openChangeHandle = useFn(function(open, val, sibling) {
        var skipSetActive = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
        var ref;
        (ref = props.onChange) === null || ref === void 0 ? void 0 : ref.call(props, open);
        if (open) {
            if (isArray(sibling)) {
                var values = _getOptionAllValues(sibling, props);
                openSelect.unSelectList(values);
            }
            if (val !== MAIN_MENU && !skipSetActive) {
                self.lastActive = val;
            }
            openSelect.select(val);
        } else if (val === MAIN_MENU) {
            // 主窗口关闭时关闭全部
            close();
        }
    });
    /** 选中 */ var onConfirm = useFn(function(val, option) {
        var ref;
        (ref = props.onConfirm) === null || ref === void 0 ? void 0 : ref.call(props, val, option);
        close();
    });
    /** 触发menuTargets变更, 并同步到targets */ var targetsChange = useFn(function(key, target) {
        var _targets;
        self.menuTargets[key] = target;
        var next = Object.entries(self.menuTargets).map(function(param) {
            var _param = _sliced_to_array(param, 2), _ = _param[0], _$target = _param[1];
            return _$target;
        }).filter(function(i) {
            return !!i;
        });
        (_targets = self.targets).splice.apply(_targets, [
            0,
            self.targets.length
        ].concat(_to_consumable_array(next)));
    });
    var onContextTrigger = useFn(function(e) {
        var ref;
        (ref = props.onTrigger) === null || ref === void 0 ? void 0 : ref.call(props, e);
        if (e.type === TriggerType.contextMenu) {
            var ref1;
            (ref1 = overlayRef.current) === null || ref1 === void 0 ? void 0 : ref1.updateXY([
                e.x,
                e.y
            ], true);
        }
    });
    var ctx = {
        openChangeHandle: openChangeHandle,
        props: props,
        hasSelected: hasSelected,
        openSelect: openSelect,
        self: self,
        state: state,
        setState: setState,
        close: close
    };
    useKeyboardHandle(ctx);
    /** 如果是移动设备(不精确检测), 子菜单触发方式改为click */ useEffect(function() {
        if (isMobileDevice()) {
            setState({
                subMenuTriggerType: TriggerType.click
            });
        }
    }, []);
    /** 递归渲染选项列表 */ function renderMenuList(list) {
        return list.map(function(item) {
            if (isTruthyOrZero(item.customer)) {
                if (isFunction(item.customer)) {
                    return item.customer(close);
                }
                return item.customer;
            }
            var other = omit(item, [
                props.labelKey || DEFAULT_LABEL_KEY,
                props.valueKey || DEFAULT_VALUE_KEY,
                props.childrenKey || DEFAULT_CHILDREN_KEY, 
            ]);
            var value = getValueByDataSource(item, props);
            var label = getLabelByDataSource(item, props);
            var children = getChildrenByDataSource(item, props);
            if (!value) return null;
            var open = openSelect.isSelected(value);
            var currentValue = state.current ? getValueByDataSource(state.current, props) : null;
            var isCurrent = currentValue === value;
            if (children.length) {
                return /*#__PURE__*/ _jsx(Overlay, _object_spread_props(_object_spread({}, commonProps), {
                    className: "m78-menu_wrap",
                    open: open,
                    content: /*#__PURE__*/ _jsx("div", {
                        className: "m78-menu",
                        role: "menu",
                        ref: function(dom) {
                            return targetsChange(String(value), dom);
                        },
                        children: renderMenuList(children)
                    }),
                    direction: OverlayDirection.rightStart,
                    triggerType: state.subMenuTriggerType,
                    transitionType: TransitionType.none,
                    offset: 8,
                    onChange: function(open) {
                        return openChangeHandle(open, value, list);
                    },
                    children: /*#__PURE__*/ _jsx(Lay, _object_spread_props(_object_spread({}, other), {
                        role: "menuitem",
                        title: label,
                        arrow: true,
                        highlight: open || other.highlight,
                        active: isCurrent,
                        size: Size.small
                    }))
                }), value);
            }
            return /*#__PURE__*/ _jsx(Trigger, {
                type: TriggerType.active,
                onTrigger: function(e) {
                    return openChangeHandle(e.active, value, list);
                },
                children: /*#__PURE__*/ _jsx(Lay, _object_spread_props(_object_spread({}, other), {
                    role: "menuitem",
                    title: label,
                    size: Size.small,
                    active: isCurrent,
                    onClick: function() {
                        return onConfirm(value, item);
                    }
                }))
            }, value);
        });
    }
    return /*#__PURE__*/ _jsx(Overlay, _object_spread_props(_object_spread({}, props, commonProps), {
        className: clsx("m78-menu_wrap", props.className),
        autoFocus: true,
        instanceRef: overlayRef,
        open: openSelect.isSelected(MAIN_MENU),
        content: /*#__PURE__*/ _jsx("div", {
            role: "menu",
            className: "m78-menu",
            ref: function(dom) {
                return targetsChange(MAIN_MENU, dom);
            },
            children: renderMenuList(props.options)
        }),
        onChange: function(open) {
            return openChangeHandle(open, MAIN_MENU);
        },
        onTrigger: onContextTrigger,
        triggerNodeRef: function(dom) {
            return targetsChange(MAIN_TRIGGER, dom);
        },
        children: props.children
    }));
};
_Menu.displayName = "Menu";
_Menu.defaultProps = defaultProps;
