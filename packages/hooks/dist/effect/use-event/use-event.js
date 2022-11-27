import { useFn } from "../../index.js";
import { useEffect } from "react";
import { createEvent as create } from "@m78/utils";
/** 增强一个现有事件对象 */ export function enhance(event) {
    var useEvent = function(listener) {
        var memoHandle = useFn(listener);
        useEffect(function() {
            event.on(memoHandle);
            return function() {
                return event.off(memoHandle);
            };
        }, []);
    };
    return Object.assign(event, {
        useEvent: useEvent
    });
}
/**
 * 自定义事件，用于多个组件间或组件外进行通讯
 * */ function createEvent() {
    return enhance(create());
}
createEvent.enhance = enhance;
export { createEvent };
