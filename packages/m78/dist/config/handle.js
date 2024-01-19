import { _ as _sliced_to_array } from "@swc/helpers/_/_sliced_to_array";
import { i18n } from "../i18n/index.js";
import { isArray, isString } from "@m78/utils";
/** 黑暗模式处理 */ export function _darkModeHandle(darkMode) {
    if (darkMode !== undefined && typeof window !== "undefined" && window.document) {
        document.documentElement.setAttribute("data-mode", darkMode ? "dark" : "light");
    }
}
/** 国际化处理 */ export function _i18nHandle(i18nConf) {
    if (!i18nConf) return;
    var lng;
    var resource;
    if (isString(i18nConf)) {
        lng = i18nConf;
    } else if (isArray(i18nConf) && i18nConf.length === 2) {
        var ref;
        ref = _sliced_to_array(i18nConf, 2), lng = ref[0], resource = ref[1], ref;
    }
    var hasLng = isString(lng);
    if (hasLng && resource) {
        // 每次只能添加一个命名空间, 这里需要循环处理一下
        Object.entries(resource).forEach(function(param) {
            var _param = _sliced_to_array(param, 2), ns = _param[0], conf = _param[1];
            i18n.addResourceBundle(lng, ns, conf, false, true);
        });
    }
    if (hasLng) {
        i18n.changeLanguage(lng, function(err) {
            if (err) console.warn(err);
        });
    }
}
