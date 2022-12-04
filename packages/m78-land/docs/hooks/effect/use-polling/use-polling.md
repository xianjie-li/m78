---
title: usePolling
---

# usePolling

创建轮询任务

## 示例

每 0.5s 触发一次, 每次触发间隔比上次多 1.1 倍, 最多触发 10 次

<demo demo={require("./use-polling.demo.tsx")} code={require("!!raw-loader!./use-polling.demo.tsx")}></demo>

## API

```ts
// reset用于清理并重置当前的各种计数值, 然后重新开始轮询
usePolling(option: UsePollingOption): { reset: () => void };
```

```ts
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
```
