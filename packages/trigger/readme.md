事件触发器, 整合了 click/active/focus/contextMenu/move/drag 等常用事件, 处理了这些事件在触控和光标设备上的兼容性, 并提供了更易于使用的事件对象模型.

此外, 该库还单独提供了用于scroll和keyboard事件的工具.

<br>

# 安装

```shell
npm install @m78/trigger
```

<br>


# Trigger


## 使用

绑定到一个dom节点

```ts
import { trigger, TriggerOption, TriggerType } from '@m78/trigger';

const eventOption: TriggerOption = {
  target: document.getElementById('target'),
  type: [TriggerType.click, TriggerType.active],
  handler: (e) => {
    console.log(e.type, e.active);
  },
}

trigger.on(eventOption);  // 绑定事件

trigger.off(eventOption); // 解绑事件
```

<br/>

绑定到一个虚拟位置

```ts
import { trigger, TriggerOption, TriggerType } from '@m78/trigger';

// 创建一个事件配置对象
const eventOption: TriggerOption = {
  target: {
    left: 200,
    top: 200,
    height: 50,
    width: 50,
  },
  type: [TriggerType.click, TriggerType.active],
  handler: (e) => {
    console.log(e.type, e.active);
  },
}

trigger.on(eventOption);  // 绑定事件

eventOption.target.left = 100;	// 可以随时更新option

trigger.off(eventOption); // 解绑事件
```

<br/>

## 在react中使用

通过组件

```tsx
import { TriggerOption, TriggerType } from '@m78/trigger';
import { Trigger } from '@m78/trigger/react/.js';

<Trigger
  type={[TriggerType.click, TriggerType.active]}
  onTrigger={e => {
    console.log(e.type, e.active);
  }}
>
  <button>click or active</button>
</Trigger>
```

<br/>通过hook

```tsx
import { TriggerOption, TriggerType } from '@m78/trigger';
import { useTrigger } from '@m78/trigger/react.js';

function MyComponent() {
  const { node } = useTrigger({
    type: [TriggerType.click, TriggerType.active],
    onTrigger: e => {
      console.log(e.type, e.active);
    }
  });

  return node; // 可在任意位置挂载的ReactNode
}
```

<br/>

## TriggerOption & OptionItem

```ts
/**
 * 事件项的配置对象, 此对象属性均是可变的, 如果你修改了对象内容, 则后续事件中会使用修改后的内容
 * */
export interface TriggerOption {
  /** 事件的触发目标, dom节点或一个虚拟的位置 */
  target: HTMLElement | BoundSize;
  /** 需要绑定的事件类型 */
  type: TriggerType | TriggerType[];
  /** 事件处理程序 */
  handler: TriggerListener;
  /** 控制事件是否启用, 由于会频繁调用, 不应包含复杂逻辑 */
  enable?: boolean | ((data: TriggerTargetData) => boolean);
  /** 控制在特定事件下的光标类型 */
  cursor?: TriggerCursorMap;
  /** 可在此存放一些自定义信息, 并在Event中访问 */
  data?: any;

  // # drag相关
  /**
   * 限制拖动边界, 此配置影响事件对象上的 movement, distance
   *
   * > note: 依赖于target的当前位置, 必须在事件回调中正确的更新了target的位置(无论是dom节点还是虚拟位置), 才能此配置生效
   *  */
  dragBound?: BoundSize;

  // # 主要针对虚拟target的配置
  /** 0 | 事件级别, 较大的目标会覆盖较小目标的事件, 若最大级别下包含多个target, 则这些target会根据覆盖规则触发事件 */
  level?: number;
  /** parallel | 同一level下有多个相同类型的事件触发时, 配置事件的覆盖策略 */
  overrideStrategy?: TriggerOverrideStrategy;
}
```

<br/>

## TriggerType

