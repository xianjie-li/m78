import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _create_class } from "@swc/helpers/_/_create_class";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { isUndefined } from "../is.js";
/**
 * Cache it! in the tick.
 * */ export var CacheTick = /*#__PURE__*/ function() {
    "use strict";
    function CacheTick() {
        _class_call_check(this, CacheTick);
        _define_property(this, "cache", void 0);
    }
    _create_class(CacheTick, [
        {
            /** Get value by specified key, if not, get it through getter and write latest value to the cache */ key: "get",
            value: function get(key, getter) {
                if (!this.cache) {
                    if (!getter) return;
                    return getter();
                }
                var cCache = this.cache[key];
                if (isUndefined(cCache)) {
                    if (!getter) return;
                    var fresh = getter();
                    this.cache[key] = fresh;
                    return fresh;
                }
                return cCache;
            }
        },
        {
            /** Start a cache frame, all repeat get will be reuse */ key: "tick",
            value: function tick(cb) {
                this.cache = {};
                cb();
                this.cache = undefined;
            }
        }
    ]);
    return CacheTick;
}();
