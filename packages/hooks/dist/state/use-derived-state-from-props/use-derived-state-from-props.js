import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useState } from "react";
import { useUpdateEffect } from "../../index.js";
import _isEqualWith from "lodash/isEqualWith.js";
/**
 *  实现类似getDerivedStateFromProps的效果，接收prop并将其同步为内部状态，
 *  当prop改变, 对prop和内部state执行_.isEqual,对比结果为false时，会更新内部值 (基础类型使用 === 进行对比，性能更高，当必须使用引用类型时，尽量保持结构简单，减少对比次数)
 *  @param prop - 需要派生为state的prop
 *  @param customizer - 可以通过此函数自定义对比方式, 如果相等返回 true，否则返回 false, 返回undefined时使用默认对比方式
 * */ export function useDerivedStateFromProps(prop, customizer) {
    var ref = _sliced_to_array(useState(prop), 2), state = ref[0], setState = ref[1];
    useUpdateEffect(function() {
        var isEqual = _isEqualWith(prop, state, customizer);
        if (!isEqual) {
            setState(prop);
        }
    }, [
        prop
    ]);
    return [
        state,
        setState
    ];
}
