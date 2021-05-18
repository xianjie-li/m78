import React, { useContext, useEffect } from 'react';
import { useMeasure } from '@lxjx/hooks';
import { mediaQueryCtx } from './context';

const style: React.CSSProperties = {
  position: 'absolute',
  visibility: 'hidden',
  zIndex: -1,
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
};

/**
 * 附加到某个包含非常规定位属性的元素上并对其尺寸进行持续测量, 通过mediaQueryCtx回调变更
 * */
const MediaQueryCalc = () => {
  const [ref, bound] = useMeasure<HTMLDivElement>();

  const mqCtx = useContext(mediaQueryCtx);

  useEffect(() => {
    // 过滤掉无效回调
    if (bound.width === 0 && bound.height === 0) return;

    mqCtx.onChange(bound);
  }, [bound]);

  return <div ref={ref} style={style} />;
};

export default MediaQueryCalc;
