import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { useEffect, useState } from "react";
import { useFn } from "../../index.js";
/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * - 卸载的准确时机hook内是不能感知的，因为可能中间会存在动画或其他延迟行为，所以需要用户在正确时机调用unmount()通知卸载
 * */ export function useMountState(toggle) {
    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref_mountOnEnter = _ref.mountOnEnter, mountOnEnter = _ref_mountOnEnter === void 0 ? true : _ref_mountOnEnter, _ref_unmountOnExit = _ref.unmountOnExit, unmountOnExit = _ref_unmountOnExit === void 0 ? false : _ref_unmountOnExit;
    var _useState = _sliced_to_array(useState(function() {
        // mountOnEnter为false时，强制渲染, 否则取init
        if (!mountOnEnter) return true;
        return toggle;
    }), 2), mount = _useState[0], setMount = _useState[1];
    // 自动同步true状态, false状态因为可能存在动画等, 由用户手动触发
    useEffect(function() {
        toggle && monkeySet(toggle);
    }, [
        toggle
    ]);
    var unmount = useFn(function() {
        return monkeySet(false);
    });
    function monkeySet(m) {
        // 需要挂载但未挂载时对其进行挂载
        if (m && !mount) {
            setMount(true);
            return;
        }
        // 需要离场卸载且收到卸载通知且当前已挂载
        if (unmountOnExit && !m && mount) {
            setMount(false);
        }
    }
    return [
        mount,
        unmount
    ];
}
