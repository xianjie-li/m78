import { useEffect, useMemo, useRef } from "react";
import { isArray } from "@m78/utils";
import { DomTarget, getTargetDomList, useFn } from "../../";

export interface UseClickAwayConfig {
  /** 触发回调, e取决于events配置, 用户可根据events自行进行类型断言 */
  onTrigger: (e: Event) => void;
  /** 监听目标, 可以是单个或多个DOM/包含DOM的react ref */
  target?: DomTarget | DomTarget[];
  /** ['mousedown', 'touchstart'] | 要触发的事件 */
  events?: string[];
}

const defaultEvents = ["mousedown", "touchstart"];

export function useClickAway({
  target,
  events = defaultEvents,
  onTrigger,
}: UseClickAwayConfig) {
  const ref = useRef<any>();
  const domList = useRef<HTMLElement[]>([]);

  const handle: EventListener = useFn((e) => {
    if (!domList.current.length) return;

    const isInner = domList.current.some((dom) => {
      return dom.contains(e.target as Node);
    });

    !isInner && onTrigger(e);
  });

  const targetLs = useMemo(() => {
    const r: DomTarget = ref;
    if (!target) return [r];
    if (!isArray(target)) return [target, r];
    return [...target, r];
  }, [target, ref.current]);

  useEffect(() => {
    domList.current = getTargetDomList(targetLs) || [];
  }, targetLs);

  useEffect(() => {
    bindHelper();
    return () => bindHelper(true);
  }, events);

  function bindHelper(isOff = false) {
    events!.forEach((eventKey) => {
      document[isOff ? "removeEventListener" : "addEventListener"](
        eventKey,
        handle
      );
    });
  }

  return ref;
}
