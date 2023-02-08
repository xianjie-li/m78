export function _useMethod(ctx) {
    var refreshIndicator = /** 刷新指示器状态 */ function refreshIndicator(meta) {
        meta = meta || scroller.get();
        // 同步需要的meta信息到状态中, setState在值相同时会跳过render, 所以这里不用担心性能
        setState({
            touchTop: meta.touchTop,
            touchBottom: meta.touchBottom,
            touchLeft: meta.touchLeft,
            touchRight: meta.touchRight,
            xMax: meta.xMax,
            yMax: meta.yMax
        });
    };
    var setState = ctx.setState, scroller = ctx.scroller;
    return {
        refreshIndicator: refreshIndicator
    };
}
