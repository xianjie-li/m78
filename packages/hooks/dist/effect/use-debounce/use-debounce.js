import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { useEffect } from "react";
import { __GLOBAL__ } from "@m78/utils";
import { useFn, useSelf } from "../../index.js";
/**
 * 传入一个函数，经过防抖处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待防抖的函数
 * @param wait - 防抖延迟时间
 * @returns debounceFn - 经过防抖处理后的函数
 * @returns debounceFn.cancel() - 取消防抖调用
 */ export function useDebounce(fn) {
    var wait = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300;
    var self = useSelf({
        timer: undefined
    });
    var cancel = useFn(function() {
        if (self.timer) {
            __GLOBAL__.clearTimeout(self.timer);
        }
    });
    useEffect(function() {
        return cancel;
    });
    var memoFn = useFn(function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        cancel();
        self.timer = __GLOBAL__.setTimeout(function() {
            fn.apply(void 0, _to_consumable_array(args));
            __GLOBAL__.clearTimeout(self.timer);
        }, wait);
    });
    return Object.assign(memoFn, {
        cancel: cancel
    });
}
