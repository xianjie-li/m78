---
title: Tips - 轻提示
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Tips 轻提示

用于发出轻量的提示消息

与[Message](/docs/feedback/message)的区别是:

- 可用于局部提示，Message偏向于全局提示, 此特性可用于为某些组件创建内部提示(如Scroller组件)
- 同样维护一个队列，但是不会同时出现多条，而是根据持续时间逐条显示

## 示例

<code src="./demo.tsx" />

## API

**`<Tips />`**

```tsx | pure
interface TipsProps {
  controller: ReturnType<typeof Tips.useTipsController>;
}
```

**`Tips.useTipsController`**

```tsx | pure
const tipsController = Tips.useTipsController(config);
```

**`config`**

```tsx | pure
interface UseQueueConfig<ItemOption> {
    /** 初始列表 */
    list?: TipsItem[];
    /** 默认项配置 */
    defaultItemOption?: Partial<TipsItem>;
}
```

**`tipsController`**

```tsx | pure
interface TipsController {
  /**
   * 推入一个新项，如果当前没有选中项，自动执行next()
   * @param opt - 要添加的新项，可以是一个单独的项配置或配置数组
   * */
  push(item | item[]),
  /** 显示上一项 */
  prev(),
  /**
   * 关闭当前项, 然后选中列表下一项
   * 如果配置了duration, 设置倒计时，计时结束后拉取下一项进行显示, 直到队列为空
   * */
  next(),
  /** 是否有下一项, 不传id查当前项 */
  hasNext(id),
  /** 是否有上一项, 不传id查当前项 */
  hasPrev(id),
  /** 清空队列 */
  clear,
  /** 根据id查询索引 */
  findIndexById(id),
  /** 是否处于暂停状态 */
  isPause: state.isPause,
  /** 当前项 */
  current: state.current,
  /** 暂停时，重新启用 */
  start(),
  /** 暂停，停止所有计时，依然可以通过push/next/prev等切换项，如果要禁止切换，使用isPause帮助判断 */
  pause(),
  /** 当前所有项(不要手动操作) */
  list,
  /** 当前项所在索引 */
  index,
}
```


**`消息配置项`**

```tsx | pure
interface UseQueueItem {
    /** 如果传入，会在指定延迟ms后自动跳转到下一条 */
    duration?: number;
}

interface TipsItem extends UseQueueItem {
  /** 消息内容 */
  message?: React.ReactNode;
  /** 显示关闭按钮, 如果有下一条消息，显示文本为`下一条` */
  nextable?: boolean;
  /** 是否可切换上一条 */
  prevable?: boolean;
  /** 'card' | 显示类型, 默认显示为状态栏样式 */
  type?: 'card' | 'bar';
  /** 最小宽度且文本不换行，默认是根据容器宽度拉伸。建议在`card`类型下使用 */
  fitWidth?: boolean;
  /** 宽度 */
  width?: string | number;
  /** 一组操作 */
  actions?: {
    /** 文本 */
    text: React.ReactNode;
    /** 颜色 */
    color?: ButtonProps['color'];
    /** 点击处理函数 */
    handler?: AnyFunction;
  }[];
  /** 操作区域内容, 覆盖actions */
  actionsNode?: React.ReactNode;
  /** 是否用于全局显示(挂载到根节点)，定位方式会稍有不同 */
  global?: boolean;
}
```
