---
title: RenderApi - 渲染api
group:
  title: 反馈
  path: /utils
  order: 5000
---

# RenderApi 渲染api

有时候我们需要在react主实例外渲染组件，例如Modal、Drawer等组件，RenderApi为其提供了便捷的操作，组件只需要遵循几个api即可配合使用。

RenderApi在独立的包中维护，如果需要独立使用，请安装`@lxjx/react-render-api`

* 不同组件的api调用会启用不同的实例来维护
* 可以执行位置渲染节点的命名空间
* api调用后，会返回一个实例对象，可以用来关闭、更新渲染的组件
* 具体的使用见[react-render-api](https://github.com/Iixianjie/react-render-api)




