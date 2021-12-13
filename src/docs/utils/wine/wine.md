---
title: Wine - 任务窗口
group:
  title: 工具包
  path: /utils
  order: 5000
---

# Wine 任务窗口

## feature
通过多窗口来高效的组织任务, 支持:
* 多窗口        multi-window
* 调整大小      resize
* 拖动         drag
* 自动排列      auto align
* 定制样式      custom style
* 限制拖动      bounded
* 等...        etc.   

## install
使用前, 需要安装独立的依赖
```shell
yarn install @m78/wine
```


## 使用

<code src="./demo.tsx" />


## API

通过下方伪代码来解释主要api的构成:

* `Wine`是[renderApi](/m78/docs/utils/render-api)创建出来的实例, 使用此包前一定要先对其进行了解
* `state`是`WineState`类型, 用于配置窗口的一些具体行为
* `renderInstance`是由`renderApi`创建出来的示例, 上面包含了一些对应实例的管理方法, 其中, `renderInstance.current`是`Wine`对外暴露的特有实例, 对应`WineInstanceExtend`类型

```ts
import Wine from '@m78/wine';

const renderInstance = Wine.render(state);
```

```ts
/** 窗口状态 */
export interface WineState {
  /** 内容 */
  content: React.ReactNode;

  /* ##### 顶栏配置 ##### */
  /** 顶栏主要区域显示的内容 */
  headerNode?: React.ReactNode;
  /** 完全自定义顶栏，需要确保将props展开到header根节点上, .eg (<div {...props} className="myHeader" />) */
  headerCustomer?: (props: any, instance: WineInstance, isFull: boolean) => React.ReactNode;

  /* ##### 位置、尺寸 ##### */
  /** [0.5, 0.5] | 弹窗在屏幕上的位置, 取值为0 ~ 1 */
  alignment?: TupleNumber;
  /** 0.84 | 以浏览器窗口大小的一定比例来设置一个适合的窗口尺寸, 取值为0 ~ 1 */
  sizeRatio?: number;
  /** 宽度, 会覆盖sizeRatio对应方向的配置 */
  width?: number;
  /** 高度, 会覆盖sizeRatio对应方向的配置 */
  height?: number;
  /** WineBoundEnum.safeArea | 设置可拖动区域的类型 */
  bound?: WineBoundEnum;
  /** 根据此限定对象进行屏幕可用边界修正, 影响全屏窗口大小和自动调整窗口大小的各种操作 */
  limitBound?: Partial<Bound>;
  /** 初始化时最大化显示 */
  initFull?: boolean;

  /* ##### 其他 #####  */
  /** 根节点额外类名 */
  className?: string;
  /** 根节点额外样式 */
  style?: React.CSSProperties;
  /** 1000 | zIndex层级，由于内部包含多窗口层级的一些优化，不建议单独修改此项，可以通过render api全局更改 */
  zIndex?: number;

  /* ##### 事件 #####  */
  /** 置顶/活动事件、 */
  onActive?: () => void;
}
```

对外暴露的实例方法, 通过`render()`返回的实例上的`instance`使用
```ts
/** 扩展的实例属性和方法 */
export interface WineInstanceExtend {
  /** 对应的html节点 */
  el: RefObject<HTMLElement>;
  /** 置顶 */
  top: () => void;
  /** 最大化 */
  full: () => void;
  /** 重置大小 */
  resize: () => void;
  /** 刷新节点(渲染的组件会被卸载并重绘) */
  refresh: () => void;
  /** 一些内部使用的实例变量，某些复杂场景可能会用到 */
  meta: _WineSelf;
}
```

其他
```ts
/** 描述可拖动范围 */
export enum WineBoundEnum {
  /** 窗口范围内 */
  window = 'window',
  /** 安全区域内, 确保不会因为误操作导致无法拖动 */
  safeArea = 'safeArea',
  /** 不限制 */
  noLimit = 'noLimit',
}
```
