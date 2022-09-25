---
title: useDelayToggle
group:
  path: /state
  order: 3
---

# useDelayToggle

获取一个延迟设置的 toggle 状态

如果你经常遇到一闪而过的 loading 等状态, 你可能会需要它, 当然, 它还有很多其他未发掘的作用

## 示例

<code src="./useDelayToggle.demo.tsx" />

## API

```ts
useDelayToggle(
  toggle: boolean,
  delay = 300,
  options?: {
    /** 禁用延迟功能 */
    disabled?: boolean;
    /** 当数组值改变时，更新state */
    deps?: any[];
    /** 开启延迟，默认为delay的值 */
    leadingDelay?: number;
    /** 离场延迟，默认为delay的值 */
    trailingDelay?: number;
    /** true | 启用入场延迟 */
    leading?: boolean;
    /** false | 启用离场延迟 */
    trailing?: boolean;
  }
): boolean
```
