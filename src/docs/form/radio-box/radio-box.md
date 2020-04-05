---
title: RadioBox - 单选
group:
  title: 数据录入
  path: /form
  order: 3000
---

# RadioBox 单选


## 示例

<code src="./demo.tsx" />

## props

**`Check`**

```tsx | pure
interface CheckProps extends ComponentBaseProps {
  /** 显示的样式 */
  type?: 'radio' | 'checkbox' | 'switch';
  /** 在视觉上设置为 `待定`，用于全选等操作满足部分条件的情况， 只限于type=checkbox,优选级小于checked */
  partial?: boolean;
  /** 禁用 */
  disabled?: boolean;
  /** 渲染时自动获取焦点 */
  autoFocus?: boolean;
  /** 表单值，在onChange时以第二个参数传入 */
  value?: string;
  /** 后置label文本 */
  label?: string;
  /** 前置label文本 */
  beforeLabel?: string;
  /** type=switch时生效，设置开启状态的handle文本, 一个汉字或4个字母以内 */
  switchOn?: string;
  /** type=switch时生效，设置关闭状态的handle文本, 一个汉字或4个字母以内 */
  switchOff?: string;
  /** 单行显示 */
  block?: boolean;
  /** 同原生组件的`name` */
  name?: string;
  /** customer */
  customer?: CheckCustom;
  /** 是否选中 */
  checked?: boolean;
  /** 非受控模式下使用 */
  defaultChecked?: boolean;
  /** checked触发改变的钩子，回传值为checked状态和value(未传入时为'') */
  onChange?: (checked: boolean, value: string) => void;
}
```

**`相关接口`**

```tsx | pure
interface ComponentBaseProps {
  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}

/**
 * 定制Check样式时会用到的接口
 * @param meta - 定制时会用到的一些组件内部状态
 * @param checkProps - Check组件接收到的prop
 * */
export interface CheckCustom {
  (meta: ShareMeta, checkProps: CheckProps): React.ReactElement;
}

interface ShareMeta {
  focus: boolean;
  checked: boolean;
  disabled: boolean;
}
```
