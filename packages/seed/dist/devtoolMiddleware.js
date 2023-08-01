var count = 1;
export var devtoolMiddleware = function(bonus) {
    if (typeof window === "undefined" || !window.__REDUX_DEVTOOLS_EXTENSION__ || process.env.NODE_ENV !== "development") {
        return bonus.init ? bonus.config : undefined;
    }
    if (bonus.init) {
        var extension = window.__REDUX_DEVTOOLS_EXTENSION__;
        var dt = extension.connect({
            name: "".concat(document.title || "seed", "-").concat(count > 1 ? count : "")
        });
        dt.init(bonus.config.state);
        bonus.ctx.devtool = dt;
        count++;
        return bonus.config;
    }
    if (bonus.ctx.devtool) {
        var ls = function(changes) {
            bonus.ctx.devtool.send("change state (".concat(Object.keys(changes) || "-", ")"), bonus.apis.get());
        };
        // 局部变量放在对象中, 防止取到快照
        var configStore = {
            unsubscribe: null
        };
        configStore.unsubscribe = bonus.apis.subscribe(ls);
        bonus.ctx.devtool.subscribe(function(message) {
            // 插件触发更新
            if (message.type === "DISPATCH" && message.state) {
                configStore.unsubscribe();
                bonus.apis.coverSet(JSON.parse(message.state));
                configStore.unsubscribe = bonus.apis.subscribe(ls);
            }
        });
    }
};
