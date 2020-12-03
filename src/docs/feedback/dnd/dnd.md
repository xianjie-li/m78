---
title: DND - 拖放
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# DND 拖放

一个 Drag/Drop 库

与其他 DND 库的区别是:

- 支持基于元素位置的拖动, 放置时，可以识别放置的具体位置如上、右、下、左、中, 以此实现更为精细的拖放控制
- 无入侵, 你可以在不更改现有 dom 结构的前提下增加拖动行为
- 启发式的拖动组件，与传统的 DND 库(Draggable/Droppable)有所不同，此库通过一个单一的`<DND />`组件来完成拖动/放置操作，因为很多时候元素可能即是拖动目标、也是放置目标
- 同时支持移动、pc

## 基本演示

一个基础的多方向拖动示例:

1. 通过`DNDContext`将`DND`组件分组(可选但推荐，无分组的`DND`状态会管理在一组默认状态中, 通常`DND`不需要接收事件，而是直接使用`DNDContext`来进行事件管理)
2. 设置`DND`组件，通过 innerRef 来绑定拖放节点、enableDrop 选择要启用的反向
3. 根据 render children 接收的状态来调整盒子拖放元素状态、内容、绑定拖放节点节点
4. 作为拖动目标时，`DND`会触发拖动目标相关的事件，作为放置目标时，`DND`会触发放置目标相关的事件, 通常，事件都由`DNDContext`管理，除非需要在局部根据事件响应某些状态

<code src="./base-demo.tsx" />

## 状态/内置样式

在某个`DND`拖动时，其他`DND`会响应拖动并实时更新自身的状态，这个状态在`render children`中接收，可用于为用户提供视觉反馈

为了方便，组件内置了一组样式，通过如下方式使用：

<code src="./status-demo.tsx" />

## 自动滚动/嵌套

当拖动元素靠近或超过一个滚动容器边缘时，会自动朝对应方向滚动，超出边界的距离越大滚动越快

<code src="./board-demo.tsx" />

## 方向

<code src="./grid-demo.tsx" />

## 添加动画