```ts
/** 支持的事件类型 */
export enum TriggerType {
  /** 点击 */
  click = "click",
  /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备, 在鼠标移动到上方时触发
   * - 支持touch的设备, 短暂按住后触发, 与contextMenu在触控设备下触发方式相同, 区别是active会在松开手指后关闭
   * */
  active = "active",
  /** 获取焦点和失去焦点, 仅dom类型的target有效 */
  focus = "focus",
  /**
   * 根据不同的事件源, 触发方式不同:
   * - 支持光标的设备表现为右键点击
   * - 支持touch的设备, 短暂按住后触发, 与active在触控设备下触发方式相同, 区别是active会在松开手指后关闭
   * */
  contextMenu = "contextMenu",
  /** 光标或触摸点在目标上方移动 */
  move = "move",
  /** 对目标进行拖动 */
  drag = "drag",
}

export type TriggerTypeKeys = keyof typeof TriggerType;

export type TriggerTypeUnion = TriggerTypeKeys | TriggerType;
```

<br/>

## TriggerInstance

```ts
export interface TriggerInstance {
  /** 启用或禁用所有事件 */
  enable: boolean;

  /** 是否正在拖拽中 */
  dragging: boolean;

  /** 当前是否有active状态节点 */
  activating: boolean;

  /** 当前是否有move状态节点 */
  moving: boolean;

  /** 是否有持续性事件正在运行, 即 dragging / activating / moving 任意一项为true */
  running: boolean;

  /** 是否有持续性事件正在运行, 即 dragging / activating / moving 任意一项为true */
  running: boolean;

  /**
   * 新增单个或多个事件配置, 可传入一个唯一的key将配置分组, 并在后续通过相同的key可以通过批量移除事件或是获取指定分组的事件信息
   *
   * - 事件对象的引用是事件本身的标识, 在进行移除事件等操作时, 皆以应用为准
   * - 每个配置对象在移除前只能通过on添加一次, 重复添加会导致预期外的行为
   *  */
  on(opt: TriggerOption | TriggerOption[], key?: string): void;

  /** 根据key或事件选项移除事件配置, 若事件通过key添加, 则只能通过key移除 */
  off(opt: TriggerOption | TriggerOption[]): void;
  /** 通过绑定事件时的key批量移除 */
  off(key: string): void;

  /** 清空事件配置 */
  clear(): void;

  /** 事件配置总数 */
  size(): number;

  /** 获取可用事件目标的数据 */
  getTargetByXY(args: {
    /** 指定要获取事件的点 */
    xy?: TupleNumber;
    /** 指定触发事件的dom节点, 若同时传入xy, 会先通过xy过滤, 再通过dom检测节点, 能够提升一定的性能 */
    dom?: HTMLElement;
    /** 指定事件类型, 非对应类型的事件被过滤 */
    type?: TriggerType | TriggerType[];
    /** 分组key, 传入时, 只获取该分组的事件 */
    key?: string;
    /** 可在确认事件列表前对其进行再次过滤, 使用此参数而不是直接获取返回结果过滤是因为, 其在 overrideStrategy / level 等配置处理前执行, 通过filter能够使这些配置能正常作用 */
    filter?: (data: TriggerTargetData) => boolean;
  }): TriggerTargetData[];
}
```

<br/>

## TriggerEvent

```ts
/** 事件对象, 特定属性仅在其指定的事件类型中生效, 其他时候会是它们的初始值 */
export interface TriggerEvent {
  /** 事件类型 */
  type: TriggerType;
  /** 原生事件对象 */
  nativeEvent: Event;
  /** 是否是事件开始 */
  first: boolean;
  /** 是否是事件结束 */
  last: boolean;
  /** 事件对应的配置对象 */
  target: TriggerOption;
  /** 事件对象中配置的TriggerOption.data */
  data: any;
  /** 根据事件信息产生的额外信息 */
  eventMeta: TriggerTargetData;

  /* # # # # # # # 通用, 坐标在某些事件下始终为0 # # # # # # # */

  /** 触发位置相对屏幕的x坐标 */
  x: number;
  /** 触发位置相对屏幕的y坐标 */
  y: number;
  /** 触发位置相对目标左上角的x坐标 */
  offsetX: number;
  /** 触发位置相对目标左上角的y坐标 */
  offsetY: number;

  /* # # # # # # # active # # # # # # # */

  /** 是否处于active状态 */
  active: boolean;

  /* # # # # # # # focus # # # # # # # */

  /** 是否处于focus状态 */
  focus: boolean;
  /** 用于检测focus是否是由直接点击触发 */
  isTapFocus: boolean;

  /* # # # # # # # drag # # # # # # # */

  /** 该次拖动期间移动的总距离 */
  movementX: number;

  /** 该次拖动期间移动的总距离 */
  movementY: number;

  /** 相对上一次触发移动的距离 */
  deltaX: number;

  /** 相对上一次触发移动的距离 */
  deltaY: number;


  [key: string]: any;
}
```

