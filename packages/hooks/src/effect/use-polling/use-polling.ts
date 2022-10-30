/** 配置参数 */
import { useFn } from "../use-fn/use-fn";
import { useEffect, useMemo } from "react";
import { useSelf } from "../../state/use-self/use-self";

export interface UsePollingOption {
  /** 轮询触发时调用, 执行结束后才会开始下一次轮询计时 */
  trigger: () => Promise<any> | void;
  /** 触发的间隔时间(ms) */
  interval: number;
  /** 触发时间会根据比例逐步变长, 例如传1.1表示, 每次间隔会相比上次延长1.1倍 */
  growRatio?: number;
  /** 通常配合growsRatio使用, 设置最长的触发间隔(ms) */
  growMaxInterval?: number;
  /** 最大的轮询次数 */
  maxPollingNumber?: number;
  /** 初始化或enable变更为true时是否立即触发一次 */
  initTrigger?: boolean;
  /** true | 是否启用 */
  enable?: boolean;
}

/** 创建轮询任务 */
export function usePolling(option: UsePollingOption) {
  const { enable = true } = option;

  const self = useSelf({
    /** 内部的计时间隔, 由growRatio等配置动态调整 */
    internalInterval: option.interval,
    /** 计时器标识 */
    timer: null as any,
    /** 轮询次数, 以每次enable为true开始计数 */
    count: 0,
  });

  /** 放在useFn中, 保证每次调用trigger都是最新的 */
  const cb = useFn(async () => {
    self.count += 1;
    try {
      await option.trigger();
    } catch (e) {
      console.log(e);
    }
  });

  useMemo(() => {
    // 若变更则实时设置
    self.internalInterval = option.interval;
  }, [option.interval]);

  const polling = useFn(async (init?: boolean) => {
    if (option.maxPollingNumber && self.count >= option.maxPollingNumber) {
      return;
    }

    if (option.initTrigger && init) {
      await cb();
    }

    // 保留当次调用的配置快照, 防止变更
    const { growRatio, growMaxInterval } = option;

    self.timer = setTimeout(async () => {
      try {
        await cb();
      } finally {
        if (growRatio) {
          self.internalInterval *= growRatio;
          if (growMaxInterval) {
            self.internalInterval = Math.min(
              self.internalInterval,
              growMaxInterval
            );
          }
        }

        polling();
      }
    }, self.internalInterval);
  });

  useEffect(() => {
    if (enable) {
      polling(true);
    }

    return () => {
      clearTimeout(self.timer);
    };
  }, [enable]);

  return {
    /** 清理并重置当前的各种计数值, 然后重新开始轮询 */
    reset: () => {
      clearTimeout(self.timer);
      self.count = 0;
      self.internalInterval = option.interval;
      polling(true);
    },
  };
}
