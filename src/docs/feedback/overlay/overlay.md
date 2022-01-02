---
title: Overlay - 覆盖物
group:
  title: 反馈
  path: /feedback
  order: 2000
---

# Overlay 覆盖物

一个专门用于创建覆盖物的组件, 为所有弹层类组件提供 `定位`/`显示控制`/`方向`/`防遮挡` 等核心能力.

尽管此组件能非常简单的实现`Modal`, `Bubble`等组件功能, 但是其定位是一个下层组件, 并且不包含开箱即用的样式, 用法相比上层组件也稍显繁琐, 你应该只在创建自己的覆盖物组件时使用它作为底层实现.

## 定位

设置位置有三种种方式:

- `xy`: 通过窗口绝对坐标直接定位
- `alignment`: 通过窗口相对坐标定位, 常用于`modal`等组件
- `target`: 通过`dom`或一个描述位置的对象定位, 常用于气泡类组件

<code src="./positioning.tsx" />

注意事项:

- 同时传入时, 会按这个顺序覆盖: `xy` > `alignment` > `target` (使用实例方法更新无此限制)
- 如果需要频繁更新位置, 请使用`OverlayInstance`, 直接在`render`节点频繁更新会非常影响性能

## 显示控制

控制显示有两种主要方式:

- 第一种是类似表单控件, 通过`show`/`onChange(show)`/`defaultShow`来进行受控、非受控显示.
- 第二种则是组件提供的更为方便的用法, 通过`Overlay`的`children`自动控制显示, 这种方式可以通过`triggerType`来设置触发方式

<code src="./show-control.tsx" />

## 特性

mask, 它处点击关闭, 滚动锁定等

<code src="./features.tsx" />

## bubble

### 方向

<code src="./direction.tsx" />

### 箭头

<code src="./arrow.tsx" />

### 嵌套

<code src="./nest.tsx" />

### 防遮挡

自动包含以下行为来实现防遮挡:

- 主轴的滚动超出处理
- 副轴的超出切换方向

具体请见以下示例

<code src="./prevent-overflow.tsx" />

### 实例复用

在某些需要创建大量`overlay`实例的场景中, 复用一个实例会得到更好的性能, 通过 api 可以简单的完成这点:

<code src="./instance-reuse.tsx" />

## 动画

动画依赖于[Transition](/m78/docs/base/transition)组件实现, 所以用法非常相似:

- 最简单的用法是通过`transitionType`来设置内置动画
- 另一种则为定制用法, 通过`transition`来进行自定义动画

无论那种方式, 都可以通过`springProps`来配置动画的各种表现, 更多细节请见`Transition`文档

<code src="./transition.tsx" />

## mount 行为控制

通过`mountOnEnter`/`unmountOnExit`来控制内容在不同节点的挂载行为, 在合适的场景选择合适的配置能大大提升性能.

- `mountOnEnter`默认为`true`, 表示在`overlay`第一次出现时才真正挂载内容, 设置为`false`时, 内容会随组件一同挂载
- `unmountOnExit`默认为`false`, 表示在`overlay`关闭后是否保留内容节点, 如果内容频繁切换且需要维护状态, 关闭是更明智的选择, 像`tooltip`这类低创建和销毁成本的功能则应该开启

<code src="./mount.tsx" />

## API

### Props

