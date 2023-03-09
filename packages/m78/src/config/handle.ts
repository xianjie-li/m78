import { M78SeedState } from "./types.js";
import { i18n } from "../i18n/index.js";
import { Resource } from "i18next";
import { isArray, isString } from "@m78/utils";

/** 黑暗模式处理 */
export function _darkModeHandle(darkMode?: boolean) {
  if (
    darkMode !== undefined &&
    typeof window !== "undefined" &&
    window.document
  ) {
    document.documentElement.setAttribute(
      "data-mode",
      darkMode ? "dark" : "light"
    );
  }
}

/** 国际化处理 */
export function _i18nHandle(i18nConf: M78SeedState["i18n"]) {
  if (!i18nConf) return;

  let lng: string | undefined;
  let resource: Resource | undefined;

  if (isString(i18nConf)) {
    lng = i18nConf;
  } else if (isArray(i18nConf) && i18nConf.length === 2) {
    [lng, resource] = i18nConf;
  }

  const hasLng = isString(lng);

  if (hasLng && resource) {
    // 每次只能添加一个命名空间, 这里需要循环处理一下
    Object.entries(resource).forEach(([ns, conf]) => {
      i18n.addResourceBundle(lng!, ns, conf, false, true);
    });
  }

  if (hasLng) {
    i18n.changeLanguage(lng, (err) => {
      if (err) console.warn(err);
    });
  }
}
