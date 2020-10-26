---
title: Check - 选择框
group:
  title: 数据录入
  path: /form
  order: 3000
---

# Check 选择框

`Check`是作为`Radio`和`CheckBox`的底层组件存在的，通常情况下，你不会直接使用它，而是使用基于其实现的上层组件。

尽管如此，每一个`Check`也都可以作为独立的`Switch`组件(value 为 boolean 值的输入组件)来使用

你还可以通过提供的 API 来定制自己的`Switch`、`Radio`、或者是`CheckBox`组件

## 示例

<code src="./demo.tsx" />

## 样式定制

`Check`组件是高度可定制的，实际上，内置的`'radio' | 'checkbox' | 'switch'`等样式也是通过定制 API 来实现的。

<code src="./custom.tsx" />

组件 css

```scss
.MyCustomCheck {
  display: inline-block;
  border: 1px solid #ccc;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;

  &.__checked {
    border-color: #13c2c2;
    background-color: #13c2c2;
    color: #fff;
  }

  &.__disabled {
    border-color: #eee;
    color: rgba(0, 0, 0, 0.35);
  }

  &.__focus {
    box-shadow: 0 0 0 2px blue;
  }
}
```

❤ 需要注意的一点是，上例中的`myCheck`函数是`CheckCustom`接口的实现，而不是`React`组件

## 使用`useCheck`

通过`useCheck`钩子来便捷的实现选中状态管理

<code src="./useCheckDemo.tsx" />

关于 useCheck 的更多用例，请查看`useCheck` // TODO: 添加链接

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
