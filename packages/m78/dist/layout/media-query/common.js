import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { isArray } from "@lxjx/utils";
import { MediaQueryTypeKeys, MediaQueryTypeValues } from "./types";
/**
 * 根据尺寸检测是何种类型
 * */ export function _calcType(size) {
    if (size >= MediaQueryTypeValues.XXL) {
        return MediaQueryTypeKeys.XXL;
    }
    if (size >= MediaQueryTypeValues.XL && size < MediaQueryTypeValues.XXL) {
        return MediaQueryTypeKeys.XL;
    }
    if (size >= MediaQueryTypeValues.LG && size < MediaQueryTypeValues.XL) {
        return MediaQueryTypeKeys.LG;
    }
    if (size >= MediaQueryTypeValues.MD && size < MediaQueryTypeValues.LG) {
        return MediaQueryTypeKeys.MD;
    }
    if (size >= MediaQueryTypeValues.SM && size < MediaQueryTypeValues.MD) {
        return MediaQueryTypeKeys.SM;
    }
    return MediaQueryTypeKeys.XS;
}
/**
 * 抽取onChange公共逻辑
 * 如果传入了skipEmit，会跳过通知Listeners并改为返回meta对象
 * */ export function _onChangeHandle(param, ctx, skipEmit) {
    var width = param.width, height = param.height;
    var type = _calcType(width);
    var changeListeners = ctx.changeListeners;
    var size = {
        width: width,
        height: height
    };
    var is = {
        isXS: function() {
            return type === MediaQueryTypeKeys.XS;
        },
        isSM: function() {
            return type === MediaQueryTypeKeys.SM;
        },
        isMD: function() {
            return type === MediaQueryTypeKeys.MD;
        },
        isLG: function() {
            return type === MediaQueryTypeKeys.LG;
        },
        isXL: function() {
            return type === MediaQueryTypeKeys.XL;
        },
        isXXL: function() {
            return type === MediaQueryTypeKeys.XXL;
        },
        isSmall: function() {
            return is.isXS() || is.isSM();
        },
        isMedium: function() {
            return is.isMD() || is.isLG();
        },
        isLarge: function() {
            return !is.isSmall() && !is.isMedium();
        }
    };
    var full = _object_spread(_object_spread_props(_object_spread({}, size), {
        type: type
    }), is);
    ctx.meta = full;
    if (skipEmit) {
        return ctx.meta;
    }
    if (isArray(changeListeners)) {
        changeListeners.forEach(function(fn) {
            return fn(full);
        });
    }
}
var _mediaQueryGetterDefaultChecker = function(item) {
    return item !== undefined;
};
/**
 * 根据 { [MediaQueryTypeKeys]: T } 格式的对象获取当前尺寸下符合条件的值
 * 为了减少断点书写，断点包含一套继承机制，较小值会继承较大值
 * @param meta - 媒体查询源信息
 * @param mq - 包含MediaQueryTypeKeys配置的对象
 * @param fullback - 没有任何匹配的回退值
 * @param checker - 自定义T是否生效，默认检测其是否为undefined
 * @param reverse - 以相反的方向继承
 * @return t - 满足当前媒体条件的值
 * */ export function _mediaQueryGetter(meta, mq, fullback, checker) {
    var reverse = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
    var val;
    var _checker = checker || _mediaQueryGetterDefaultChecker;
    /** 从列表中获取首个包含正确值的value */ var getFirst = function(cLs) {
        return cLs.find(_checker);
    };
    var getLast = function(cLs) {
        return _to_consumable_array(cLs).reverse().find(_checker);
    };
    var currentGetter = reverse ? getLast : getFirst;
    /** 取值顺序 */ var ls = [
        mq.xxl,
        mq.xl,
        mq.lg,
        mq.md,
        mq.sm,
        mq.xs
    ];
    if (meta.isXXL()) {
        val = currentGetter(reverse ? ls.slice(0, 1) : ls);
    }
    if (meta.isXL()) {
        val = currentGetter(reverse ? ls.slice(0, 2) : ls.slice(1));
    }
    if (meta.isLG()) {
        val = currentGetter(reverse ? ls.slice(0, 3) : ls.slice(2));
    }
    if (meta.isMD()) {
        val = currentGetter(reverse ? ls.slice(0, 4) : ls.slice(3));
    }
    if (meta.isSM()) {
        val = currentGetter(reverse ? ls.slice(0, 5) : ls.slice(4));
    }
    if (meta.isXS()) {
        val = currentGetter(reverse ? ls.slice(0, 6) : ls.slice(5));
    }
    if (!_checker(val)) {
        val = fullback;
    }
    return val;
}
