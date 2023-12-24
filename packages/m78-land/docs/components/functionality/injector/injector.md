---
title: Injector - 注入器
---

在开发大型组件时, Injector 能帮助你更轻松的拆解和维护组织代码

## 核心概念

- actuators: 执行器是一个普通的自定义 hooks, 区别是他会返回一个对象, 这个对象称为 deps(依赖), 你可以在组件的其他位置很方便的对其进行访问.
- deps: 由 actuators 返回的对象被称为 deps, deps 可以通过 useDeps(Actuator) 在当前组件上下文中访问.
- Injector: 挂载根 actuator, 生成渲染组件.

## 创建 Injector

通过 `createInjector(view, config?)` 来创建 injector:

```tsx
interface Props {
  name: string;
  sex: number;
}

// 创建injector实例
export const injector = createInjector<Props>((props) => {
  const state = injector.useDeps(useStateAct);

  return <div>{state.count}</div>;
});

// 使用通过injector管理后的组件
<injector.Component name="lxj" sex={1} />;
```

支持的配置:

```tsx
export interface InjectorConfig<Props = any> {
  /** 默认props */
  defaultProps?: Partial<Props>;
  /** 组件名称, 用于更好的debug */
  displayName?: string;
}
```

###

## Actuator

执行器是一个 react 自定义 hook

> 按照惯例, 我们会将 actuator 函数以 Act 结尾进行命名, 文件名可以为: `state.act.ts` 或 `stateAct.ts`

```ts
function useStateAct() {
  const [count, setCount] = useState(0);

  // 若返回一个对象, 返回会作为该 actuator 的 deps, 可在当前组件上下文中通过 useDeps(Actuator) 访问
  return {
    count,
    setCount,
  };
}
```

然后, 你可以在组件渲染上下文中对其进行注入访问:

```ts
function useLifeCycle() {
  const state = injector.useDeps(useStateAct);

  useEffect(() => {}, [state.count]);
}
```

:::info 与直接使用 hooks 看起没有太大区别?

`useDeps(act)` 是单例的, 同一组件实例下, 无论你对同一 actuator 中访问多少次, 他都总是返回相同的内容, 这解决了在 hook
之间共享状态的问题,
让你可以轻松的在不同模块对外暴露依赖, 并在不同模块间注入和共享这些依赖, 从而极大的提升你组织代码的灵活性.

并且, injector 的 api 设计使其对 typescript 支持非常友好, 你需要的重构/声明跳转等都是完整可用的.

:::

### 执行顺序

- 逐个执行 view 中的根执行器
- 若根执行器通过 useDeps 依赖其他 actuator, 会自动执行被依赖的 actuator, 待子执行器完成后再继续执行当前 actuator
  - 被依赖的 actuator 的若包含其他 actuator, 也遵循此规则依次向下执行

<img
width="360"
style={{ marginLeft: "32px" }}
src={require('./pic1.png').default}
alt="Example banner"
/>

## 注入器

### useDeps()

用于在 actuator 内获取其他 actuator 的 deps

```ts
function someActuator() {
  // 单个
  const deps = injector.useDeps(actuator);

  // 多个
  const [deps1, deps2] = injector.useDeps(actuator1, actuator2);
}
```

### useProps()

一个简单的注入器, 类似 useDeps(), 你可以通过它来注入组件的当前 props

```ts
function someActuator() {
  const props = injector.useProps();
}
```

<br/>

### 注入器规则&限制 🔥🔥🔥

**简单版:**

- useDeps 与 hooks 有相同的规则, 不能在任何分支或异步代码内运行
- 在包含逆序依赖和使用 useStatic 的 actuator 中, 不要使用解构语法来分解 deps, 而是直接通过 deps 引用访问状态

**详细版:**

- 基本:
  - 由于 Actuator 本身是一个 react 自定义 hook, 所以其遵循相同的限制规则, 不可用于条件分支/异步代码内.
  - 对同一个 Actuator 的 useDeps 总是返回相同的对象引用, 你可以通过引用访问避免一些闭包或逆序依赖带来的问题.
- 逆序依赖: 如果一个执行器依赖了在其后才会运行的执行器, 称为逆序依赖, 被依赖项由于尚未初始化, `useDeps()` 仅会返回一个空的对象, 并在完成初始化后对其填充, 你不能在 Actuator 内同步的获取到依赖, 解决方式有:
  - 不要同步访问依赖, 而是保有 deps 引用, 如: `const state = useDeps(useStateAct)`, 然后在后续的任意非同步代码中通过 state 使用它.
  - 使用 `useSettle(act, cb)` , 并在其回调中访问已经初始化完成的 deps
