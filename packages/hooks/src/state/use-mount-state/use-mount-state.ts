import { useEffect, useState } from "react";
import { useFn } from "../../index.js";

export interface UseMountStateConfig {
  /** 默认为 true, 表示在第一次开启时才真正挂载内容, 设置为 false 时, 内容会随组件在第一时间挂载 */
  mountOnEnter?: boolean;
  /** 默认为 false, 表示在关闭后是否保留内容节点, 如果内容频繁切换且需要维护状态, false是更明智的选择, 像 tooltip 这类低创建和销毁成本的功能则可以选择开启 */
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
