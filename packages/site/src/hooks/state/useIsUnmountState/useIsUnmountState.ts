import { useEffect, useRef } from 'react';
import { useFn } from '@m78/hooks';

/**
 * 获取组件是否已卸载的状态, 用于防止组件在卸载后执行操作
 * */
export function useIsUnmountState() {
  const ref = useRef(false);

  useEffect(() => {
    return () => {
      ref.current = true;
    };
  }, []);

  return useFn(() => ref.current);
}
