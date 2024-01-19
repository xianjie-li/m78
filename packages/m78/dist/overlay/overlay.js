import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useRef } from "react";
import { useFn, useFormState, useIsUnmountState, useMeasure, useSelf, useSetState } from "@m78/hooks";
import { useSpring } from "react-spring";
import { _useMethods as useMethods } from "./use-methods.js";
import { _useLifeCycle as useLifeCycle } from "./use-life-cycle.js";
import { _useRender as useRender } from "./use-render.js";
import { _defaultProps, _onTrigger, overlayTransitionConfig, useEscapeCloseable, useOverlaysClickAway, useOverlaysMask } from "./common.js";
import { isFunction } from "@m78/utils";
import { useTrigger } from "../trigger/index.js";
/**
 * overlay抽象了所有弹层类组件(modal, drawer, popper等需要的基础能力), 使实现这些组件变得非常的简单
 * */ export function _Overlay(p) {
    var props = p;
    var _useFormState = _sliced_to_array(useFormState(props, false, {
        valueKey: "open",
        defaultValueKey: "defaultOpen"
    }), 2), open = _useFormState[0], setOpen = _useFormState[1];
    /** 容器节点ref */ var containerRef = useRef(null);
    /** 组件状态 */ var _useSetState = _sliced_to_array(useSetState({
        lastDirection: props.direction,
        scrollParents: []
    }), 2), state = _useSetState[0], setState = _useSetState[1];
    /** 实例对象 */ var self = useSelf({
        lastXY: props.xy,
        lastAlignment: props.alignment,
        lastTarget: props.target,
        lastPosition: [
            0,
            0
        ],
        activeContent: false,
        contentExist: false
    });
    /** 内容定位动画 */ var _useSpring = _sliced_to_array(useSpring(function() {
        return {
            to: {
                x: 0,
                y: 0,
                isHidden: true
            },
            config: overlayTransitionConfig
        };
    }), 2), sp = _useSpring[0], spApi = _useSpring[1];
    /** arrow定位动画 */ var _useSpring1 = _sliced_to_array(useSpring(function() {
        return {
            to: {
                offset: 30
            }
        };
    }), 2), arrowSp = _useSpring1[0], arrowSpApi = _useSpring1[1];
    /** 所有启用了mask的overlay */ var overlaysMask = useOverlaysMask({
        enable: open && props.mask
    });
    /** 所有启用了clickAwayClosable的overlay */ var overlaysClickAway = useOverlaysClickAway({
        enable: open && props.clickAwayQueue && props.clickAwayClosable
    }, props.clickAwayQueueNameSpace);
    /** 所有启用的escapeClosable */ var escapeCloseable = useEscapeCloseable({
        enable: open && props.escapeClosable
    });
    /** 给content render和children render的参数 */ var customRenderMeta = {
        props: props,
        open: open,
        setOpen: setOpen
    };
    var children = props.children;
    var element = isFunction(children) ? children(customRenderMeta) : children;
    /** 尺寸变更时修复位置 */ var _useMeasure = _sliced_to_array(useMeasure(containerRef, 200), 1), measure = _useMeasure[0];
    var ctx = {
        open: open && !props.disabled,
        setOpen: setOpen,
        state: state,
        setState: setState,
        self: self,
        props: props,
        containerRef: containerRef,
        sp: sp,
        spApi: spApi,
        arrowSp: arrowSp,
        arrowSpApi: arrowSpApi,
        overlaysClickAway: overlaysClickAway,
        overlaysMask: overlaysMask,
        escapeCloseable: escapeCloseable,
        measure: measure,
        isUnmount: useIsUnmountState(),
        customRenderMeta: customRenderMeta,
        trigger: null,
        triggerHandle: null,
        methods: null
    };
    /** 触发器回调 */ ctx.triggerHandle = useFn(function(e) {
        return _onTrigger(e, ctx);
    });
    /** 触发器 */ ctx.trigger = useTrigger({
        element: element,
        type: props.triggerType,
        onTrigger: ctx.triggerHandle,
        innerRef: props.triggerNodeRef
    });
    ctx.methods = useMethods(ctx);
    var lifeCycle = useLifeCycle(ctx);
    return useRender(ctx, lifeCycle);
}
_Overlay.displayName = "Overlay";
_Overlay.defaultProps = _defaultProps;
