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

/** Detect if is mobile device */
export function isMobileDevice() {
  const platform = getPlatform();
  return platform.iphone || platform.ipad || platform.android;
}

/** Get command key by system, apple series: metaKey,  other: ctrlKey */
export function getCmdKey() {
  const platform = getPlatform();

  return platform.mac || platform.ipad || platform.iphone
    ? "metaKey"
    : "ctrlKey";
}

/** Get command key status by system, apple series: metaKey,  other: ctrlKey */
export function getCmdKeyStatus(e: Event) {
  return !!e[getCmdKey()];
}

/** A simple compatibility wrapper for requestAnimationFrame and returns a cleanup function instead of a cleanup tag */
export function raf(frameRequestCallback: FrameRequestCallback): EmptyFunction {
  const _raf =
    __GLOBAL__.requestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.webkitRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.mozRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.oRequestAnimationFrame ||
    // @ts-ignore
    __GLOBAL__.msRequestAnimationFrame;

  const clearFn = _raf
    ? __GLOBAL__.cancelAnimationFrame
    : __GLOBAL__.clearTimeout;

  const flag = _raf
    ? _raf(frameRequestCallback)
    : setTimeout(() => frameRequestCallback(Date.now()), 60); // 约等于s/60fps

  return () => clearFn(flag);
}

export type RafFunction = typeof raf;

/** 用于将requestAnimationFrame使用在指令式用法中, 比如拖拽移动dom的场景, rafCaller能确保每帧只会对最新一次回调进行调用, 其他回调会被直接忽略 */
export function rafCaller() {
  let last: FrameRequestCallback | undefined;

  return function rafCall(frameRequestCallback: FrameRequestCallback) {
    last = frameRequestCallback;

    return raf((arg) => {
      if (last) {
        last(arg);
        last = undefined;
      }
    });
  };
}
