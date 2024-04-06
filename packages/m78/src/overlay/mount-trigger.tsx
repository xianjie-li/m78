import { useEffect } from "react";

interface Props {
  onMount: () => void;
  onUnmount: () => void;
}

/**
 * 一个功能组件, 随content一同挂载并回调mount和unmount事件
 * */
export function _MountTrigger({ onMount, onUnmount }: Props) {
  useEffect(() => {
    onMount();

    return onUnmount;
  }, []);

  return null;
}