- 解构陷阱: 在以下情况中, 如果你通过解构语法来分解 deps, 可能会拿到陈旧的 deps 或根本拿不到, 应通过直接持有 deps 引用来进行访问:
  - 在逆序依赖中解构 deps, 因为 deps 在后续的执行器完成后才会填充, 你通过解构获取的可能是空或者前一次的状态
  - 在 useStatic 的静态内容中访问在其外部解构的 deps, 因为静态内容始终访问的是初次 render 时的 deps 快照, 如果 deps 在后续的 render 中更新, 你通过解构拿到的永远是第一次 render 的的内容

### useSettle()

另一个简单的注入器, 在指定的 actuator 每次执行完成后立即进行回调, 可以用来解决逆序依赖的问题

```ts
function someActuator() {
  injector.useSettle(actuator, (deps) => {
    console.log(deps);
  });
}
```

### useStatic()

注入静态内容, 它永远返回第一次 render 时的结果

```ts
const useStaticAct = () => {
  return injector.useStatic(() => ({
    MAX: 5,
    add(a, b) {
      return a + b;
    },
  }));
};
```

### useProvider()

在子组件包含其他相同 injector 的组件实例时, 手动将上下文调整回当前组件实例

> 你在很少情况需要使用它

```tsx
// 假设useRenderAct在一个名为MyInjector组件作用域内
function useRenderAct() {
  const Provider = injector.useProvider();

  // MyInjector 组件内部又使用了另一个 MyInjector 实例
  // 这种情况下, 子级的 MyInjector 实例内使用的injectors获取的是子 MyInjector 的上下文
  // 通过 useProvider 可以让你把上下文调整回父级作用域
  return (
    <MyInjector>
      <Provider>
        <div>xx</div>
      </Provider>
    </MyInjector>
  );
}
```

### useGetter

可以通过此 api 获取的 getter, 在组件上下文之外访问 deps 或 props

```tsx
function useXxxAct() {
  const getter = injector.useGetter();

  // 与useDeps/useProps完全相同, 但是可以在任意位置使用, 你可以将其传递给外部功能代码或在异步代码中使用
  const deps = getter.getDeps(xxxAct);
  const props = getter.getProps();

  return <span />;
}
```

## 代码组织

> 此处所有内容内容仅作为参考, 具体请根据实际代码调整:

<br/>

首先, 将你需要在组件不同模块之间共享的内容声明为 actuator, 例如:

`stateAct.ts` `methodsAct.ts` `utilsAct.ts`

<br/>

确定好需要共享的依赖后, 根据代码组织风格, 你可能有以下选择:

<br/>

**按代码功能性划分:**

`useLifeCycle.ts` `useEvents.ts` `useRenders.tsx` `...`

**按功能模块划分:**

`toolbar.tsx` `sideBar.tsx` `content.tsx` `editor.tsx` `...`

<br/>

确定好代码风格后, 创建 injector 实例, 然后你就可以在这些被拆分的模块中注入并使用你的依赖了:

```tsx
export const MyComponent = createInjector<Props>((injector) => {
  const state = injector.useDeps(useStateAct);

  const methods = injector.useDeps(useMethodsAct);

  useLifeCycle(); // 在常规的hook中也可以使用注入api

  const renders = useRenders();

  return (
    <div onClick={methods.interactive}>
      {renders.toolbar()}
      {renders.sidebar()}
      {renders.content()}

      {/* 在子组件内也可以使用注入api */}
      <More />
    </div>
  );
});
```

## 处理默认 props 的类型

```tsx
interface Props {
  name: string;
  sex: number;
  optionalKey?: string;
}

// 存在默认props时, 可参考如下写完提供完整的类型支持
const defaultProps = {
  optionalKey: 'hello',
} satisfies Partial<Props>

// 创建injector实例
export const injector = createInjector<Props, typeof defaultProps>((props) => {
  const state = injector.useDeps(useStateAct);

  return <div>{state.count}</div>;
}, {
  displayName: "MyComponet",
  defaultProps,
});

injector.useProps().optionalKey // 类型安全!
```
