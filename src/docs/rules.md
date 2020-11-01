---
title: 约定
group:
  title: 其他
  path: /other
  order: 10000
---

## 样式约定

- 所有表单控件都必须支持`large` `small` 两种额外的尺寸, 可以通过`components/types`中的`Size`类型声明
  - 大部分组件高度推荐为`40 | 32 | 24`, 特定组件可根据实际情况 +8 或 -8
  - 部分组件会额外拥有`big`尺寸
- [ ] 黑色主题/白色主题
- 组件`z-index`统一使用内部提供的四种, 可以在`componet/util`中或 sass 中通过对应变量获取
- 保持组件样式隔离，组件应包含独立的[背景色、字号、行高、文字方向], 防止受使用环境影响而导致样式错乱
- 需要高度定制扩展的组件，支持添加`noStyle`选项来关闭所有非必要样式，并且每个关键组件部位都包含用于定制的类名
 
## 组件约定

- 某些包含选项的组件, 选项格式为`{ label: ReactNode, value: any }`, 对应`components/types`中的`DataSourceItem`
- 表单均需要支持 `value/defaultValue/onChange(val)` 接口，即使是`Radio`等组件。不使用`check/defaultCheck`等更语义化的名称，一是增加使用成本，二是能更方便的与验证库或其他第三方库集成。
- 所有表单控件 onChange 首参应输出直接可用的 value 类型，而不是未处理的特殊类型。类似`antd`时间控件的`onChange(moment)`，对使用者不友好。
- 表单控件应该根据类型支持以下态或其他衍生状态
  - loading
  - disabled
  - readonly
  - focus
  - hover
  - active
  - error
  - success
  - warn
  - tabindex
  - 键盘操作
- 复杂的条件渲染(参与验证的条件超过两个)，考虑使用 `If`, `Toggle`, `Fork` 等组件。
- 对于需要将内部 dom 元素通过 ref 转发的，使用名为`innerRef`的 prop, 必要时再使用`forwordRef`转发获取组件实例, 组件实例`ref`也可以通过`instanceRef`传递。
- 默认最优配置，尽量减少配置项，API 数，这样可以大大减少学习成本，并且降低出现破坏性变更的可能性。
- 在需要 `SSR` 的组件中不要在 render 中使用`document`、`window`等浏览器对象，dom 操作都放到`effect`中

## 文档

- 尽量简单明了, 配置参数等按使用频率排序, 提高查找到需要属性的速度。

## 项目组织

- 对于不包含 ts 定义文件`.d.ts`的库，将其对应的`@type/*`安装为 dependencies 依赖

  某些类型声明会被用户间接引用到，如果 dependencies 不包含对应包，会导致类型反馈异常，区分哪些声明文件可能会被用到很麻烦，而且声明文件通常很小，所以直接全安装到 dependencies

- 组件的类型声明放在同目录`types.ts`下, 防止文件臃肿。
- 样式位置为同目录下`style/index.js`/`style/index.ts`/`style/index.scss`, 用于与[babel-plugin-import](https://github.com/ant-design/babel-plugin-import)搭配使用, 即使组件不包含样式文件, 也需要在同目录下创建`style/index.js`/`style/index.ts`
