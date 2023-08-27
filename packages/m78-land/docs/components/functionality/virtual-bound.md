---
title: VirtualBound - 虚拟节点
---

在界面内创建虚拟节点, 并监听点击, 拖动, 鼠标悬浮等事件

## 使用

```tsx
import { VirtualBound } from "m78/virtual-bound";

// 创建实例
const virtualBound = new VirtualBound({
  el: this.config.el,
});

// 设置虚拟节点, 可以在任意位置重新设置
virtualBound.bounds = [];

// 绑定事件
virtualBound.click.on((e) => {
  console.log("click", e);
});

virtualBound.hover.on((e) => {
  console.log("hover", e);
});

virtualBound.drag.on((e) => {
  console.log("hover", e);
});

// 获取指定点上的虚拟节点
virtualBound.getBound([100, 100]);

// 指定点上是否有虚拟节点
virtualBound.hasBound();

// 使用完毕后注意销毁
virtualBound.destroy();
```

## API

### 配置

```ts
interface Config {
  /** 挂载事件的节点 */
  el: HTMLDivElement;
  /** 30 | hover延迟触发时间, 单位为ms */
  hoverDelay?: number;
  /** 触发hover前的校验, 返回true时停止事件触发, ev为原始事件对象 */
  hoverPreCheck?: (ev: Event) => boolean;
  /** 触发drag前的校验, 返回true时停止事件触发, ev为原始事件对象 */
  dragPreCheck?: (ev: Event) => boolean;
}
```

### 虚拟项

表示一个虚拟项

```ts
interface VirtualBoundItem extends BoundSize {
  /** 节点层级, 决定了事件覆盖 */
  zIndex: number;
  /** 根据此标识判断bound的类型 */
  type: any;
  /** 块的光标类型 */
  cursor?: string;
  /** 触发hover时的光标类型 */
  hoverCursor?: string;
  /** 通常是跟该bound关联的数据 */
  data?: any;
}

interface BoundSize {
  left: number;
  top: number;
  width: number;
  height: number;
}
```

### 实例

```ts
interface VirtualBound {
  /** 所有bound */
  bounds: VirtualBoundItem[];
  /** 拖动中 */
  dragging: boolean;

  /** 虚拟节点click事件 */
  click: CustomEvent<VirtualBoundClickListener>;
  /** 虚拟节点hover事件 */
  hover: CustomEvent<VirtualBoundHoverListener>;
  /** 虚拟节点drag事件 */
  drag: CustomEvent<VirtualBoundDragListener>;

  /** 销毁 */
  destroy(): void;

  /** 获取指定点的所有bound, 传入zIndexCheck可以在点上有多个bound时获取层级最高的那个 */
  getBound(xy: TupleNumber, zIndexCheck?: boolean): VirtualBoundItem[];

  /** 指定点是否包含bound */
  hasBound(xy: TupleNumber): boolean;
}
```

### 点击事件

```ts
interface VirtualBoundClickEvent {
  /** 当前bound */
  bound: VirtualBoundItem;
  /** 原始事件, 根据兼容性可能是pointer事件或mouse事件 */
  event: Event;
}
```

### 悬浮事件

```ts
interface VirtualBoundHoverEvent {
  /** 当前bound */
  bound: VirtualBoundItem;
  /** 原始事件, 根据兼容性可能是pointer事件或mouse事件 */
  event: Event;
}
```

### 拖拽事件

```ts
interface VirtualBoundDragEvent {
  /** 当前bound */
  bound: VirtualBoundItem;
  /** 相对上一次的移动距离 */
  delta: TupleNumber;
  /** 总的移动距离 */
  movement: TupleNumber;
  /** 指针位置 */
  xy: TupleNumber;
  /** 是否首次触发 */
  first: boolean;
  /** 是否最后一次触发 */
  last: boolean;
  /** 原始事件, 根据兼容性可能是pointer事件或mouse/touch事件 */
  event: Event;
}
```
