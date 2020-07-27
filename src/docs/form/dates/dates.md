---
title: Dates - 时间
group:
  title: 数据录入
  path: /form
---

# Dates 时间
一个针对日期、时间进行展示或录入的控件，支持选择器、面板、日历等使用形式。

## 基本使用

不同的选择器类型

<code src="./demo.tsx" /> 

## 范围选择

<code src="./range.tsx" /> 

## 限制日期/时间

通过实现`DateLimiter`和`TimeLimiter`来进行日期和时间的限制，支持传递单个限制器或以数组形式传递多个

<code src="./disabled.tsx" />

## 组件模式

不使用选择器打开, 可以通过这个来进行自己的上层封装

<code src="./component.tsx" />

## 日历模式

暂时没有时间深入做这块，如果有使用场景后续会加上

<code src="./calendar.tsx" />

## API


### **`props`**

```tsx | pure
interface DatesBaseProps extends ComponentBaseProps {
  /** 'date' | 选择器类型 ('date' | 'month' | 'year' | 'time') */
  type?: DateType | DateTypeUnion;
  /** 限制可用日期 */
  disabledDate?: DateLimiter | Array<DateLimiter>;
  /** 'select' | 显示模式 组件、日历、选择器模式 */
  mode?: 'component' | 'calendar' | 'select';
  /** 未选中内容时的占位文本 */
  placeholder?: string;
  /** 格式化显示到占位框上的value，默认单选时为YYYY-MM-DD HH:mm:ss, 多选时为 YYYY-MM-DD HH:mm:ss ~ YYYY-MM-DD HH:mm:ss */
  format?(meta: {
    current?: Moment;
    end?: Moment;
    isRange: boolean;
    type: DateType | DateTypeUnion;
    hasTime: boolean;
  }): string;
  /** 禁用自带的时间预设，当你禁用了某些日期、时间段时，默认的预设可能会和被禁用的时间冲突，此时可以传入该选项来将其禁用 */
  disabledPreset?: boolean;
  /** 尺寸，只针对输入框 */
  size?: InputProps['size'];
  /** 禁用 */
  disabled?: boolean;

  /* ========== Time ========== */
  /** 日期选择时是否启用时间选择 */
  hasTime?: boolean;
  /**
   * 隐藏已被禁用的时间, 当包含很多禁用时间时，可通过此项来提高用户进行信息筛选的速度
   * 也可以通过此项实现时间步进选择(1点 3点 4点...)的效果 */
  hideDisabledTime?: boolean;
  /** 限制可用时间 */
  disabledTime?: TimeLimiter | Array<TimeLimiter>;
}

/** 常规选择，value为string */
export interface DatesProps extends DatesBaseProps {
  value?: string;

  onChange?: (value: string, mmt: Moment) => void;

  defaultValue?: string;
}

/** 范围选择，value为array, 分别表示[开始, 结束时间] */
export interface DatesRangeProps extends DatesBaseProps {
  value?: [string, string];

  onChange?: (values: [string, string], mmts: [Moment, Moment]) => void;

  defaultValue?: [string, string];
  /** 开启范围选择 */
  range?: boolean;
  /** '开始' | 自定义开始时间的文本 */
  startLabel?: string;
  /** '结束' | 自定义结束时间的文本 */
  endLabel?: string;
}
```

### **`限制器`**
```tsx | pure
/**
 * 禁用日期,返回true的日期项会被禁用
 * @param mmt - 当前项的时间
 * @param type- 当前项类型 当前类型(year | month | date)
 * @param extra - <DisabledExtras>
 * @return - 返回true时，该项被禁用
 * */
export interface DateLimiter {
  (mmt: Moment, type: Exclude<DateType, DateType.TIME>, extra: DisabledExtras): boolean | void;
}

/**
 * 接收当前时间元数据来决定禁用哪些时间
 * @param meta
 * @param meta.key - 当前项类型 'h' | 'm' | 's'
 * @param meta.val - 当前项的值
 * @param meta.h - 当前选中的时
 * @param meta.m - 当前选中的分
 * @param meta.s - 当前选中的秒
 * @param extra - <DisabledExtras>
 * @return - 返回true时，该项被禁用
 * */
export interface TimeLimiter {
  (meta: TimeValue & { key: keyof TimeValue; val: number }, extra: DisabledExtras): boolean | void;
}
```

### **`相关接口`**
```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}

/** 传递给disabledDate/disabledTime的额外参数 */
interface DisabledExtras {
  /** 当前时间 */
  checkedDate?: Moment;
  /** 如果为range选择且选择了结束时间，会以此项传入 */
  checkedEndDate?: Moment;
  /** 是否为范围选择 */
  isRange?: boolean;
}
```
