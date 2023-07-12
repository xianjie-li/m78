import { _ScrollContext } from "./types.js";
import { useEffect, useMemo } from "react";
import {
  EmptyFunction,
  PhysicalScroll,
  PhysicalScrollEventType,
  rafCaller,
} from "@m78/utils";

export const _useDragScroll = (ctx: _ScrollContext) => {
  const { props, xEnabled, yEnabled, innerWrapRef } = ctx;

  const refCall = useMemo(() => rafCaller(), []);

  useEffect(() => {
    let ins: PhysicalScroll;
    let refClear: EmptyFunction;

    if (props.dragScroll) {
      ins = new PhysicalScroll({
        el: ctx.innerWrapRef.current!,
        type: [PhysicalScrollEventType.mouse],
        // 需要实现xEnabled/yEnabled, 所以根据事件自行更新
        onlyNotify: true,
        onScroll([x, y], isAutoScroll) {
          const dom = innerWrapRef.current!;
          if (isAutoScroll) {
            yEnabled && (dom.scrollTop = y);
            xEnabled && (dom.scrollLeft = x);
          } else {
            refClear = refCall(() => {
              yEnabled && (dom.scrollTop = y);
              xEnabled && (dom.scrollLeft = x);
            });
          }
        },
      });
    }
    return () => {
      ins && ins.destroy();
      refClear && refClear();
    };
  }, [props.dragScroll]);
};
