import { MediaQueryListenerProps, MediaQueryProps } from "./types";
import { _useMediaQuery, _useMediaQueryListener } from "./hooks";

/**
 * 窗口尺寸改变时通过回调通知
 * */
export function _MediaQueryListener({ onChange }: MediaQueryListenerProps) {
  _useMediaQueryListener(onChange);
  return null;
}

_MediaQueryListener.displayName = "MediaQueryListener";

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export function _MediaQuery<Val>(conf: MediaQueryProps<Val>) {
  const state = _useMediaQuery(conf);

  return state.meta ? conf.children(state.meta, state.value!) : null;
}

_MediaQuery.displayName = "MediaQuery";
