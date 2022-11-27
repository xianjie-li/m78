import { useContext, useEffect } from "react";
import { useFn, useSetState } from "@m78/hooks";
import _debounce from "lodash/debounce.js";
import { _defaultContext, _mediaQueryCtx } from "./context.js";
import {
  MediaQueryConf,
  MediaQueryMeta,
  MediaQueryListenerProps,
  _MediaQueryBaseConf,
} from "./types.js";
import { _mediaQueryGetter, _onChangeHandle } from "./common.js";

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export function _useMediaQuery<Val = any>(conf?: MediaQueryConf<Val>) {
  const type = conf?.listenType;
  const isType = !type || type === "type";

  const [state, setState] = useSetState({
    meta: null as null | MediaQueryMeta,
    value: undefined as undefined | Val,
  });

  _useMediaQueryListener((meta) => {
    let value: undefined | Val = undefined;
    if (conf) {
      value = _mediaQueryGetter<Val>(
        meta,
        conf,
        undefined as any,
        undefined,
        conf.reverse
      );
    }

    if (isType) {
      if (meta.type !== state.meta?.type)
        setState({
          meta,
          value,
        });
    } else if (
      meta.width !== state.meta?.width ||
      meta.height !== state.meta?.height
    ) {
      setState({
        meta,
        value,
      });
    }
  }, conf);

  return state;
}

/**
 * 窗口尺寸改变时通过监听器通知
 * */
export function _useMediaQueryListener(
  onChange: MediaQueryListenerProps["onChange"],
  conf?: _MediaQueryBaseConf
) {
  const mqCtx = useContext(_mediaQueryCtx);

  const oc = useFn(onChange, (fn) => {
    const debounceDelay = conf?.debounce;
    if (debounceDelay) {
      return _debounce(fn, debounceDelay);
    }
    return fn;
  });

  useEffect(() => {
    mqCtx.changeListeners.push(oc);
    mqCtx.meta && oc(mqCtx.meta);

    return () => {
      const ind = mqCtx.changeListeners.indexOf(oc);

      if (ind !== -1) {
        mqCtx.changeListeners.splice(ind, 1);
      }
    };
  }, []);

  // 无匹配context的情况下使用window
  useEffect(() => {
    const resizeHandle = () => {
      _defaultContext.onChange({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 直接通过onChange派发初始化通知，防止debounce影响
    if (mqCtx.isRoot) {
      onChange(
        _onChangeHandle(
          {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          mqCtx,
          true
        )!
      );
      window.addEventListener("resize", resizeHandle);
    }

    return () => {
      mqCtx.isRoot && window.removeEventListener("resize", resizeHandle);
    };
  }, [mqCtx.isRoot]);
}
