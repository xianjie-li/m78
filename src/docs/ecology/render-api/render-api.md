---
title: RenderApi - 渲染api
group:
  title: 生态
  path: /ecology
  order: 6000
---

# RenderApi 渲染 api

`RenderApi` 提供了在主 React 实例外渲染组件的方式，与 `React Portal api` 和 `React.render` 相比，此库提供了一系列管理已渲染组件的方法 和一些主观约定，简而言之, 它：

- 统一弹层实现方式和接口, 减少开发和使用成本
- 通过简洁的 api 管理你的外部组件实例, 并且你可以进行更新实例状态、控制显示、卸载等操作
- 不同于其他弹层组件, 渲染的组件可以存在于当前 react 上下文中, 所以 `React Context api` 等是可用的
- 单例，你可以创建多个 api 接口而不用担心它们彼此干扰

🤔 使用场景？

最常见的用例是用来渲染 Modal 等需要挂载到节点树外的组件，并且将其 api 化，可以通过 api 来直接创建实例并进行管理

## install

RenderApi 在单独的包中维护, 需要独立安装

```shell
yarn add @m78/render-api
# 或者使用 npm
npm install @m78/render-api
```

## usage

大致步骤如下:

- 约定组件的状态
- 创建要全局渲染的组件, `render-api`会在其 props 中传入当前状态和实例对象，组件 props 可通过 `RenderApiComponentBaseProps` 描述
- 通过`create()`和创建的组件来生成 api
- 使用生成的 api 渲染和管理组件

<code src="./demo.tsx" />

## API

以下伪代码描述了各类型的对应关系:

- `create`创建一个 api 实例, 它接收`RenderApiOption`作为配置并返回`RenderApiInstance`实例
- `RenderApiInstance.render`返回一个`RenderApiComponentInstance`实例, 用来控制实例的表现和行为
- 其中, 泛型`S`表示实现组件接收的状态, 也对应`render(S)`中的参数, `I`是实现组件想要主动对外扩展的 api

```ts
import create from '@m78/render-api';

const RenderApiInstance = create<S, I>(RenderApiOption<S>);

const RenderApiComponentInstance = RenderApiInstance.render(S);
```

```ts
/**
 * create() 方法接收的配置对象
 *
 * 变更此类型时应注意是否需要更新updateOptionWhiteList
 * */
export interface RenderApiOption<S> {
  /** 交由api渲染的组件，该组件接受RenderApiComponentProps */
  component: ComponentType<RenderApiComponentBaseProps<any>>;
  /** 默认state状态，会和render(state)时传入的state合并 */
  defaultState?: Partial<_OmitBuiltState<S>>;
  /** 包装组件，如果你的实现组件依赖于特定的布局，可以通过传递此项来包裹它们 */
  wrap?: ComponentType;
  /** 最大实例数，当渲染的组件数超过此数值时，会将最先进入的实例移除 */
  maxInstance?: number;
  /** 将实例渲染到指定命名空间的节点下, 而不是使用默认的渲染节点 */
  namespace?: string;
  /** 'show' | 自行定义控制组件显示/隐藏的props key */
  showKey?: string;
  /** 'onChange' | 自定义show变更进行通知的方法 */
  changeKey?: string;
}

/**
 * ###########################################
 * 以下两个类型是实现组件的接收props的基础类型,
 * 可以根据是否自定义show/onChange选择继承其中哪一个
 * ###########################################
 * */

/**
 * 实现组件的标准props, 实现组件可以选择继承此接口(如果未自定义show/onChange的key)或RenderApiComponentBaseProps
 * */
export interface RenderApiComponentProps<S, I = null> extends RenderApiComponentBaseProps<S, I> {
  /** 是否显示 */
  show: boolean;
  /** show状态变更时通知父组件 */
  onChange: (cur: boolean) => boolean;
}

/**
 * 实现组件会接受的基础props, 实现组件可以以此类型作为基础props
 *
 * 变更此类型时应注意是否需要同步setStateWhiteList和_OmitBuiltState
 * */
export interface RenderApiComponentBaseProps<S, I = null> {
  /** 通知上层组件销毁本组件的实例 */
  onDispose: () => void;
  /**
   * 更新state, 效果与RenderApiComponentInstance.setState相同, 区别是此回调由实现组件调用
   * 使用此回调来通知外部组件更新传递给自身的state
   * */
  onUpdate: RenderApiComponentInstance<S, I>['setState'];
  /** 当需要对外暴露更多的api时使用, 将额外的api挂载到此ref */
  instanceRef: RefCallback<I>;
}

/**
 * #######################################
 * renderApi实例, 提供了很多创建和管理实例的方法
 * #######################################
 * */

/** api实例，通过create()方法创建 */
export interface RenderApiInstance<S, I> {
  /** 创建并渲染一个实例, 返回创建的实例 */
  render: (state: _OmitBuiltState<S>) => RenderApiComponentInstance<S, I>;
  /**
   * 实例的挂载组件，一般会放在组件树的根节点下，并且应该避免其被延迟渲染
   * - 此配置存在的目的是保证外部挂载的组件被解析到主react实例树中从而使得React context等api正常可用
   * - 挂载位置与渲染位置无关，最终都会渲染到body下
   * - 如果RenderTarget在第一次运行render时仍没有没渲染, 则会自动渲染到body下, 此时将不能再正常在渲染的组件内接收context等
   * */
  RenderTarget: ComponentType;
  /** 关闭全部实例 */
  hideAll: () => void;
  /** 开启全部实例 */
  showAll: () => void;
  /** 销毁全部实例 */
  disposeAll: () => void;
  /** 获取所有实例的列表 */
  getInstances: () => Array<RenderApiComponentInstance<S, I>>;
  /** 可用事件对象 */
  events: {
    /** 实例发生可能会影响ui的改变时触发的事件 */
    change: ReturnType<typeof createEvent>;
  };
  /**
   * 更改create()时传入的配置, 只有白名单内的配置可以更改
   * whiteList: ['defaultState', 'wrap', 'maxInstance']
   * */
  setOption: (
    opt: Omit<RenderApiOption<S>, 'component' | 'namespace' | 'showKey' | 'changeKey'>,
  ) => void;
  /**
   * 获取正在使用的配置副本
   * */
  getOption: () => RenderApiOption<S>;
}

/**
 * ###########################################
 * renderApi实例, 由renderApi的render()方法创建,
 * 提供管理和控制单个实例的方法
 * ###########################################
 * */

/** render实例, 调用render()后生成 */
export interface RenderApiComponentInstance<S, I> {
  /** 隐藏 */
  hide: () => void;
  /** 显示 */
  show: () => void;
  /** 销毁 */
  dispose: () => void;
  /** 渲染组件的state */
  state: S;
  /** 更新渲染组件的state */
  setState: (nState: Partial<_OmitBuiltState<S>>) => void;
  /**
   * 存放组件内部对外暴露的属性和方法，由于组件渲染过程是异步的，所以此属性会延迟设置，如果实现组件未扩展任何东西则始终为null
   * - 如果需要在render()执行后马上获取此实例, 请使用safe()并在其内部进行操作
   * - 通常实现组件渲染的时间都非常的短, 除了在render后立刻访问, 直接使用instance.current访问实例也是可行的
   * */
  current: I;
  /**
   * 由于组件的渲染是异步的, current在创建render实例后并不能马上访问
   * 此时可以通过safe调用来安全的访问实例, safe会在实例可用后立刻进行回调
   * */
  safe: (cb: () => void) => void;
}
```
