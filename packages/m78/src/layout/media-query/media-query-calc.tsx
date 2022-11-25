import React, { useContext, useEffect } from "react";
import { useMeasure } from "@m78/hooks";
import { _mediaQueryCtx } from "./context";

const style: React.CSSProperties = {
  position: "absolute",
  visibility: "hidden",
  zIndex: -1,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

/**
 * 放置到某个position不为static的元素上并对其尺寸进行持续测量, 然后通过mediaQueryCtx回调变更
 * */
const _MediaQueryCalc = () => {
  const [bound, ref] = useMeasure<HTMLDivElement>();

  const mqCtx = useContext(_mediaQueryCtx);

  useEffect(() => {
    // 过滤掉无效回调
    if (bound.width === 0 && bound.height === 0) return;

    mqCtx.onChange(bound);
  }, [bound]);

  return <div ref={ref} style={style} />;
};

export default _MediaQueryCalc;
