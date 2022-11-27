---
title: useFetch
group:
  path: /effect
  order: 2
---

# useFetch

通过更`hook`的方式来进行数据请求

## 核心特性

- 自动/手动
- 自动请求状态管理(加载/超时/错误/请求结果)
- SWR/数据缓存
- 节流/防抖
- 竞态
- 取消请求
- more...

## 基本使用

```tsx | pure
// queryUserInfo是用于请求的函数, 其返回一个Promise, 如果请求成功则应该resolve响应值, 否则reject错误原因
const fh = useFetch(queryUserInfo);

// 像同步代码一样使用接口的响应或请求状态
<div>{fh.data?.name}</div>
{fh.loading && 'loading...'}
{fh.error && 'error...'}
```

## 综合示例

<demo demo={require("./base.demo.tsx")} code={require("!!raw-loader!./base.demo.tsx")}></demo>

## 节流/防抖

<demo demo={require("./throttleDebounce.demo.tsx")} code={require("!!raw-loader!./throttleDebounce.demo.tsx")}></demo>

## param

调用`send`很麻烦，大部分业务中，理想的请求时机是某个依赖的值发生改变时，通过`param`，可以轻松的实现这一点

<demo demo={require("./param.demo.tsx")} code={require("!!raw-loader!./param.demo.tsx")}></demo>


> 💡 内部通过\_.isEqual 来对比 param 相等性，保持 param 结构相对简单能够减少对比深度，从而提高性能

> 💡 为什么`cacheKey`没有缓存 param?

param 是不可控的、完全由外部传入的状态，缓存 param 会在很多情况下造成内外不一致，如果需要缓存 param，在`useFetch`外使用[useStorageState](/#/state/use-storage-state)来管理 param 或者将页面参数存到 url 中是更可靠的做法

## 串联请求

第一个参数不为函数或`options.pass=false`时, 会阻止请求, 可以借此简单的实现串联请求

```ts
const fh = useFetch(queryDataLevel1);

// 前一个请求成功后, 会自动以id作为参数开始下一个请求
const fh2 = useFetch(fh.data && queryDataLevel2, {
  param: fh.data?.id
});
```

## API

```ts
const fh = useFetch(service, options?);
```

**service** - 获取数据的函数, 其必须返回一个Promise对象, useFetch会根据promise的状态决定请求的结果, 如果此项不为函数时不会走请求流程, 表现与options.pass相似, 可以用来实现简短的串联请求

**options** - 请求配置

```ts
interface UseFetchOptions<Data, Payload> {
  /** 传递给请求函数的参数, 当发生改变时，会以新值发起调用请求。传递此项时，payload会被忽略。 */
  param?: Payload;
  /** [] | 类似useEffect(fn, deps)，当依赖数组内的值发生改变时，会以当前payload进行更新请求, 请勿传入未memo的引用类型值 */
  deps?: any[];
  /** false | 只能通过send来手动触发请求 */
  manual?: boolean;
  /** 10000 | 超时时间(ms) */
  timeout?: number;
  /** true | 只有为true时才会发起请求, 可以用来实现串联请求 */
  pass?: boolean;
  /** 初始data */
  initData?: (() => Data) | Data;
  /** 初始payload, 在不存在param配置时，作为参数传递给请求方法 */
  initPayload?: (() => Payload) | Payload;
  /** 成功回调, 当为更新请求(无参调用send、deps/param等配置发起请求)时，isUpdate为true */
  onSuccess?: (result: Data, isUpdate: boolean) => void;
  /** 错误回调, error为请求函数中抛出的错误 */
  onError?: (error: any) => void;
  /** 无论成功与否都会调用。在旧的请求被新的请求覆盖掉时, 不会触发。 */
  onFinish?: () => void;
  /** 请求超时的回调 */
  onTimeout?: () => void;
  /** 用于缓存的key，传递后，会将(payload, data, arg)缓存到session中，下次加载时将读取缓存数据作为初始值 */
  cacheKey?: string;
  /** true | 当传入了cacheKey且存在缓存数据时，是否进行swr(stale-while-revalidate)请求 */
  stale?: boolean;
  /** 节流间隔时间，传入时，开启节流, 只有初始化时的配置会生效 */
  throttleInterval?: number;
  /** 防抖间隔时间，传入时，开启防抖, 只有初始化时的配置会生效, 当存在throttleInterval时，此配置不会生效 */
  debounceInterval?: number;
}
```

**fh**

```ts
interface UseFetchReturns<Data, Payload> {
  /** 是否正在请求 */
  loading: boolean;
  /** method方法reject时，error为它reject的值。 */
  error: any;
  /** 请求超时设置为true */
  timeout: boolean;
  /** method方法resolve的值或initData */
  data: Data;
  /** 当前用于请求的payload或initPayload */
  payload: Payload;
  /** 当前用于请求的param */
  param: Payload;
  /** 设置当前的data */
  setData: SetStateBase<Data>;
  /** 取消请求 */
  cancel: () => void;
  /**
   * 根据参数类型不同，会有不同效果:
   * - 带参数: 以新的payload发起请求并设置payload
   * - 无参数/参数为react合成事件: 以当前参数发起更新请求
   * - 传入了param配置项: 当存在param配置，一律视为更新并以当前param的值发起更新. 此时，传入的payload会被忽略
   *
   * 返回一个promise对象, 请求结果的结果决定其状态
   * */
  send: (
    newPayload?:
      | Payload
      | React.SyntheticEvent /* SyntheticEvent是为了直接将send绑定给onClick等时不出现类型错误 */
  ) => Promise<Data>;
}
```
