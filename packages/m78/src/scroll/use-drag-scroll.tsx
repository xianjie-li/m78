import { _ScrollContext } from "./types.js";
import { useEffect } from "react";
import {
  DragScroll as PhysicalScroll,
  DragScrollEventType as PhysicalScrollEventType,
} from "@m78/animate-tools";

export const _useDragScroll = (ctx: _ScrollContext) => {
  const { props, xEnabled, yEnabled, innerWrapRef } = ctx;

  useEffect(() => {
    let ins: PhysicalScroll;

    if (props.dragScroll) {
      ins = new PhysicalScroll({
        el: ctx.innerWrapRef.current!,
        type: [PhysicalScrollEventType.mouse],
        trigger(e) {
          const dom = innerWrapRef.current!;

          yEnabled && (dom.scrollTop = dom.scrollTop + e.y);
          xEnabled && (dom.scrollLeft = dom.scrollLeft + e.x);
        },
      });
    }
    return () => {
      ins && ins.destroy();
    };
  }, [props.dragScroll]);
};
