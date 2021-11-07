import { useContext, useEffect, useState } from 'react';
import { useFn } from '@lxjx/hooks';
import _debounce from 'lodash/debounce';
import { defaultContext, mediaQueryCtx } from './context';
import { MediaQueryConf, MediaQueryMeta, MediaQueryListenerProps } from '../types';
import { onChangeHandle } from './common';

/**
 * 窗口尺寸改变时通过监听器通知
 * */
export function useMediaQueryListener(
  onChange: MediaQueryListenerProps['onChange'],
  conf?: Omit<MediaQueryConf, 'listenType'>,
) {
  const mqCtx = useContext(mediaQueryCtx);

  const oc = useFn(onChange, fn => {
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

  // use window when there is no context
  useEffect(() => {
    const resizeHandle = () => {
      defaultContext.onChange({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // 直接通过onChange派发通知，防止debounce影响
    if (mqCtx.isRoot) {
      onChange(
        onChangeHandle(
          {
            width: window.innerWidth,
            height: window.innerHeight,
          },
          mqCtx,
          true,
        )!,
      );
      window.addEventListener('resize', resizeHandle);
    }

    return () => {
      mqCtx.isRoot && window.removeEventListener('resize', resizeHandle);
    };
  }, [mqCtx.isRoot]);
}

/**
 * 窗口尺寸改变时通过回调通知传入子项帮助渲染
 * */
export function useMediaQuery(conf?: MediaQueryConf) {
  const type = conf?.listenType;
  const isType = !type || type === 'type';

  const [state, setState] = useState<MediaQueryMeta | null>(null);

  useMediaQueryListener(meta => {
    if (isType) {
      if (meta.type !== state?.type) setState(meta);
    } else if (meta.width !== state?.width || meta.height !== state?.height) {
      setState(meta);
    }
  }, conf);

  return state;
}
