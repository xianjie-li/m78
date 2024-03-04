import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useState } from "react";
import { simplyEqual as isEqual } from "@m78/utils";
import { useUpdateEffect } from "../../index.js";
/**
 *  实现类似getDerivedStateFromProps的效果，接收prop并将其同步为内部状态，
 *  当prop改变, 对prop和内部state执行深对比,对比结果为false时，会更新内部值 (基础类型使用 === 进行对比，性能更高，当必须使用引用类型时，尽量保持结构简单，减少对比次数)
 *  @param prop - 需要派生为state的prop
 * */ export function useDerivedStateFromProps(prop) {
    var _useState = _sliced_to_array(useState(prop), 2), state = _useState[0], setState = _useState[1];
    useUpdateEffect(function() {
        var equal = isEqual(prop, state);
        if (!equal) {
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
