var count = 1;
var devtool = function(bonus) {
    if (typeof window === "undefined" || !window.__REDUX_DEVTOOLS_EXTENSION__) {
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
        var ls = function() {
            bonus.ctx.devtool.send("change state", bonus.apis.get());
        };
        var uls = bonus.apis.subscribe(ls);
        bonus.ctx.devtool.subscribe(function(message) {
            if (message.type === "DISPATCH" && message.state) {
                uls();
                bonus.apis.coverSet(JSON.parse(message.state));
                uls = bonus.apis.subscribe(ls);
            }
        });
    }
};
export default devtool;
