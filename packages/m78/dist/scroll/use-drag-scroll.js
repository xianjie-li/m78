import { useEffect } from "react";
import { DragScroll as PhysicalScroll, DragScrollEventType as PhysicalScrollEventType } from "@m78/smooth-scroll";
export var _useDragScroll = function(ctx) {
    var props = ctx.props, xEnabled = ctx.xEnabled, yEnabled = ctx.yEnabled, innerWrapRef = ctx.innerWrapRef;
    useEffect(function() {
        var ins;
        if (props.dragScroll) {
            ins = new PhysicalScroll({
                el: ctx.innerWrapRef.current,
                type: [
                    PhysicalScrollEventType.mouse
                ],
                trigger: function trigger(e) {
                    var dom = innerWrapRef.current;
                    yEnabled && (dom.scrollTop = dom.scrollTop + e.y);
                    xEnabled && (dom.scrollLeft = dom.scrollLeft + e.x);
                }
            });
        }
        return function() {
            ins && ins.destroy();
        };
    }, [
        props.dragScroll
    ]);
};
