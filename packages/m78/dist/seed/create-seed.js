import _object_spread from "@swc/helpers/src/_object_spread.mjs";
import _object_spread_props from "@swc/helpers/src/_object_spread_props.mjs";
import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
import create from "@m78/seed";
import { _insideMiddleware } from "./middleware";
export var _CreateSeed = function(conf) {
    var ref;
    var middleware = [
        _insideMiddleware
    ];
    if (conf === null || conf === void 0 ? void 0 : (ref = conf.middleware) === null || ref === void 0 ? void 0 : ref.length) {
        var _middleware;
        (_middleware = middleware).push.apply(_middleware, _to_consumable_array(conf.middleware));
    }
    return create(_object_spread_props(_object_spread({}, conf), {
        middleware: middleware
    }));
};