<br/>

## TriggerTargetData

```ts
/** TriggerOption的包装类型, 包含了一些额外信息 */
export interface TriggerTargetData {
  /** 为true表示该项target是一个虚拟事件目标, 为false时为真实的dom节点 */
  isVirtual: boolean;
  /** 该项的位置 */
  bound: BoundSize;
  /** 事件目标dom, 需断言isVirtual为false时可用 */
  dom: HTMLElement;
  /** 用来便捷的检测指定类型事件是否启用 */
  typeMap: Map<TriggerType, boolean>;
  /** 与默认cursor配置合并后的配置对象 */
  cursor: Required<TriggerCursorMap>;
  /** 原始事件对象, 引用与原始对象一致 */
  option: TriggerOption;
}
```

<br/>

## TriggerListener

```ts
export type TriggerListener = (e: TriggerEvent) => void;
```

<br/>

## TriggerCursorMap

```ts
/**
 * 用于配置在特定事件下的光标显示类型
 *
 * 光标样式挂载在html节点, 若事件节点包含自定义或预设光标样式, 需为其设置css: cursor: "inherit", 防止干扰
 *  */
export interface TriggerCursorMap {
  /** active触发时 */
  active?: string;
  /**
   * 可拖动节点的active状态, 优先级高于 active
   *
   * 注: 启用active事件后生效
   *  */
  dragActive?: string;
  /** 拖动过程中 */
  drag?: string;
}
```

<br/>

## TriggerOverrideStrategy

```ts
/** 存在冲突事件时, 配置事件的覆盖策略, 主要针对虚拟位置事件 */
export enum TriggerOverrideStrategy {
  /** 持久事件的独占权, 若存在多个possess事件, 取最后注册的 */
  possess,
  /** 跳过当前事件, 转移执行权 */
  transfer,
  /** 允许和其他非possess事件并行执行 */
  parallel,
}
```

<br>

<br>

# scroll

scrollTrigger 对滚动事件相关的内容进行了封装, 是你能更容易的使用它们并找到更易于使用的状态

## 使用

```tsx

// 通过 createScrollTrigger 自行创建实例, 或是通过下面的 useScroll 在 react 中使用
import { createScrollTrigger } from "@m78/trigger/scroll.js";	
import { useScroll } from "@m78/trigger/react/use-scroll.js";

// 以下代码需要在一个react组件内使用
// useScroll 接收 UseScrollTriggerOption 作为参数, 而 createScrollTrigger 接收 ScrollTriggerOption 作为参数, 它们有细微的差异
const instance = useScroll<HTMLDivElement>({
  onScroll(e) {
    console.log(e);
  },
});

// 滚动至少需要一个 overflow 设置为可滚动的容器, 并且其内容超出其尺寸
<div
  style={{
    height: 300,
    width: 300,
    border: "1px solid red",
    overflow: "auto",
  }}
  ref={instance.ref}
>
  {Array.from({ length: 500 }).map((_, ind) => (
    <p key={ind} className={`P_${ind}`}>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque,
      aperiam officia. Alias earum voluptate non nihil accusantium animi
      soluta eligendi natus sint voluptas voluptatum illo, eos nam dolorem
      iure corrupti.
    </p>
  ))}
</div>
```



