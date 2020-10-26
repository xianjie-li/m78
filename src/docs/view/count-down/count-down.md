---
title: CountDown - 倒计时
group:
  title: 展示组件
  path: /view
  order: 4000
---

# CountDown 倒计时

对某个时间距离当前时间的详细时间进行展示

## 示例

<code src="./count-down-demo.tsx" />

## 自定义格式

<code src="./count-down-format.tsx" />

## props

```tsx | pure
interface CountDownProps extends ExtCls, ComponentBaseProps {
  /** 目标时间 */
  date?: string | Date;
  /** 替换默认的序列化方法，返回字符串会替换默认的时间字符，调用triggerFinish()可以清除倒计时计时器 */
  format?(meta: TimeMeta, triggerFinish: () => void): string;
  /** 每次时间字符改变时触发 */
  onChange?(meta: TimeMeta): void;
  /** 更新频率，默认1000ms */
  frequency?: number;
}
```

**相关接口**

```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}

interface ExtCls {
  /** 字符"xx天xx时xx分"中的xx所在包裹元素的额外类名 */
  textClassName?: string;
  /** 字符"xx天xx时xx分"中的天、时、分等描述文字的额外类名 */
  timeClassName?: string;
}
```
