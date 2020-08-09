---
title: Auth - 权限
group:
  title: 工具
  path: /utils
  order: 5000
---

# Auth 权限

一个纯前端的小型权限验证器, 用于便捷、统一的通过权限来控制视图显示。

## 使用

<code src="./demo.tsx" />

## 额外参数

<code src="./extra.tsx" />

## 定制反馈内容

<code src="./custom.tsx" />

## 异步验证器

<code src="./asyncValid.tsx" />

## withAuth

某些场景下会需要为整个组件设置权限，此时可以使用`withAuth`

- 一个常见的用例是需要为页面级路由组件设置权限时

<code src="./withAuth.tsx" />

## API

**`props`**

```ts | pure
interface AuthProps<D, V> {
  /**
   * 权限验证通过后显示的内容
   * * 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactNode | any;
  /**
   * 待验证的权限key组成的数组
   * * 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
   * * 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合后，两者的任一个满足条件则验证通过 */
  keys: AuthKeys<V>;
  /** 'feedback' | 反馈方式，占位节点、隐藏、气泡提示框, 当type为popper时，会自动拦截子元素的onClick事件 */
  type?: 'feedback' | 'hidden' | 'popper';
  /** 传递给验证器的额外参数 */
  extra?: any;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈信息
   * */
  feedback?: (rejectMeta: ValidMeta, props: AuthProps<D, V>) => React.ReactNode;
  /** 验证处于未完成状态时显示的节点, type 为 hidden 时无效 */
  pendingNode?: React.ReactNode;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: Validators<D>;
  /** 自定义显示的403 icon */
  icon?: React.ReactNode;
}
```
