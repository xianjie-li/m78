import { __GLOBAL__ } from "./lang.js";
import { EmptyFunction } from "./types.js";

const storagePrefix = "UTIL_STORAGE_";

/** shortcut to the localStorage api, including automatic JSON.stringify and a spliced unique prefix */
export function setStorage(key: string, val: any) {
  localStorage.setItem(
    `${storagePrefix}${key}`.toUpperCase(),
    JSON.stringify(val)
  );
}

/** shortcut of localStorage api, automatic JSON.parse, can only take the value set by setStorage */
export function getStorage(key: string) {
  const s = localStorage.getItem(`${storagePrefix}${key}`.toUpperCase());

  if (s === null) return null;

  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

let cachePlatform: {
  mac: boolean;
  iphone: boolean;
  ipad: boolean;
  windows: boolean;
  android: boolean;
  linux: boolean;
} | null = null;

/** get os platform */
export function getPlatform() {
  if (cachePlatform) return { ...cachePlatform };

  const getPlatform = () => {
    // 2022 way of detecting. Note : this userAgentData feature is available only in secure contexts (HTTPS)
    if (
      // @ts-ignore
      typeof navigator.userAgentData !== "undefined" &&
      // @ts-ignore
      navigator.userAgentData != null
    ) {
      // @ts-ignore
      return navigator.userAgentData.platform;
    }
    // Deprecated but still works for most of the browser
    if (typeof navigator.platform !== "undefined") {
      if (
        typeof navigator.userAgent !== "undefined" &&
        /android/.test(navigator.userAgent.toLowerCase())
      ) {
        // android device’s navigator.platform is often set as 'linux', so let’s use userAgent for them
        return "android";
      }
      return navigator.platform;
    }
    return "unknown";
  };

  const platform = getPlatform();

  const hasTouch = "ontouchstart" in document;

  // mac和ipad都返回MacIntel, 需要额外检测触屏

  cachePlatform = {
    mac: /mac/i.test(platform) && !hasTouch,
    ipad: /(ipad|mac)/i.test(platform) && hasTouch,
    iphone: /(iphone|ipod)/i.test(platform),
    windows: /win/i.test(platform),
    android: /android/i.test(platform),
    linux: /linux/i.test(platform),
  };

  return cachePlatform;
}

/** 检测是否是移动设备 */
export function isMobileDevice() {
  const platform = getPlatform();
  return platform.iphone || platform.ipad || platform.android;
}

/** 对requestAnimationFrame的简单兼容性包装, 并且返回清理函数而不是清理标记 */
export const raf = (
  frameRequestCallback: FrameRequestCallback
): EmptyFunction => {
  const _raf =
    __GLOBAL__.requestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.webkitRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.mozRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.oRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.msRequestAnimationFrame ||
    setTimeout;

  const clearFn = __GLOBAL__.cancelAnimationFrame || __GLOBAL__.clearTimeout;

  const flag = _raf(frameRequestCallback);

  return () => clearFn(flag);
};
