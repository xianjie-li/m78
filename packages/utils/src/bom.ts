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

  if (!s) return null;

  return JSON.parse(s);
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

  cachePlatform = {
    mac: /mac/.test(platform),
    iphone: /(iphone|ipod)/.test(platform),
    ipad: /ipad/.test(platform),
    windows: /win/.test(platform),
    android: /android/.test(platform),
    linux: /linux/.test(platform),
  };

  return cachePlatform;
}
