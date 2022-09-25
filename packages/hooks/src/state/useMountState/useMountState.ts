import { useEffect, useState } from "react";
import { useFn } from "../../";

export interface UseMountStateConfig {
  /** true | 如果为true，在第一次启用时才真正挂载内容 */
  mountOnEnter?: boolean;
  /** false | 在关闭时卸载内容 */
  unmountOnExit?: boolean;
}

/**
 * 用于便捷的实现mountOnEnter/unmountOnExit接口
 * - 卸载的准确时机hook内是不能感知的，因为可能中间会存在动画或其他延迟行为，所以需要用户在正确时机调用unmount()通知卸载
 * */
export function useMountState(
  toggle: boolean,
  { mountOnEnter = true, unmountOnExit = false }: UseMountStateConfig = {}
) {
  const [mount, setMount] = useState(() => {
    // mountOnEnter为false时，强制渲染, 否则取init
    if (!mountOnEnter) return true;
    return toggle;
  });

  // 自动同步true状态, false状态因为可能存在动画等, 由用户手动触发
  useEffect(() => {
    toggle && monkeySet(toggle);
  }, [toggle]);

  const unmount = useFn(() => monkeySet(false));

  function monkeySet(m: boolean) {
    // 需要挂载但未挂载时对其进行挂载
    if (m && !mount) {
      setMount(true);
      return;
    }

    // 需要离场卸载且收到卸载通知且当前已挂载
    if (unmountOnExit && !m && mount) {
      setMount(false);
    }
  }

  return [mount, unmount] as const;
}
