import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import create from "@m78/seed";
import { _insideMiddleware } from "./middleware.js";
export var _CreateSeed = function(conf) {
    var _conf_middleware;
    var middleware = [
        _insideMiddleware
    ];
    if (conf === null || conf === void 0 ? void 0 : (_conf_middleware = conf.middleware) === null || _conf_middleware === void 0 ? void 0 : _conf_middleware.length) {
        var _middleware;
        (_middleware = middleware).push.apply(_middleware, _to_consumable_array(conf.middleware));
    }
    return create(_object_spread_props(_object_spread({}, conf), {
        middleware: middleware
    }));
};
