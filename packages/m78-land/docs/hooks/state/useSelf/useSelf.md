---
title: useSelf
group:
  path: /state
  order: 3
---

# useSelf

提供一个与类组件 this 类似功能的实例对象

## 示例

一般用于存放需要在组件各处使用，而不需要与组件同步更新的状态，使用实例属性的好处是它不会受到闭包的影响，你可以在组件内任意位置安全的获取到最新的值

<Demo demo={require("./useSelf.demo.tsx")} code={require("!!raw-loader!./useSelf.demo.tsx")}></Demo>

## API

`const self = useSelf(init)`

**self** - 实例对象

**init** - 设置实例对象初始值
