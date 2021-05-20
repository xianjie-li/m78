import { MediaQueryListenerProps, MediaQueryProps } from '../types';
import { useMediaQuery, useMediaQueryListener } from './hooks';
import { mediaQueryGetter } from 'm78/layout';

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
function MediaQuery<Val>({
  children,
  xs,
  sm,
  md,
  lg,
  xl,
  xxl,
  reverse,
  ...conf
}: MediaQueryProps<Val>) {
  const meta = useMediaQuery(conf);

  let val = meta
    ? mediaQueryGetter<Val>(
        meta,
        {
          xs,
          sm,
          md,
          lg,
          xl,
          xxl,
        },
        undefined as any,
        undefined,
        reverse,
      )
    : undefined;

  return meta ? children(meta, val!) : null;
}

export { MediaQueryListener, MediaQuery };
