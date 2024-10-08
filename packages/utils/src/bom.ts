import { EmptyFunction } from "./types.js";

let currentStorage: Storage | null;

/** Simple wrap of storage.setItem api */
export function setStorage(key: string, val: any) {
  const storage = currentStorage || localStorage;

  storage.setItem(key, JSON.stringify(val));
}

/** Simple wrap of storage.getItem api */
export function getStorage(key: string) {
  const storage = currentStorage || localStorage;

  const s = storage.getItem(key);

  if (s === null) return null;

  try {
    return JSON.parse(s);
  } catch (e) {
    return null;
  }
}

/** Simple wrap of storage.removeItem api */
export function removeStorage(key: string) {
  const storage = currentStorage || localStorage;

  storage.removeItem(key);
}

/** Run setStorage / getStorage / removeStorage with specified storage object */
export function withStorage(storage: Storage, cb: EmptyFunction) {
  currentStorage = storage;
  cb();
  currentStorage = localStorage;
}

let cachePlatform: {
  mac: boolean;
  iphone: boolean;
  ipad: boolean;
  windows: boolean;
  android: boolean;
  linux: boolean;
} | null = null;

/** Get os platform */
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
