import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import { useEffect, useMemo, useRef } from "react";
import { isArray } from "@m78/utils";
import { getTargetDomList, useFn } from "../../index.js";
var defaultEvents = [
    "mousedown",
    "touchstart"
];
export function useClickAway(param) {
    var target = param.target, _events = param.events, events = _events === void 0 ? defaultEvents : _events, onTrigger = param.onTrigger;
    var bindHelper = function bindHelper() {
        var isOff = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
        events.forEach(function(eventKey) {
            document[isOff ? "removeEventListener" : "addEventListener"](eventKey, handle);
        });
    };
    var ref = useRef();
    var domList = useRef([]);
    var handle = useFn(function(e) {
        if (!domList.current.length) return;
        var isInner = domList.current.some(function(dom) {
            return dom.contains(e.target);
        });
        !isInner && onTrigger(e);
    });
    var targetLs = useMemo(function() {
        var r = ref;
        if (!target) return [
            r
        ];
        if (!isArray(target)) return [
            target,
            r
        ];
        return _to_consumable_array(target).concat([
            r
        ]);
    }, [
        target,
        ref.current
    ]);
    useEffect(function() {
        domList.current = getTargetDomList(targetLs) || [];
    }, targetLs);
    useEffect(function() {
        bindHelper();
        return function() {
            return bindHelper(true);
        };
    }, events);
    return ref;
}
