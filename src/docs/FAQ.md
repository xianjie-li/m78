---
title: FAQ - 常见问题
group:
  title: 其他
  path: /FAQ
  order: 10000
---

## 约定

* 所有表单控件都必须支持`large` `small` 两种额外的尺寸, 可以通过types中的Size类型声明,
    大部分组件高度推荐为`40 | 32 | 26`
    如果通过scale设置大小，三种尺寸比例应对应1.25/1/0.75
* 所有数据选项格式为`{ label: ReactNode, value: any }`, 对应DataSourceItem
* 所有表单控件onChange首参数应输出直接可用的value类型，而不是未处理的特殊类型
* 复杂的条件渲染(超过两个)，使用If, Toggle等组件
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
* 对于需要将内部dom元素通过ref转发的，使用名为`innerRef`的prop, 通过ref获取组件实例
* 默认最优配置，尽量减少配置项，API数，这样可以大大减少学习成本，并且降低出现破坏性变更的可能性
* 对于不包含ts定义文件`.d.ts`的库，将其对应的`@type/*`安装为dependencies依赖
  某些类型声明会被用户间接引用到，如果dependencies不包含对应包，会导致类型反馈异常，区分哪些声明文件可能会被用到很麻烦，而且声明文件通常很小，所以直接全安装到dependencies
