



api 设想:

```tsx
useTrigger({
  element: <button>click</button>
});

<Trigger>
  <button>click</button>
</Trigger>

// 如果是嵌套节点触发事件, 比如focus需要由下面的input触发
<Trigger>{ref => {
 return (
   <span class="cus-inp">
     <input ref={ref}></input>
   </span>
 )
}}</Trigger>

useTrigger({
  element: ref => <button ref={ref}>click</button>
});
```



如何获取到react element渲染出来的节点?

- 方式一:  统一渲染一个span作为根节点
  - 优势: 实现简单, 无hack代码
  - 缺点: 破坏布局, `+ ~` 等css选择器, 一些布局会失效, 比如: `flex:1`  `vertical-align: middle` 等
- 方式二: 传递ref
  - 最传统/官方的方式, 对使用者来说过于麻烦, 大部分情况ref指向组件实例, 小部分情况指向dom节点, 要正确的传递ref只能由用户控制, 这就造成了极大的麻烦
- 方式三: 官方API, findDOMXXX? , 一个获取组件渲染dom的api, 对函数组件无效, 且已被官方弃用
- **方法四**: 折中手段, 在节点周围或内部(推荐)渲染一个节点, 根据这个节点来通过dom api查找到组件实际渲染的节点, 比如 node.parent
  - 优化: 渲染完成后移除节点, 会造成react-fastfresh报错, 因为跟预期的节点不一致, 改为在节点内部渲染, 并且使其不可见, 不参与交付, 应该能避免绝大部分问题



- 给节点添加className, 根据className来查找dom, 如果组件不支持className会无效



trigger允许传入data, 在事件接收器中可以访问

