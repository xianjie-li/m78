import { useEffect, useState } from "react";
import { useSelf } from "../../";

/** 代理一个toggle状态, 确保其在关闭前至少开启了duration毫秒, 用于解决loading等组件的闪烁问题 */
export function useDelayToggle(toggle: boolean, duration = 300): boolean {
  const isDisabled = !duration;

  const [innerState, setInnerState] = useState(toggle);

  const self = useSelf({
    timer: null as any,
    openTime: toggle ? Date.now() : null,
  });

  useEffect(() => {
    if (isDisabled) return;

    if (toggle) {
      change();
      return;
    }

    let surplus = self.openTime ? Date.now() - self.openTime : 0;
    surplus = duration - surplus;

    if (surplus <= 0) {
      change();
      return;
    }

    self.timer = setTimeout(change, surplus);

    return () => {
      self.timer && clearTimeout(self.timer);
    };
  }, [toggle]);

  function change() {
    if (toggle !== innerState) setInnerState(toggle);
  }

  return isDisabled ? toggle : innerState;
}
