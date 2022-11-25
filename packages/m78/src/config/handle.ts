import { M78SeedState } from "./types";
import { i18n } from "../i18n";

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
  if (i18nConf) {
    if (i18nConf.appendResource) {
      // 每次只能添加一个命名空间, 这里需要循环处理一下
      Object.entries(i18nConf.appendResource).forEach(([lng, resource]) => {
        Object.entries(resource).forEach(([ns, conf]) => {
          i18n.addResourceBundle(lng, ns, conf, true, true);
        });
      });
    }

    if (i18nConf.lng) {
      i18n.changeLanguage(i18nConf.lng, (err) => {
        if (err) console.warn(err);
      });
    }
  }
}
