/**
 * 将一个错误优先且回调位于最后一个参数的node风格的callback函数转为Promise return函数
 * @param fn - 要包装的函数
 * @param {object} receiver - 要绑定作用域的对象
 * @return promise - 转换后的函数
 */ import { _ as _instanceof } from "@swc/helpers/_/_instanceof";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
export function promisify(fn, receiver) {
    return function() {
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        return new Promise(function(resolve, reject) {
            fn.apply(receiver, _to_consumable_array(args).concat([
                function(err, res) {
                    return err ? reject(err) : resolve(res);
                }
            ]));
        });
    };
}
/**
 * 返回一个延迟指定时间的Promise
 * @param ms - 延迟时间
 * @param payload - 将要resolve的任意值，如果是Error对象，则promise会抛出异常
 * @return - Promise
 * */ export function delay(ms, payload) {
    return new Promise(function(res, rej) {
        setTimeout(function() {
            return _instanceof(payload, Error) ? rej(payload) : res(payload);
        }, ms);
    });
}
/** 接收任意参数并返回, 用例是作为一个无效接收器或默认参数使用 */ export var dumpFn = function() {
    for(var _len = arguments.length, arg = new Array(_len), _key = 0; _key < _len; _key++){
        arg[_key] = arguments[_key];
    }
    return arg;
};
/** 延迟执行一个函数 */ export var defer = function(fn) {
    for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
        args[_key - 1] = arguments[_key];
    }
    return setTimeout.apply(void 0, [
        fn,
        1
    ].concat(_to_consumable_array(args)));
};
var defaultConfig = {
    rate: 0.2
};
/**
 * 执行一次handle，如果handle
 * @param handle - 处理函数，调用retry时会立即执行一次，如果handle执行返回了truthy值，则会在下一延迟执行点重新执行handle
 * @param delay - 进行重试间隔的毫秒，默认情况下，每次执行的间隔会通过边际递增算法增加, 可以通过config.fixed取消此行为
 * @param config - 配置
 * @param config.maxDelay - 重试延迟的最大延迟
 * @param config.rate - 0.2 | 递增比，此比例越大，则重试的频率越小
 * @param config.fixed - 不使用边际递增算法，固定重试时间
 * @param config.maxRetry - 最大重复次数
 * @return clear() - 用于停止重试并清理内部计时器
 * */ export function retry(handle, delay, config) {
    var _$_object_spread = _object_spread({}, defaultConfig, config), maxDelay = _$_object_spread.maxDelay, rate = _$_object_spread.rate, fixed = _$_object_spread.fixed, maxRetry = _$_object_spread.maxRetry;
    var t;
    var clear = function() {
        return t && clearTimeout(t);
    };
    var res = handle();
    if (!res) return clear;
    var d = delay;
    var count = 1;
    var trigger = function() {
        t = setTimeout(function() {
            if (handle()) {
                if (maxRetry && maxRetry === count) return;
                if (!fixed) {
                    var nextD = count * rate * delay + d;
                    d = maxDelay ? Math.min(nextD, maxDelay) : nextD;
                }
                count++;
                trigger();
            }
        }, d);
    };
    trigger();
    return clear;
} // TODO: 增加异步版本 asyncRetry
