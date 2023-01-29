import { useEffect, useRef } from "react";
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
    var handle = useFn(function(e) {
        var domLs = getTargetDomList(target, ref);
        if (!(domLs === null || domLs === void 0 ? void 0 : domLs.length)) return;
        var isInner = domLs.some(function(dom) {
            return dom.contains(e.target);
        });
        !isInner && onTrigger(e);
    });
    useEffect(function() {
        bindHelper();
        return function() {
            return bindHelper(true);
        };
    }, events);
    return ref;
}
