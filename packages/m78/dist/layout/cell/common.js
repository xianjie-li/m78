import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { _mediaQueryGetter } from "../media-query/common";
import { isNumber, isObject, isTruthyOrZero } from "@m78/utils";
/**
 * 根据MediaQueryMeta从GridColProps中获取GridColMediaQueryProps
 * 获取遵循以下规则:
 * - 当前媒体尺寸不包含有效配置时，从小于此区间的媒体尺寸中依次获取并拿到第一个有效配置
 * - 当任何区间都不能获取到有效值时，获取直接传入的配置
 * - 如下所示
 * - xxl.col > md.col > xs.col > props.col
 * - xxl.offset > md.offset > xs.offset > props.offset
 * */ export function _getCurrentMqProps(mqMeta, param) {
    var col = param.col, offset = param.offset, move = param.move, order = param.order, flex = param.flex, hidden = param.hidden, align = param.align, xs = param.xs, sm = param.sm, md = param.md, lg = param.lg, xl = param.xl, xxl = param.xxl, className = param.className, style = param.style;
    var mqObject = {
        xs: xs,
        sm: sm,
        md: md,
        lg: lg,
        xl: xl,
        xxl: xxl
    };
    var obj = {
        col: _mediaQueryGetter(mqMeta, mqObject, col, function(item) {
            return isNumber(item) || isNumber(item === null || item === void 0 ? void 0 : item.col);
        }),
        offset: _mediaQueryGetter(mqMeta, mqObject, offset, function(item) {
            return !isNumber(item) && isNumber(item === null || item === void 0 ? void 0 : item.offset);
        }),
        move: _mediaQueryGetter(mqMeta, mqObject, move, function(item) {
            return !isNumber(item) && isNumber(item === null || item === void 0 ? void 0 : item.move);
        }),
        order: _mediaQueryGetter(mqMeta, mqObject, order, function(item) {
            return !isNumber(item) && isNumber(item === null || item === void 0 ? void 0 : item.order);
        }),
        flex: _mediaQueryGetter(mqMeta, mqObject, flex, function(item) {
            return !isNumber(item) && isTruthyOrZero(item === null || item === void 0 ? void 0 : item.flex);
        }),
        hidden: _mediaQueryGetter(mqMeta, mqObject, hidden, function(item) {
            return !isNumber(item) && (item === null || item === void 0 ? void 0 : item.hidden);
        }, true),
        align: _mediaQueryGetter(mqMeta, mqObject, align, function(item) {
            return !isNumber(item) && (item === null || item === void 0 ? void 0 : item.align);
        }),
        className: _mediaQueryGetter(mqMeta, mqObject, className, function(item) {
            return !isNumber(item) && (item === null || item === void 0 ? void 0 : item.className);
        }),
        style: _mediaQueryGetter(mqMeta, mqObject, style, function(item) {
            return !isNumber(item) && (item === null || item === void 0 ? void 0 : item.style);
        })
    };
    var gridColMediaQueryProps = {};
    Object.entries(obj).forEach(function(param) {
        var _param = _sliced_to_array(param, 2), k = _param[0], v = _param[1];
        if (isObject(v)) {
            gridColMediaQueryProps[k] = v[k];
        } else {
            gridColMediaQueryProps[k] = v;
        }
    });
    return gridColMediaQueryProps;
}
