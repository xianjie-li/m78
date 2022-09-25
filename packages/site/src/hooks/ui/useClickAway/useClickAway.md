---
title: useClickAway
group:
  path: /ui
---

# useClickAway

点击指定的节点外的任何区域时回调通知

## 示例

<code src="./useClickAway.demo.tsx" />

## API 

```tsx | pure
function useClickAway(config: UseClickAwayConfig): React.MutableRefObject;

interface UseClickAwayConfig {
  /** 触发回调, e取决于events配置, 用户可根据events自行进行类型断言 */
  onTrigger: (e: Event) => void;
  /** 监听目标, 可以是单个或多个DOM/包含DOM的react ref */
  target?: DomTarget | DomTarget[];
  /** ['mousedown', 'touchstart'] | 要触发的事件 */
  events?: string[];
}
```