```ts
interface OverlayProps
  extends ComponentBaseProps,
    UseMountStateConfig,
    RenderApiComponentProps<OverlayProps, OverlayInstance> {
  /** 内容 */
  content: React.ReactNode;
  /**
   * 传入children时, 将其作为控制开关, 在非受控时会直接代理show的值，受控时通过onChange回传最新状态
   * children包含以下限制:
   * - children的渲染结果必须是一个正常的dom节点, 不能是文本等特殊节点
   * - 渲染的dom必须位于组件声明的位置, 即不能使用 ReactDOM.createPortal() 这类会更改渲染位置的api
   *
   * 通过设置childrenAsTarget, 可以将children渲染结果作为target使用, 实现挂载overlay到children的效果
   * */
  children?: React.ReactElement;
  /** 'click' | 设置了children来触发开关时, 配置触发方式 */
  triggerType?: UseTriggerConfig['type'];

  /**
   * ########## 显示控制/性能 ##########
   * - 除了defaultShow外, 还有继承至RenderApiComponentProps的show/onChange
   * - 以及继承至UseMountStateConfig的mountOnEnter/unmountOnExit用来控制overlay显示/未显示时的内容是否挂载
   * */
  /** 是否非受控显示 */
  defaultShow?: boolean;

  /**
   * ########## 位置 ##########
   * 设置位置有三种种方式:
   * - xy: 通过窗口绝对坐标直接定位
   * - alignment: 通过窗口相对坐标定位, 常用于modal等组件
   * - target: 通过dom或一个描述位置的对象定位, 常用于气泡类组件
   *
   * - 同时传入时, 会按这个顺序覆盖: xy > alignment > target (使用实例方法更新无此限制)
   * - 如果需要频繁更新位置, 请使用OverlayInstance, 直接在render节点频繁更新会非常影响性能
   * */
  /** 通过窗口绝对坐标直接定位 */
  xy?: TupleNumber;
  /**
   * 通过窗口相对坐标定位, 取值为 0 ~ 1
   * 例：[0.5, 0.5] -> 居中， [1, 0] -> 右上， [1, 1] -> 右下
   * */
  alignment?: TupleNumber;
  /**
   * 通过dom或一个描述位置的对象定位, 支持以下类型:
   * - BoundSize    一个描述位置和尺寸的对象,
   * - RefObject<HTMLElement> 一个包含了dom节点的ref对象
   * - HTMLElement  一个dom节点
   *
   * 此外, 可以通过childrenAsTarget来将children渲染的dom作为target, 这个特性对气泡组件定位非常有效
   * */
  target?: OverlayTarget;
  /** 将通过children获取到的节点作为target使用 */
  childrenAsTarget?: boolean;

  // ######## 其他 ########
  /** 1800 | overlay显示层级, 所有弹层层级应不低于/等于1000, 因为1000是m78约定的内容和弹层中间的层级, 用于放置mask等组件 */
  zIndex?: number;
  /** 'OVERLAY' | 自定义挂载点的命名空间, 不同命名空间的overlay将被挂载到不同的容器中 */
  namespace?: string;
  /** 是否启用mask */
  mask?: boolean;
  /** 透传给mask节点的任意props */
  maskProps?: any;
  /** true | 点击内容或触发区域外时是否关闭 */
  clickAwayClosable?: boolean;
  /** true | 出现时是否锁定滚动条 */
  lockScroll?: boolean;
  /** 获取内部wrap dom的ref */
  innerRef?: React.Ref<HTMLDivElement>;
  /**
   * 0 | 气泡的偏移位置, 如果包含arrow, 偏移 = offset + 箭头高度 + 4 , 其中4为补白
   * - 未设置direction时offset无效
   * - 通过children + active模式控制开关时, 过大的offset会影响触发体验
   * */
  offset?: number;

  // ######## 动画 ########
  /** 'zoom' | 指定内置动画类型 */
  transitionType?: TransitionType;
  /** 自定义进出场动画, 此项会覆盖transitionType配置 */
  transition?: Pick<TransitionBaseProps, 'to' | 'from'>;
  /**
   * 接收react-spring动画配置, 用于对react-spring进行深度定制, 传入to、from等内部占用配置无效
   * - 可用来更改动画表现、设置事件回调、延迟和循环动画等
   * */
  springProps?: any;

  // ######## 气泡 ########
  /** 挂载方向 */
  direction?: OverlayDirection;
  /** 显示箭头, 仅在指定了direction时生效 */
  arrow?: boolean;
  /** [36, 10] | 箭头尺寸 */
  arrowSize?: TupleNumber;
  /**
   * 透传给arrow节点的props, 可以通过此项来设置className/style等
   * 部分内部使用的属性会被忽略, 传入children来自定义svg节点, 用来添加边框, 阴影等
   * */
  arrowProps?: any;
}
```

### Instance

```ts
/** overlay实例, 通过instanceRef或api用法使用 */
export interface OverlayInstance {
  /** 更新xy */
  updateXY(xy: TupleNumber, immediate?: boolean): void;
  /** 更新alignment */
  updateAlignment(alignment: TupleNumber, immediate?: boolean): void;
  /** 更新气泡目标 */
  updateTarget(target: OverlayTarget, immediate?: boolean): void;
  /** 以最后的更新类型刷新overlay定位 */
  update(immediate?: boolean): void;
}
```

### Direction

```ts
enum OverlayDirectionEnum {
  topStart = 'topStart',
  top = 'top',
  topEnd = 'topEnd',
  leftStart = 'leftStart',
  left = 'left',
  leftEnd = 'leftEnd',
  bottomStart = 'bottomStart',
  bottom = 'bottom',
  bottomEnd = 'bottomEnd',
  rightStart = 'rightStart',
  right = 'right',
  rightEnd = 'rightEnd',
}
```
