import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useEffect, useRef, useState } from "react";
import { useFn } from "../../effect/use-fn/use-fn.js";
import debounce from "lodash/debounce.js";
import { useIsUnmountState } from "../../state/use-Is-unmount-state/use-Is-unmount-state.js";
import ResizeObserver from "resize-observer-polyfill";
import { getRefDomOrDom } from "../../utils/utils.js";
/**
 * 原始尺寸/位置 变更时进行通知
 * */ export function useMeasureNotify(props) {
    var getEl = function getEl() {
        var el = getRefDomOrDom(target);
        if (el) return el;
        return ref.current;
    };
    var ref = useRef(null);
    var debounceDelay = props.debounceDelay, target = props.target;
    var isUnmount = useIsUnmountState();
    var cb = useFn(function(param) {
        var _param = _sliced_to_array(param, 1), entry = _param[0];
        var rect = entry.contentRect;
        if (!isUnmount()) {
            props.onChange({
                // rect属性不可遍历, 所以这里用蠢一点的办法逐个复制
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
                x: rect.x,
                y: rect.y,
                right: rect.right,
                bottom: rect.bottom,
                offsetHeight: entry.target.offsetHeight,
                offsetWidth: entry.target.offsetWidth
            });
        }
    }, function(fn) {
        if (debounceDelay) {
            return debounce(fn, debounceDelay);
        }
        return fn;
    }, [
        debounceDelay
    ]);
    var ref1 = _sliced_to_array(useState(function() {
        return new ResizeObserver(cb);
    }), 1), ro = ref1[0];
    useEffect(function() {
        var el = getEl();
        if (el) ro.observe(el);
        return function() {
            return ro.disconnect();
        };
    }, [
        target,
        ref.current
    ]);
    return ref;
}
