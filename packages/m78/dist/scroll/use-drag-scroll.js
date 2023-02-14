import _sliced_to_array from "@swc/helpers/src/_sliced_to_array.mjs";
import { useDrag } from "@use-gesture/react";
import { config } from "react-spring";
export var _useDragScroll = function(ctx) {
    var scroller = ctx.scroller, xEnabled = ctx.xEnabled, yEnabled = ctx.yEnabled, dragScrollEnable = ctx.dragScrollEnable;
    useDrag(function(param) {
        var _delta = _sliced_to_array(param.delta, 2), x = _delta[0], y = _delta[1], down = param.down, _velocity = _sliced_to_array(param.velocity, 2), velocityX = _velocity[0], velocityY = _velocity[1], _movement = _sliced_to_array(param.movement, 2), movementX = _movement[0], movementY = _movement[1];
        if (down) {
            scroller.set({
                x: xEnabled ? -x : undefined,
                y: yEnabled ? -y : undefined,
                raise: true,
                immediate: true
            });
            return;
        }
        var newX = -movementX;
        var newY = -movementY;
        var xAb = Math.abs(movementX);
        var yAb = Math.abs(movementY);
        // 拖动距离过小时不产生惯性
        var triggerOffset = 14;
        if (xAb > triggerOffset) {
            newX = newX * (velocityX * 4);
        }
        if (yAb > triggerOffset) {
            newY = newY * (velocityY * 4);
        }
        if (xAb > triggerOffset || yAb > triggerOffset) {
            scroller.set({
                x: xEnabled ? newX : undefined,
                y: yEnabled ? newY : undefined,
                raise: true,
                config: {
                    config: config.slow
                }
            });
        }
    }, {
        from: [
            0,
            0
        ],
        target: scroller.ref,
        filterTaps: true,
        enabled: dragScrollEnable
    });
};
