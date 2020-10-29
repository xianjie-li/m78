---
title: FAQ - 常见问题
group:
  title: 其他
  path: /other
  order: 10000
---

## 常规

### 没有运行时类型检测？

是的，使用`typescript`的话感觉就没必要进行参数、`props-types`等的检测了，因为即使使用的是`js`，依靠声明文件可以获得不错的类型提示，而且运行时检测还会增加少量的性能成本和挺多的代码。

### 可以和`antd`一起使用吗?

可以的，两者的基础 css 很相似，不会造成组件样式被严重破坏的情况。但如果只是需要使用部分`antd`的组件，在考虑体积成本的情况下，可以使用[react-component](https://github.com/react-component), 这个仓库包含大量 antd 的底层组件,引入成本不会太高。
