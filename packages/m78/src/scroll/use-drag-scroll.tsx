import { _ScrollContext } from "./types.js";
import { useDrag } from "@use-gesture/react";
import { config } from "react-spring";

export const _useDragScroll = (ctx: _ScrollContext) => {
  const { scroller, xEnabled, yEnabled, dragScrollEnable } = ctx;

  useDrag(
    ({
      delta: [x, y],
      down,
      velocity: [velocityX, velocityY],
      movement: [movementX, movementY],
    }) => {
      if (down) {
        scroller.set({
          x: xEnabled ? -x : undefined,
          y: yEnabled ? -y : undefined,
          raise: true,
          immediate: true,
        });
        return;
      }

      let newX = -movementX;
      let newY = -movementY;

      const xAb = Math.abs(movementX);
      const yAb = Math.abs(movementY);

      // 拖动距离过小时不产生惯性
      const triggerOffset = 14;

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
            config: config.slow,
          },
        });
      }
    },
    {
      from: [0, 0],
      target: ctx.innerWrapRef,
      filterTaps: true,
      enabled: dragScrollEnable,
    }
  );
};
