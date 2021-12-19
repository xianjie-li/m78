---
title: Seed - 种子
group:
  title: 生态
  path: /ecology
  order: 6000
---

# Seed 种子

一个非常简单易用的状态管理工具, 拒绝`redux`⛔，从我做起 😎.

- 简单，三分钟即可学会使用.
- 完善的类型声明.
- 可扩展，支持中间件，内置了对`redux-devtool`的中间件支持.

> 本库是 [@m78/seed](https://github.com/m78-core/seed) 的`react`实现。

## 使用

```tsx | pure
import { createSeed } from 'm78/seed';

// #########################
//        基础 Api
// #########################

// 🔥 createSeed()用来创建一个seed实例, 你可以创建多个不同的seed实例
const seed = createSeed({
  // 每个seed管理一个状态对象
  state: {
    name: 'count app',
    count: 1,
    createTime: Date.now(),
  },
});

// 🔥 更新某个状态的值
seed.set({ count: 2 })

// 🔥 将状态覆盖设置为指定值, 此处设置后，name字段将变为undefined
seed.coverSet({ count: 2, createTime: Date.now() })

// 🔥 获取state
seed.get();

// 🔥 订阅state变更
const unsubscribe = subscribe((changes) => {...});

// 🔥 取消订阅
unsubscribe();

// #########################
//        React Api
// #########################

// 🔥 useState(), 获取状态的最佳方式
function UseStateExample() {
  /**
   * 从state中选择部分state并返回，如果省略参数，会返回整个state对象
   * 遵循一些使用规则，能使useState只在必要的时机更新，详情请见api useState部分
   * */
  const count = seed.useState(({ count }) => count);

  return (
    <div>{count}</div>
  )
}

// 🔥 <State />, 偶尔会用用的状态获取方式
function StateExample() {
  /**
   * 通过State组件获取状态，状态改变时，只有组件的render children区域更新，
   * 适合某个区域要显示部分deps的场景
   * */
  const count = seed.useState(({ count }) => count);

  return (
    <State>
      {({ count, name }) => (
        <div>
          <div>count: {count}</div>
          <div>name: {name}</div>
        </div>
      )}
    </State>
  )
}
```

<br>
如果你想了解更多，请查看下方 `API` 部分
<br>

## 中间件

中间件用于增强 api，动态更改初始配置，内置了两个中间件:

- **cacheMiddleware**: 启用 state 缓存功能，销毁时将状态存储到 session 或 storage 中并在下次进入时还原
- **devtool**: 开启对 redux-devtool 的支持，可以通过该浏览器插件来查看当前状态

```ts
import create, { cacheMiddleware, devtoolMiddleware } from 'm78/seed';

create({
  middleware: [
    // 启用state缓存功能，销毁时将状态存储到session或storage中并在下次进入时还原
    cacheMiddleware('my_auth_deps', 86400000),
    // 开启对redux-devtool的支持，可以通过该浏览器插件来查看当前状态
    devtool,
  ],
});
```

## 编写中间件

> 🤔 这是进阶内容，如果你只是组件和库的使用者请忽略此节内容

中间件用于为原有 api 添加各种补丁功能，也可用于在配置实际生效前对其进行修改。

中间件有两个执行周期：

- 初始化阶段，用于修改传入的默认配置
- 补丁阶段，用于为内置 api 添加各种增强性补丁

一个 log 中间件的例子:

```ts
import { Middleware } from 'm78/seed';

const cacheMiddleware: Middleware = bonus => {
  /* ##### 初始化阶段 ##### */

  if (bonus.init) {
    const conf = bonus.config;
    console.log('init');

    // 初始化时必须返回配置，即使没有对其进行修改， 返回值会作为新的初始配置使用
    return { ...conf, state: { ...conf.state, additionalDep: 'hello😄' } };
  }

  /* ##### 补丁阶段 ##### */

  console.log('api created');

  // 在执行set state时打印设置的新state
  bonus.monkey('set', next => patch => {
    console.log('set', patch);
    next(patch);
  });

  // 获取state时输出获取行为
  bonus.monkey('get', next => () => {
    console.log('get');
    return next();
  });
};
```

中间件的完整 api 签名:

```ts
interface Middleware {
  (bonus: MiddlewareBonusPatch | MiddlewareBonusInit): CreateSeedConfig | void;
}

/** 中间件初始化阶段的入参 */
export interface MiddlewareBonusInit {
  /** 是否为初始化阶段 */
  init: true;
  /** 当前创建配置(可能已被其他中间件修改过) */
  config: CreateSeedConfig;
  /** 在不同中间件中共享的对象，可以通过中间件特有的命名空间在其中存储数据 */
  ctx: AnyObject;
}

// 补丁阶段参数
interface MiddlewareBonusPatch {
  /** 是否为初始化阶段 */
  init: false;
  /** 当前的auth api(可能已被其他中间件修改过) */
  apis: Seed;
  /** 为api添加增强补丁 */
  monkey: MonkeyHelper;
  /** 在不同中间件中共享的对象，可以通过中间件特有的命名空间在其中存储数据 */
  ctx: AnyObject;
}
```

## API

### **`Seed实例`**

`seed`实例，由`createSeed()`创建

```ts | pure
interface RCSeed<S> {
  /** 更改当前state, 只会更改对象中包含的key */
  set: SetState<
    S & {
      [key: string]: any;
    }
  >;
  /** 以新state覆盖当前state */
  coverSet: CoverSetState<
    S & {
      [key: string]: any;
    }
  >;
  /** 订阅state变更, 返回函数用于取消改订阅, 接收变更的state(setState传入的原始值) */
  subscribe: Subscribe<S>;
  /** 获取当前的state */
  get(): S;
  /** 获取当前state的hook */
  useState: UseState<S>;
  /** 通过render children获取state */
  State: State<S>;
}

// useState
interface UseState<S> {
  <ScopeS = any>(
    /**
     * 从state中选择部分state并返回，如果省略参数，会返回整个state对象
     * - 如果未通过selector选取state，hook会在每一次state变更时更新，选取局部state时只在选取部分变更时更新
     * - 尽量只通过selector返回必要值，以减少hook所在组件的更新次数
     * - 如果选取的依赖值是对象等引用类型值，直接`({ xxx }) => xxx`返回即可，如果类似`state => ({ ...state.xxx })`这样更新引用地址，会造成不必要的更新
     * */
    selector?: (state: S) => ScopeS,
    /**
     * 每次state变更时会简单通过`===`比前后的值，如果相等则不会更新hook，你可以通过此函数来增强对比行为，如使用_.isEqual进行深对比
     * - 如果在selector中正确保留了引用，很少会直接用到此参数
     * - 即使传入了自定义对比函数，依然会先执行 `===` 对比
     * */
    equalFn?: (next: ScopeS, prev?: ScopeS) => boolean,
  ): ScopeS;
}

// <State />
interface State<S> {
  (props: { children: (state: S) => React.ReactNode }): React.ReactElement | null;
}
```

### **`createSeed()`**

创建一个`createSeed()`实例

```ts
interface RCSeedCreator {
  <S extends AnyObject = AnyObject>(conf: CreateSeedConfig<S>): RCSeed<S>;
}

// 创建配置
interface CreateSeedConfig<S = any> {
  /** 状态 */
  state?: S;
  /** 中间件 */
  middleware?: (Middleware | null | undefined)[];
}
```
