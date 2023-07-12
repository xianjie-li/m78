import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useEffect, useMemo } from "react";
import { PhysicalScroll, PhysicalScrollEventType, rafCaller } from "@m78/utils";
export var _useDragScroll = function(ctx) {
    var props = ctx.props, xEnabled = ctx.xEnabled, yEnabled = ctx.yEnabled, innerWrapRef = ctx.innerWrapRef;
    var refCall = useMemo(function() {
        return rafCaller();
    }, []);
    useEffect(function() {
        var ins;
        var refClear;
        if (props.dragScroll) {
            ins = new PhysicalScroll({
                el: ctx.innerWrapRef.current,
                type: [
                    PhysicalScrollEventType.mouse
                ],
                // 需要实现xEnabled/yEnabled, 所以根据事件自行更新
                onlyNotify: true,
                onScroll: function(param, isAutoScroll) {
                    var _param = _sliced_to_array(param, 2), x = _param[0], y = _param[1];
                    var dom = innerWrapRef.current;
                    if (isAutoScroll) {
                        yEnabled && (dom.scrollTop = y);
                        xEnabled && (dom.scrollLeft = x);
                    } else {
                        refClear = refCall(function() {
                            yEnabled && (dom.scrollTop = y);
                            xEnabled && (dom.scrollLeft = x);
                        });
                    }
                }
            });
        }
        return function() {
            ins && ins.destroy();
            refClear && refClear();
        };
    }, [
        props.dragScroll
    ]);
};
