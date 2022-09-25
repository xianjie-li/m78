---
title: useVirtualList
group:
  path: /ui
---

# useVirtualList

强大的虚拟列表 hook

- 由于无 UI 的特点，可以非常简单的与现有组件集成
- 适用于表格等特殊 html 结构
- 非 absolute 方式实现, 不会对动画、表格等特定场景等造成破坏

## 示例

最简单的使用方式，绑定`containerRef`和`wrapRef`并正确设置容器高度

<code src="./useVirtualList.demo.tsx" />

> 可以为`containerRef`设置`maxHeight`，并明确为 useHook 传入 height 来实现最大高度效果

## 动态高度

动态获取项高度(处于性能考虑，尺寸只在 list 变更时统一获取一次)

<code src="./useVirtualList.dynamic.demo.tsx" />

## 滚动占位节点

使用滚动占位节点来延迟加载列表项，建议在列表项渲染非常耗费性能时使用

<code src="./useVirtualList.scrolling.demo.tsx" />

## keepAlive

在某些场景下，我们不希望某个列表项在滚动出视口时被卸载(实现拖动排序等功能时), 可以通过配置 keepAlive 来防止列表项卸载

> 大部分场景下，保证列表项是无状态组件，将状态保存到父组件会更好

第 2、6、299999 项不会被卸载

<code src="./useVirtualList.keepAlive.demo.tsx" />

## 动画

仅作为动画实现可能的演示

<code src="./useVirtualList.anime.demo.tsx" />

## 放置额外节点

当需要在列表上下方放置额外节点时使用

<code src="./useVirtualList.plh.demo.tsx" />

## API

**useVirtualList()**

```tsx | pure
function useVirtualList<Item = any>(option: UseVirtualListOption<Item>) {
  return {
    // 用来绑定滚动容器的ref
    containerRef,
    // 用来绑定元素容器的ref
    wrapRef,
    // 用来渲染虚拟列表的组件(使用单独的组件渲染是为了减少hooks上下文在滚动时无谓的更新)
    Render,
  };
}
```

**Option**

```ts
interface UseVirtualListOption<Item> {
  /** 需要进行虚拟滚动的列表 */
  list: Item[];
  /** 每项的尺寸 */
  size: number | ((item: Item, index: number) => number);
  /** 1 | 滚动区域两侧预渲染的节点数 */
  overscan?: number;
  /**
   * 项的唯一key, 建议始终明确的指定key, 除非:
   * - 列表永远不会排序或更改
   * - 不需要使用keepAlive等高级特性
   * */
  key?: (item: Item, index: number) => string;

  /** 返回true的项将始终被渲染 */
  keepAlive?: (item: Item, index: number) => boolean;
  /** 一个可选配置，默认情况下，高度从containerTarget获取，如果containerTarget没有实际高度或需要实现"最大高度"效果时，使用此配置 */
  height?: number;
  /** 是否禁用, 禁用时list为[]且不监听任何事件 */
  disabled?: boolean;
  /** 预留空间, 需要插入其他节点到列表上/下方时传入此项，值为插入内容的总高度 */
  space?: number;
  /** 当有一个已存在的ref或html时，用来代替returns.containerRef获取滚动容器 */
  containerTarget?: HTMLElement | RefObject<HTMLElement>;
  /** 当有一个已存在的ref或html时，用来代替用来代替returns.wrapRef获取包裹容器 */
  wrapRef?: HTMLElement | RefObject<HTMLElement>;
}
```

**VirtualList**

```ts
type VirtualList<Item> = {
  /** 该项索引 */
  index: number;
  /** 该项的key, 如果未配置key(), 则等于index */
  key: string;
  /** 该项的数据 */
  data: Item;
  /** 应该应位于的位置 */
  position: number;
  /** 改项的尺寸 */
  size: number;
}[];
```
