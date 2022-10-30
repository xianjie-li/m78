import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import debounce from "lodash/debounce";
import { getRefDomOrDom, useFn, useIsUnmountState } from "../../";
/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */ export function useMeasure(target, debounceDelay) {
    var getEl = function getEl() {
        var el = getRefDomOrDom(target);
        if (el) return el;
        return ref.current;
    };
    var ref = useRef(null);
    var isUnmount = useIsUnmountState();
    var ref1 = _sliced_to_array(useState({
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        x: 0,
        y: 0,
        right: 0,
        bottom: 0,
        offsetHeight: 0,
        offsetWidth: 0
    }), 2), bounds = ref1[0], set = ref1[1];
    var cb = useFn(function(param) {
        var _param = _sliced_to_array(param, 1), entry = _param[0];
        var rect = entry.contentRect;
        !isUnmount() && set({
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
    }, function(fn) {
        if (debounceDelay) {
            return debounce(fn, debounceDelay);
        }
        return fn;
    }, [
        debounceDelay
    ]);
    var ref2 = _sliced_to_array(useState(function() {
        return new ResizeObserver(cb);
    }), 1), ro = ref2[0];
    useEffect(function() {
        var el = getEl();
        if (el) ro.observe(el);
        return function() {
            return ro.disconnect();
        };
    }, []);
    return [
        bounds,
        ref
    ];
}
