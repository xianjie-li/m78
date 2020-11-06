import { useEffect } from 'react';
import { isNumber } from '@lxjx/utils';
import { Share } from './types';
import { useMethods } from './methods';

export function useLifeCycle(share: Share, methods: ReturnType<typeof useMethods>) {
  const { props, openCheck, flatMetas } = share;

  const { defaultOpenAll, defaultOpenZIndex } = props;

  // 启用默认展开全部行为
  useEffect(() => {
    if (defaultOpenAll) {
      methods.openAll();
    }
  }, [defaultOpenAll]);

  useEffect(() => {
    if (isNumber(defaultOpenZIndex)) {
      methods.openToZ(defaultOpenZIndex);
    }
  }, [defaultOpenZIndex]);
}
