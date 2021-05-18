import { MediaQueryListenerProps, MediaQueryProps } from '../types';
import { useMediaQuery, useMediaQueryListener } from './hooks';

/**
 * 窗口尺寸改变时通过回调通知
 * */
function MediaQueryListener({ onChange }: MediaQueryListenerProps) {
  useMediaQueryListener(onChange);
  return null;
}

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
function MediaQuery({ children, ...conf }: MediaQueryProps) {
  const meta = useMediaQuery(conf);

  return meta ? children(meta) : null;
}

export { MediaQueryListener, MediaQuery };