通过`react-spring`为上面的网格示例添加简单的动画，如果有复杂的拖动动画需求，请使用[react-beautiful-dnd](https://github.com/atlassian/react-beautiful-dnd)

<code src="./grid-anim-demo.tsx" />

## 禁用

设置`enableDrop`和`enableDrag`来控制是否可拖放

- 为 boolean 时，表示为普通拖放节点，不包含特定方向信息
- 为对象时，可以特殊指定每一个位置的启用信息
- 为函数时，会接收当前的拖动信息、当前节点信息等，并返回描述禁用信息的上述值

<code src="./enable-demo.tsx" />

## 过滤

当元素满足`INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO`规则或 contentedit 为 true 时，会禁止其进行拖动

可以通过`ignoreElFilter`选项来增加过滤列表

<code src="./filter-demo.tsx" />

## 自定义拖动把手

<code src="./handle-demo.tsx" />

## 自定义拖拽反馈

可以简单添加样式，或直接替换节点

<code src="./drag-node-demo.tsx" />

## 持久化变更

在拖动完成后，通常会需要将变更更新到数据库或本地存储中，对此通常会有两种选择:

- 每次 onAccept 通知变更后都同步变更到存储中
- 添加一个提交按钮，点击时才同步变更

## API

**`<DND />`**

```tsx | pure
interface DNDProps<Data = any, TData = Data> {
  /* ####### 常用 ####### */
  /** 绑定到该拖动/放置目标的数据，会在目标拖动、放置等操作中传递，通常是能表示该DND实例的唯一值(索引、id、描述对象等) */
  data: Data;
  /**
   * 用于绑定拖动元素的render children, 接收:
   * - 拖放元素、拖动把手的ref(默认为拖放元素)
   * - 拖动中、当前拖动位置、是否正被拖动元素覆盖等
   * - 某个方向上的启用信息等
   * */
  children: (bonus: DragBonus) => React.ReactElement;
  /** 是否可拖动，可以是返回此状态的函数, 接收当前节点 */
  enableDrag?: boolean | ((node: DNDNode<Data>) => boolean);
  /** 是否可放置，可以是返回此状态的函数, 接收当前的拖动和放置目标 */
  enableDrop?:
    | MixAllowDrop
    | ((node: DNDNode<Data>, dragNode?: DNDNode<Data>, dropNode?: DNDNode<TData>) => MixAllowDrop);

  /* ####### 作为放置目标的事件 ####### */
  /** 拖动目标进入时 */
  onSourceEnter?: (event: DragFullEvent<Data, TData>) => void;
  /** 拖动目标离开时 */
  onSourceLeave?: (event: DragPartialEvent<Data, TData>) => void;
  /** 拖动目标在上方移动时 */
  onSourceMove?: (event: DragFullEvent<Data, TData>) => void;
  /** 成功接收到一个拖动目标时 */
  onSourceAccept?: (event: DragFullEvent<Data, TData>) => void;

  /* ####### 作为拖动目标的事件 ####### */
  /** 开始拖动的第一帧触发 */
  onDrag?: (event: DragPartialEvent<Data, TData>) => void;
  /** 开始拖动并移动, 如果在放置目标上拖动，事件对象会包含target */
  onMove?: (event: DragPartialEvent<Data, TData>) => void;
  /** 已经开始拖动并放开目标, 如果在放置目标上放开，事件对象会包含target */
  onDrop?: (event: DragPartialEvent<Data, TData>) => void;

  /** 标识当前拖动元素的唯一id, 不传时组件内部会随机指定一个, 通常会在debug的时候使用 */
  id?: string;
  /** 拖动时显示在指针下方的元素 */
  dragFeedback?: React.ReactNode;
  /** 拖动反馈节点的基础样式 */
  dragFeedbackStyle?: React.CSSProperties;
  /**
   * 额外添加要禁止拖动的元素, 返回true表示禁止拖动
   * 默认情况下，会禁止 tagName为INPUT|TEXTAREA|BUTTON|SELECT|AUDIO|VIDEO的元素或设置了contenteditable的元素
   * */
  ignoreElFilter?: (el: HTMLElement) => boolean;
}
```

**`<DNDContext />`**

```tsx | pure
interface DNDContextProps {
  /** 拖动开始 */
  onStart?: (event: DragPartialEvent) => void;
  /** 拖动过程中持续触发 */
  onMove?: (event: DragPartialEvent) => void;
  /** 成功拖动到目标后触发 */
  onAccept?: (event: DragFullEvent) => void;
}
```

**`DragBonus/DragStatus/DNDNode`**

```tsx | pure
/** DND组件的render children接收对象 */
interface DragBonus {
  /** 传递给拖动目标的ref */
  innerRef: React.MutableRefObject<any>;
  /** 传递给拖动把手的ref, 未在此项上获取到节点时，会以innerRef作为拖动节点 */
  handleRef: React.MutableRefObject<any>;
  /** 拖动状态 */
  status: DragStatus;
  /** 允许放置的信息 */
  enables: EnableInfos;
}

/** 表示一个DND实例作为拖动目标、防止目标时的相关状态 */
interface DragStatus {
  /* ####### 作为拖动元素时 ####### */
  /** 是否正在拖动 */
  dragging: boolean;
  /* ####### 作为放置目标时 ####### */
  /** 左侧有可用拖动目标 */
  dragLeft: boolean;
  /** 右侧有可用拖动目标 */
  dragRight: boolean;
  /** 下方有可用拖动目标 */
  dragBottom: boolean;
  /** 上方有可用拖动目标 */
  dragTop: boolean;
  /** 中间部分有可用拖动目标, 一般用于合并项 */
  dragCenter: boolean;
  /** 未指定其他特定的方向时，当拖动元素位于上方时此项为true */
  dragOver: boolean;
  /** 未处于拖动或放置状态 */
  regular: boolean;
}

/** 表示一个唯一的DND节点 */
export interface DNDNode<Data = any> {
  /** 该项的id */
  id: string;
  /** 该项的data */
  data: Data;
}
```
