import { useEffect } from "react";
/**
 * 一个功能组件, 随content一同挂载并回调mount和unmount事件
 * */ export function _MountTrigger(param) {
    var onMount = param.onMount, onUnmount = param.onUnmount;
    useEffect(function() {
        onMount();
        return onUnmount;
    }, []);
    return null;
}
