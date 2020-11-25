---
title: Auth - 权限
group:
  title: 工具
  path: /utils
  order: 5000
---

# Auth 权限

一个权限验证器, 用于便捷、统一的根据权限来控制视图显示。

## 基本使用

创建 auth 实例并通过通过 Auth 组件来对指定节点附加权限

<code src="./base-demo.tsx" />

## 反馈方式

内置三种无权限的反馈方式：占位节点、气泡框提示、隐藏

<code src="./feedback-type-demo.tsx" />

## 权限组件

直接为指定组件附加权限，生成的权限组件会直接附带权限验证，通常用于路由级权限验证

<code src="./with-auth-demo.tsx" />

## 获取 Deps

- 有三种方式获取 deps(), `getDeps()`、`useDeps()`、`<Deps />`
- `useDeps`和`Deps`的优势是会响应 deps 的变更而进行更新
- 通过管理 deps，😂 你甚至能把`auth`作为一个状态管理库来使用

<code src="./get-deps-demo.tsx" />

## 异步验证器

如果验证器返回 promise，验证时会等到其完成，可以跟常规验证器一样 resolve 一个 ValidMeta 来标识验证失败

异步验证器最好放在同步验证器之后，这样前面的普通验证器未通过就不会执行异步验证器了

<code src="./async-demo.tsx" />

## 或

类似编程语言中的 `||`，如果需要在两个权限中任意一个通过就通过验证，可以将权限 key 设置为数组`['key', ['key2', 'key3']]`·

与常规验证器不同，串联的 `或验证器` 不会在前面的验证器执行失败后阻止后面的同级验证器执行

<code src="./or-demo.tsx" />

## 额外参数

某些验证器会需要接受当前的某些运行时参数作为验证参照（比如验证是否为本人，会需要传入当前用户的信息给验证器），可以通过 extra 传递

<code src="./extra-demo.tsx" />

## 定制反馈节点

<code src="./custom-demo.tsx" />

## useAuth

hooks 式的验证，接受验证参数，返回验证结果，在某些场景下可能会用到

<code src="./use-auth-demo.tsx" />

## 局部验证器

只作用于当前挂载组件的验证器

<code src="./scope-demo.tsx" />

## 底层 api

最基本的底层逻辑在外部包中维护，通常你不会用到它们，但是也可以了解一下用法[@lxjx/auth](https://github.com/Iixianjie/auth/blob/master/readme.zh-cn.md#%E4%B8%AD%E9%97%B4%E4%BB%B6)

## 中间件

中间件用于增强 api，动态更改初始配置，内置了一个将 deps 缓存到本地的中间件，用法如下:

```ts
import create, { cacheMiddleware } from 'm78/auth';

create({
  middleware: [cacheMiddleware('my_auth_deps', 86400000)],
});
```

如果要自己编写中间件请查看，[@lxjx/auth](https://github.com/Iixianjie/auth/blob/master/readme.zh-cn.md#%E4%B8%AD%E9%97%B4%E4%BB%B6)

## API

以下所有 api 都包含在 create()创建的 auth 实例对象中

以下大部分 api 签名都是伪代码，详细说明请直接在开发时点击对应函数/组件查看类型声明文件

### **`<Auth />`**

为包裹的内部节点添加权限验证

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

### **`withAuth()`**

创建一个权限组件

`conf`参数支持`<Auth />`除`children`外的所有`props`

```ts
(conf: Omit<AuthProps<D, V>, 'children'>) => (Component: React.ComponentType<P>) => React.FC<P>
```

### **`useDeps()`**

获取`deps`

```ts
interface UseDeps<D> {
  <ScopeDep = any>(
    /**
     * 从deps中选择部分deps并返回，如果省略，会返回整个deps对象
     * - 如果未通过selector选取deps，hook会在每一次deps变更时更新，选取局部deps时只在选取部分变更时更新
     * - 尽量只通过selector返回必要值，减少hook所在组件的更新次数
     * - 如果选取的依赖值是对象等引用类型值，直接`deps => deps.xxx`返回即可，如果类似`deps => ({ ...deps.xxx })`这样更新引用地址，会造成不必要的更新
     * */
    selector?: (deps: D) => ScopeDep,
    /**
     * 每次deps变更时会简单通过`===`比前后的值，如果相等则不会更新hook，你可以通过此函数来增强对比行为，如使用_.isEqual进行深对比
     * - 如果在selector中正确保留了引用，很少会直接用到此参数
     * - 即使传入了自定义对比函数，依然会先执行 `===` 对比
     * */
    equalFn?: (next: ScopeDep, prev?: ScopeDep) => boolean,
  ): ScopeDep;
}
```

### **`<Deps />`**

通过`render children`来跟踪`deps`并渲染返回的节点

```ts
interface Deps<D> {
  (props: { children: (deps: D) => React.ReactNode }): React.ReactElement | null;
}
```

### **`useAuth()`**

以 hook 的形式使用`auth.auth()`, 会自动跟踪依赖值和 key 变更

```ts
interface AuthConfig<D> {
  /** 传递给验证器的额外参数 */
  extra?: any;
  /** 局部验证器 */
  validators?: Validators<D>;
}

interface UseAuth<D, V> {
  (keys: AuthKeys<V>, config?: { disabled?: boolean } & AuthConfig<D>): {
    /** 是否正处于验证状态 */
    pending: boolean;
    /** 所有未通过验证器返回的ValidMeta，如果为null则表示验证通过 */
    rejects: PromiseBack;
  };
}
```

### **`setDeps()`**

设置`deps`值

```ts
SetDeps<{
    [key: string]: any;
}>
```

### **`getDeps()`**

获取当前的 dependency

### **`subscribe()`**

订阅 dependency 变更, 返回的函数用于取消改订阅

```ts
type Subscribe = (listener: () => void) => () => void;
```

### **`auth()`**

```ts
/**
 * @param authKeys - 所属权限, 如果数组项为数组则表示逻辑`or`
 * @param callback - 验证结束的回调
 *    回调接收:
 *      * pass 是否通过了所有指定的验证
 *      * rejects 未通过的验证器返回的元数据列表
 * @return - resolve callback同样参数对象的Promise，和callback二选一
 * */
auth(authKeys: AuthKeys<V>, callback?: Callback): Promise<PromiseBack>;
/**
 * @param authKeys - 所属权限, 如果数组项为数组则表示逻辑`or`
 * @param config - 配置
 * @param config.extra - 传递给验证器的额外参数
 * @param config.validators - 局部验证器
 * @param callback - 验证结束的回调
 *    回调接收:
 *      * pass 是否通过了所有指定的验证
 *      * rejects 未通过的验证器返回的元数据列表
 * @return - resolve callback同样参数对象的Promise，和callback二选一
 * */
auth(authKeys: AuthKeys<V>, config: AuthConfig<D>, callback?: Callback): Promise<PromiseBack>;
```
