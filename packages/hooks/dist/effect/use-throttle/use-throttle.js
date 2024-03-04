import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { useEffect } from "react";
import { __GLOBAL__ } from "@m78/utils";
import { useFn, useSelf } from "../../index.js";
var defaultOption = {
    leading: true,
    trailing: true
};
/**
 * 传入一个函数，经过节流处理后返回, 返回函数的内存地址会一直保持不变
 * @param fn - 待节流的函数
 * @param wait - 节流延迟时间
 * @param options
 * @param options.leading - true | 在节流开始前调用
 * @param options.trailing - true | 在节流结束后调用
 * @returns throttleFn - 经过节流处理后的函数
 * @returns throttleFn.cancel() - 取消节流调用
 */ export function useThrottle(fn) {
    var wait = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 300, options = arguments.length > 2 ? arguments[2] : void 0;
    var self = useSelf({
        last: 0,
        timer: undefined
    });
    var opt = _object_spread({}, defaultOption, options);
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
        var now = Date.now();
        var diff = now - self.last;
        cancel();
        if (diff > wait) {
            // last = 0 时视为初次调用
            if (opt.leading || self.last !== 0) {
                fn.apply(void 0, _to_consumable_array(args));
            }
            self.last = now;
        } else if (opt.trailing) {
            self.timer = __GLOBAL__.setTimeout(function() {
                fn.apply(void 0, _to_consumable_array(args));
                self.last = 0; // 标记下次调用为leading调用
                __GLOBAL__.clearTimeout(self.timer);
            }, wait);
        }
    });
    var bundle = Object.assign(memoFn, {
        cancel: cancel
    });
    return bundle;
}