## ScrollTriggerOption

```ts
/** 创建配置 */
export interface ScrollTriggerOption {
  /** 要监听的滚动目标, 默认的滚动元素是documentElement */
  target?: HTMLElement;
  /** 滚动时触发 */
  handle: (event: ScrollTriggerState) => void;
  /** 设置handle的throttle间隔, 单位(ms) */
  throttleTime?: number;
  /** 使用scrollToElement api定位时的偏移值, 传入单个值时应用于两个方向, 两个值时分别表示 x, y */
  offset?: number | TupleNumber;
  /** touch系列属性的触发修正值 */
  touchOffset?: number | TupleNumber;
}
```



## ScrollTriggerArg

```ts
/** 调整滚动位置时的配置对象 */
export interface ScrollTriggerArg {
  /** 指定滚动的x轴 */
  x?: number;
  /** 指定滚动的y轴 */
  y?: number;
  /** 以当前滚动位置为基础进行增减滚动 */
  raise?: boolean;
  /** 为true时阻止动画 */
  immediate?: boolean;
}
```



## ScrollTriggerState

```ts
/** 事件对象 */
export interface ScrollTriggerState {
  /** 滚动元素 */
  target: HTMLElement;
  /** x轴位置 */
  x: number;
  /** y轴位置 */
  y: number;
  /** 可接受的x轴滚动最大值(值大于0说明可滚动， 但不能保证开启了滚动) */
  xMax: number;
  /** 可接受的y轴滚动最大值(值大于0说明可滚动， 但不能保证开启了滚动) */
  yMax: number;
  /** 元素高度 */
  height: number;
  /** 元素宽度 */
  width: number;
  /** 元素实际高度(包含边框/滚动条/内边距等) */
  offsetWidth: number;
  /** 元素实际宽度(包含边框/滚动条/内边距等) */
  offsetHeight: number;
  /** 元素总高度 */
  scrollHeight: number;
  /** 元素总宽度 */
  scrollWidth: number;
  /** 滚动条位于最底部 */
  touchBottom: boolean;
  /** 滚动条位于最右侧 */
  touchRight: boolean;
  /** 滚动条位于最顶部 */
  touchTop: boolean;
  /** 滚动条位于最左侧 */
  touchLeft: boolean;
  /** 是否是x轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过api控制滚动时 */
  isScrollX: boolean;
  /** 是否是y轴滚动, 通过判断上一个滚动值来获取, 某些场景可能不准确, 比如通过api控制滚动时 */
  isScrollY: boolean;
}
```



## ScrollTriggerInstance

```ts
/** 滚动实例 */
export interface ScrollTriggerInstance {
  /** 设置滚动位置 */
  scroll: (arg: ScrollTriggerArg) => void;
  /** 滚动到指定的元素, 可传入一个dom节点或一个选择器, 设置 immediate 为 true 可跳过动画 */
  scrollToElement: (arg: string | HTMLElement, immediate?: boolean) => void;
  /** 获取和当前滚动状态有关的信息, 与handle中传入的事件对象一致 */
  get: () => ScrollTriggerState;
  /** 销毁实例 */
  destroy(): void;
}
```



## UseScrollTriggerOption

```ts
/** 用于use-scroll的创建配置 */
export interface UseScrollTriggerOption
  extends Omit<ScrollTriggerOption, "target" | "handle"> {
  /** 传入要绑定的滚动元素或ref, 也可以通过useScroll返回的instance.ref绑定到dom */
  el?: HTMLElement | RefObject<any>;
  /** 滚动时触发 */
  onScroll?(meta: ScrollTriggerState): void;
}
```



## UseScrollTriggerInstance

```ts
/** use-scroll扩展后的ScrollTrigger实例 */
export interface UseScrollTriggerInstance<ElType extends HTMLElement>
  extends ScrollTriggerInstance {
  /** 可使用此项代替option.el进行绑定 */
  ref: RefObject<ElType>;
}
```

