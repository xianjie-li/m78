import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import { __GLOBAL__ } from "./lang.js";
var storagePrefix = "UTIL_STORAGE_";
/** shortcut to the localStorage api, including automatic JSON.stringify and a spliced unique prefix */ export function setStorage(key, val) {
    localStorage.setItem("".concat(storagePrefix).concat(key).toUpperCase(), JSON.stringify(val));
}
/** shortcut of localStorage api, automatic JSON.parse, can only take the value set by setStorage */ export function getStorage(key) {
    var s = localStorage.getItem("".concat(storagePrefix).concat(key).toUpperCase());
    if (s === null) return null;
    try {
        return JSON.parse(s);
    } catch (e) {
        return null;
    }
}
var cachePlatform = null;
/** get os platform */ export function getPlatform() {
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
/** 检测是否是移动设备 */ export function isMobileDevice() {
    var platform = getPlatform();
    return platform.iphone || platform.ipad || platform.android;
}
/** 对requestAnimationFrame的简单兼容性包装, 并且返回清理函数而不是清理标记 */ export var raf = function(frameRequestCallback) {
    var _raf = __GLOBAL__.requestAnimationFrame || // @ts-ignore
    __GLOBAL__.webkitRequestAnimationFrame || // @ts-ignore
    __GLOBAL__.mozRequestAnimationFrame || // @ts-ignore
    __GLOBAL__.oRequestAnimationFrame || // @ts-ignore
    __GLOBAL__.msRequestAnimationFrame || setTimeout;
    var clearFn = __GLOBAL__.cancelAnimationFrame || __GLOBAL__.clearTimeout;
    var flag = _raf(frameRequestCallback);
    return function() {
        return clearFn(flag);
    };
};
