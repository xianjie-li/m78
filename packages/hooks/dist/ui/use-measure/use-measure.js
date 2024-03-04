import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState } from "react";
import { useMeasureNotify } from "./useMeasureNotify.js";
/**
 * 实时测量一个元素的尺寸
 * @param target - 目标节点
 * @param debounceDelay - 延迟设置的时间, 对于变更频繁的节点可以通过此项提升性能
 * @return
 *  - return[0] - 元素的尺寸, 位置等信息
 *  - return[1] - 用于直接绑定的ref
 * */ export function useMeasure(target, debounceDelay) {
    var _useState = _sliced_to_array(useState({
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
    }), 2), bounds = _useState[0], set = _useState[1];
    var ref = useMeasureNotify({
        target: target,
        debounceDelay: debounceDelay,
        onChange: function(bounds) {
            set(bounds);
        }
    });
    return [
        bounds,
        ref
    ];
}
