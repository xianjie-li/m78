api 设想:

```tsx
useTrigger({
  element: <button>click</button>,
});

<Trigger>
  <button>click</button>
</Trigger>;
```

如何获取到 react element 渲染出来的节点?

- 方式一: 统一渲染一个 span 作为根节点
  - 优势: 实现简单, 无 hack 代码
  - 缺点: 破坏布局, `+ ~` 等 css 选择器, 一些布局会失效, 比如: `flex:1` `vertical-align: middle` 等
- 方式二: 传递 ref, 最官方的方式, 对使用者来说过于麻烦, 大部分情况 ref 指向组件实例, 小部分情况指向 dom 节点, 要正确的传递 ref 只能由用户控制, 这就造成了极大的麻烦
- 方式三: 官方 API, findDOMXXX? , 一个获取组件渲染 dom 的 api, 对函数组件无效, 且已被官方弃用
- 方式四: 也是我们使用的方式, 用了一些 hack 手段, 在要测量的 element 前渲染一个空的 dom 作为测量节点, 在 dom 节点 ref callback 中获取 nextSibling, 然后删除掉测量节点

trigger 允许传入 data, 在事件接收器中可以访问
