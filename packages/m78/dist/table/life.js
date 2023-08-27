import { useEffect } from "react";
import { useDestroy } from "@m78/hooks";
export function _useLife(ctx, methods) {
    var init = /** 初始化 */ function init() {
        methods.initEmptyNode();
    };
    var destroy = /** 销毁 */ function destroy() {
        state.instance.destroy();
    };
    var state = ctx.state;
    useEffect(init, []);
    useDestroy(destroy);
    return {};
}
