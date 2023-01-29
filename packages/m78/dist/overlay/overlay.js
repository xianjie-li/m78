import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useRef } from "react";
import { useFn, useFormState, useIsUnmountState, useMeasure, useSelf, useSetState, useTrigger } from "@m78/hooks";
import { useSpring } from "react-spring";
import { _useMethods as useMethods } from "./use-methods.js";
import { _useLifeCycle as useLifeCycle } from "./use-life-cycle.js";
import { _useRender as useRender } from "./use-render.js";
import { _defaultProps, _onTrigger, transitionConfig, useOverlaysClickAway, useOverlaysMask } from "./common.js";
import { isFunction } from "@m78/utils";
/**
 * overlay抽象了所有弹层类组件(modal, drawer, popper等需要的基础能力), 使实现这些组件变得非常的简单
 * */ export function _Overlay(p) {
    var props = p;
    var ref = _sliced_to_array(useFormState(props, false, {
        valueKey: "open",
        defaultValueKey: "defaultOpen"
    }), 2), open = ref[0], setOpen = ref[1];
    /** 容器节点ref */ var containerRef = useRef(null);
    /** 组件状态 */ var ref1 = _sliced_to_array(useSetState({
        lastDirection: props.direction,
        scrollParents: []
    }), 2), state = ref1[0], setState = ref1[1];
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
    /** 内容定位动画 */ var ref2 = _sliced_to_array(useSpring(function() {
        return {
            to: {
                x: 0,
                y: 0,
                isHidden: true
            },
            config: transitionConfig
        };
    }), 2), sp = ref2[0], spApi = ref2[1];
    /** arrow定位动画 */ var ref3 = _sliced_to_array(useSpring(function() {
        return {
            to: {
                offset: 30
            }
        };
    }), 2), arrowSp = ref3[0], arrowSpApi = ref3[1];
    /** 所有启用了mask的overlay */ var overlaysMask = useOverlaysMask({
        enable: open && props.mask
    });
    /** 所有启用了clickAwayClosable的overlay */ var overlaysClickAway = useOverlaysClickAway({
        enable: open && props.clickAwayQueue && props.clickAwayClosable
    }, props.clickAwayQueueNameSpace);
    /** 给content render和children render的参数 */ var customRenderMeta = {
        props: props,
        open: open,
        setOpen: setOpen
    };
    var children = props.children;
    var element = isFunction(children) ? children(customRenderMeta) : children;
    /** 触发器回调 */ var triggerHandle = useFn(function(e) {
        return _onTrigger(e, setOpen, self, props);
    });
    /** 触发器 */ var trigger = useTrigger({
        element: element,
        type: props.triggerType,
        onTrigger: triggerHandle,
        innerRef: props.triggerNodeRef
    });
    /** 尺寸变更时修复位置 */ var ref4 = _sliced_to_array(useMeasure(containerRef, 200), 1), measure = ref4[0];
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
        trigger: trigger,
        overlaysClickAway: overlaysClickAway,
        overlaysMask: overlaysMask,
        measure: measure,
        triggerHandle: triggerHandle,
        isUnmount: useIsUnmountState(),
        customRenderMeta: customRenderMeta
    };
    var methods = useMethods(ctx);
    var lifeCycle = useLifeCycle(ctx, methods);
    return useRender(ctx, methods, lifeCycle);
}
_Overlay.displayName = "Overlay";
_Overlay.defaultProps = _defaultProps;
