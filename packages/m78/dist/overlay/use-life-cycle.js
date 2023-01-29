import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { useClickAway, useDestroy, useLockBodyScroll, UseTriggerType, useUpdateEffect } from "@m78/hooks";
import { useEffect, useImperativeHandle, useMemo } from "react";
import { ensureArray, isDom } from "@m78/utils";
import { isBound } from "./common.js";
import { _useTypeProcess } from "./use-type-process.js";
export function _useLifeCycle(ctx, methods) {
    var props = ctx.props, setOpen = ctx.setOpen, open = ctx.open, self = ctx.self, trigger = ctx.trigger, containerRef = ctx.containerRef, overlaysClickAway = ctx.overlaysClickAway, state = ctx.state, measure = ctx.measure, isUnmount = ctx.isUnmount;
    // 对外暴露的实例
    var instance = useMemo(function() {
        return {
            updateXY: methods.updateXY,
            updateAlignment: methods.updateAlignment,
            updateTarget: methods.updateTarget,
            update: methods.update,
            trigger: methods.onTriggerMultiple
        };
    }, []);
    /** 暴露实例 */ useImperativeHandle(props.instanceRef, function() {
        return instance;
    });
    /** 对triggerType从其他类型变更为active的情况进行特殊处理 */ _useTypeProcess(ctx);
    /** 根据xy, alignment, target合成useEffect的更新deps, 减少不必要的更新 */ var updateTargetDeps = useMemo(function() {
        var deps = _to_consumable_array(props.xy || [
            0,
            0
        ]).concat(_to_consumable_array(props.alignment || [
            0,
            0
        ]));
        // 这里是关键, 防止bound被滥用(直接传入字面量) 导致频繁更新
        if (isBound(props.target)) {
            deps.push(props.target.top, props.target.left, props.target.width, props.target.height);
        } else {
            // 保持deps长度相同
            deps.push(0, 0, 0, 0);
        }
        deps.push(props.target);
        return deps;
    }, [
        props.xy,
        props.alignment,
        props.target,
        open
    ]);
    /** 滚动条处理 */ useLockBodyScroll(props.lockScroll && open);
    /** useClickAway的目标dom, 动态增减lastTarget(在多trigger时需要使用) */ var clickAwayTargets = useMemo(function() {
        var list = [
            containerRef,
            trigger.el
        ];
        if (isDom(self.lastTarget) && list.indexOf(self.lastTarget) === -1) {
            list.push(self.lastTarget);
        } else {
            list.push(null); // 需要保证deps长度一致
        }
        return list;
    }, [
        containerRef,
        trigger.el,
        self.lastTarget
    ]);
    /** 实现它处点击关闭 */ useClickAway({
        target: clickAwayTargets,
        onTrigger: function() {
            if (!open || !props.clickAwayClosable) return;
            if (props.clickAwayQueue && !overlaysClickAway.isLast) return;
            setTimeout(function() {
                !isUnmount() && setOpen(false);
            });
        }
    });
    /** children变更时, 更新 */ useUpdateEffect(methods.updateChildrenEl, [
        trigger.el
    ]);
    /** open变更 */ useEffect(function() {
        // 每次出现时将焦点移入组件
        if (props.autoFocus && open && containerRef.current) {
            // 非focus模式时为容器设置focus
            if (!ensureArray(props.triggerType).includes(UseTriggerType.focus)) {
                containerRef.current.focus();
            }
        }
        // 内容已挂载时调整位置
        if (self.contentExist) methods.update(true);
        clearTimeout(self.shouldCloseTimer);
    }, [
        open
    ]);
    /** 内容尺寸变更时重新定位 */ useUpdateEffect(function() {
        if (!measure.width || !measure.height) return;
        methods.update(true);
    }, [
        measure.width,
        measure.height,
        measure.top,
        measure.left
    ]);
    /** 根据props的位置配置同步 */ useUpdateEffect(function() {
        self.lastXY = props.xy;
        self.lastAlignment = props.alignment;
        self.lastTarget = props.target;
        // 使用默认顺序更新
        methods.update();
    }, updateTargetDeps);
    /** 滚动/窗口大小改变时更新位置 */ useEffect(function() {
        var els = _to_consumable_array(state.scrollParents).concat([
            window
        ]);
        window.addEventListener("resize", methods.debounceUpdate);
        els.forEach(function(el) {
            el.addEventListener("scroll", methods.throttleUpdate);
        });
        return function() {
            window.removeEventListener("resize", methods.debounceUpdate);
            els.forEach(function(el) {
                el.removeEventListener("scroll", methods.throttleUpdate);
            });
        };
    }, [
        state.scrollParents
    ]);
    /** content对应的dom挂载, 如果启用了unmountOnExit, 此hook会在每次content挂载后执行 */ var onContentMount = function() {
        self.contentExist = true;
        methods.update(true);
    };
    /** content对应的dom卸载, 如果启用了unmountOnExit, 此hook会在每次content卸载后执行 */ var onContentUnmount = function() {
        var ref;
        (ref = props.onDispose) === null || ref === void 0 ? void 0 : ref.call(props);
        self.contentExist = false;
    };
    /** 清理 */ useDestroy(function() {
        clearTimeout(self.triggerMultipleTimer);
        clearTimeout(self.shouldCloseTimer);
    });
    return {
        onContentMount: onContentMount,
        onContentUnmount: onContentUnmount
    };
}
