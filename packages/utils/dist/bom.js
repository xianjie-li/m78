import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { __GLOBAL__ } from "./lang.js";
var currentStorage;
/** Simple wrap of storage.setItem api */ export function setStorage(key, val) {
    var storage = currentStorage || localStorage;
    storage.setItem(key, JSON.stringify(val));
}
/** Simple wrap of storage.getItem api */ export function getStorage(key) {
    var storage = currentStorage || localStorage;
    var s = storage.getItem(key);
    if (s === null) return null;
    try {
        return JSON.parse(s);
    } catch (e) {
        return null;
    }
}
/** Simple wrap of storage.removeItem api */ export function removeStorage(key) {
    var storage = currentStorage || localStorage;
    storage.removeItem(key);
}
/** Run setStorage / getStorage / removeStorage with specified storage object */ export function withStorage(storage, cb) {
    currentStorage = storage;
    cb();
    currentStorage = localStorage;
}
var cachePlatform = null;
/** Get os platform */ export function getPlatform() {
    if (cachePlatform) return _object_spread({}, cachePlatform);
    var getPlatform = function() {
        // 2022 way of detecting. Note : this userAgentData feature is available only in secure contexts (HTTPS)
        if (// @ts-ignore
        typeof navigator.userAgentData !== "undefined" && // @ts-ignore
        navigator.userAgentData != null) {
            // @ts-ignore
            return navigator.userAgentData.platform;
        }
        // Deprecated but still works for most of the browser
        if (typeof navigator.platform !== "undefined") {
            if (typeof navigator.userAgent !== "undefined" && /android/.test(navigator.userAgent.toLowerCase())) {
                // android device’s navigator.platform is often set as 'linux', so let’s use userAgent for them
                return "android";
            }
            return navigator.platform;
        }
        return "unknown";
    };
    var platform = getPlatform();
    var hasTouch = "ontouchstart" in document;
    // mac和ipad都返回MacIntel, 需要额外检测触屏
    cachePlatform = {
        mac: /mac/i.test(platform) && !hasTouch,
        ipad: /(ipad|mac)/i.test(platform) && hasTouch,
        iphone: /(iphone|ipod)/i.test(platform),
        windows: /win/i.test(platform),
        android: /android/i.test(platform),
        linux: /linux/i.test(platform)
    };
    return cachePlatform;
}
/** Detect if is mobile device */ export function isMobileDevice() {
    var platform = getPlatform();
    return platform.iphone || platform.ipad || platform.android;
}
/** Get command key by system, apple series: metaKey,  other: ctrlKey */ export function getCmdKey() {
    var platform = getPlatform();
    return platform.mac || platform.ipad || platform.iphone ? "metaKey" : "ctrlKey";
}
/** Get command key status by system, apple series: metaKey,  other: ctrlKey */ export function getCmdKeyStatus(e) {
    return !!e[getCmdKey()];
}
/** A simple compatibility wrapper for requestAnimationFrame and returns a cleanup function instead of a cleanup tag */ export function raf(frameRequestCallback) {
    var _raf = __GLOBAL__.requestAnimationFrame || // @ts-ignore
    __GLOBAL__.webkitRequestAnimationFrame || // @ts-ignore
    __GLOBAL__.mozRequestAnimationFrame || // @ts-ignore
    __GLOBAL__.oRequestAnimationFrame || // @ts-ignore
    __GLOBAL__.msRequestAnimationFrame;
    var clearFn = _raf ? __GLOBAL__.cancelAnimationFrame : __GLOBAL__.clearTimeout;
    var flag = _raf ? _raf(frameRequestCallback) : setTimeout(function() {
        return frameRequestCallback(Date.now());
    }, 60); // 约等于s/60fps
    return function() {
        return clearFn(flag);
    };
}
/** 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略 */ export function rafCaller() {
    var last;
    return function rafCall(frameRequestCallback) {
        last = frameRequestCallback;
        return raf(function(arg) {
            if (last) {
                last(arg);
                last = undefined;
            }
        });
    };
}
