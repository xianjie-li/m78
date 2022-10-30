import _to_consumable_array from "@swc/helpers/src/_to_consumable_array.mjs";
/**
 * 生成和实现subscribe() api
 * - 通知功能在setDeps内部
 * */ export function subscribeImpl(share) {
    return function(listener) {
        share.listeners.push(listener);
        return function() {
            var ind = share.listeners.indexOf(listener);
            if (ind === -1) return;
            share.listeners.splice(ind, 1);
        };
    };
}
/**
 * 实现中间件功能
 * */ export function middlewareImpl(conf) {
    var middleware = conf.middleware;
    if (!(middleware === null || middleware === void 0 ? void 0 : middleware.length)) return [
        conf
    ];
    var allMid = _to_consumable_array(middleware);
    var ctx = {};
    var initBonus = {
        ctx: ctx,
        config: conf,
        init: true
    };
    allMid.forEach(function(mid) {
        if (mid) {
            var nextConf = mid(initBonus);
            if (nextConf === undefined) throw Error("seed: do you forget to return to the config during the middleware initialization phase?");
            initBonus.config = nextConf;
        }
    });
    var patchHandler = function(apis) {
        var patchBonus = {
            init: false,
            apis: apis,
            ctx: ctx,
            monkey: function(name, cb) {
                var next = apis[name];
                if (!next) return;
                apis[name] = cb(next);
            }
        };
        allMid.reverse(); /* patch函数是由内到外执行的，需要反转顺序 */ 
        allMid.forEach(function(mid) {
            return mid && mid(patchBonus);
        });
    };
    return [
        initBonus.config,
        patchHandler
    ];
}
