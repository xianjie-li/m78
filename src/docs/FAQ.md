---
title: FAQ - 常见问题
group:
  title: 其他
  path: /FAQ
  order: 10000
---

## 约定

* 所有表单控件都必须支持`large` `small` 两种额外的尺寸, 可以通过types中的Size类型声明, 大部分组件高度推荐为`40 | 32 | 24`
* 所有数据选项格式为`{ label: ReactNode, value: any }`
* 表单控件应该根据类型支持以下态或其他衍生状态
    * loading
    * focus
    * disabled
    * hover
    * active
    * readonly
    * error
    * success
    * warn
* 支持黑色主题和白色主题(待实现)
* 如果需要提供ref来访问组件类的包裹节点，使用`nodeRef`
