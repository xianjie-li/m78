import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { useEffect, useMemo, useRef } from "react";
import { dumpFn } from "@m78/utils";
import { createScrollTrigger } from "../scroll/scroll.js";
import { getRefDomOrDom, useFn } from "@m78/hooks";
import { isArray } from "lodash";
export function useScroll(option) {
    // 用于返回的节点获取ref
    var ref = useRef(null);
    var instance = useMemo(function() {
        return {
            ref: ref,
            scroll: dumpFn,
            scrollToE: dumpFn,
            scrollToElement: dumpFn,
            get: dumpFn,
            destroy: dumpFn
        };
    }, []);
    var handle = useFn(function(e) {
        var _option_onScroll;
        (_option_onScroll = option.onScroll) === null || _option_onScroll === void 0 ? void 0 : _option_onScroll.call(option, e);
    });
    // 在满足条件时重载实例
    var getDeps = function() {
        var _option_el;
        var _offset = option.offset;
        var offset = isArray(_offset) ? _offset : [
            _offset,
            _offset
        ];
        var _touchOffset = option.touchOffset;
        var touchOffset = isArray(_touchOffset) ? _touchOffset : [
            _touchOffset,
            _touchOffset
        ];
        return [
            option.el,
            ref.current,
            (_option_el = option.el) === null || _option_el === void 0 ? void 0 : _option_el.current,
            offset[0],
            offset[1],
            touchOffset[0],
            touchOffset[1]
        ];
    };
    useEffect(function() {
        var curEl = getRefDomOrDom(option.el, ref);
        if (curEl) {
            Object.assign(instance, createScrollTrigger(_object_spread_props(_object_spread({}, option), {
                target: curEl,
                handle: handle
            })));
        }
        return function() {
            var _instance_destroy;
            (_instance_destroy = instance.destroy) === null || _instance_destroy === void 0 ? void 0 : _instance_destroy.call(instance);
        };
    }, getDeps());
    return instance;
}
