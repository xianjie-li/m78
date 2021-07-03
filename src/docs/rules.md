---
title: 约定
group:
  title: 其他
  path: /other
  order: 10000
---

## 项目组织

- 组件的对外导出内容一律使用`named export`, 这能带来一些可预见的好处:

  - 导出名称应该在所有文件中保持一致, 比如我希望 `lodash` 包总导出内容永远为`_`, `jquery` 包总是导出 `$`, 如果在某个文件中发现它们变成了`__`、`$$`、`loda`、`jq`, 会让人抓狂
  - `idea`，`vscode`和你都会更轻松
  - 选择越少，开发就越快
  - 减少记忆成本，认知符合
  - 即使有特殊的重命名需求，也可以通过别名语法`key as key2`轻松实现

- 对于不包含 ts 定义文件`.d.ts`的库，将其对应的`@type/*`安装为 dependencies 依赖

  某些类型声明会被用户间接引用到，如果 dependencies 不包含对应包，会导致类型反馈异常，区分哪些声明文件可能会被用到很麻烦，而且声明文件通常很小，所以直接全安装到 dependencies

- 中大型组件的类型声明放在同目录`types.ts`下, 防止文件臃肿。
- 对于不想对外导出或被用户 ide 错误感知的类型或文件, 以`_`开头.

## 样式约定

- 所有表单控件都尽可能的支持`large` `small` 两种额外的尺寸, 可以通过`types`包中的`Size/SizeEnum`类型声明
  - 大部分组件参考高度为`40 | 32 | 24`, 特定组件可根据实际情况 +8 或 -8, 关联的可用值有`types`中的`Size/FullSize`类型声明, `base` 下的 scss 变量,`util` 下的 `SIZE_MAP` 映射
  - 部分组件会额外拥有`big`/`mini`等尺寸
- 组件`z-index`统一使用内部提供的四种, 可以在`componet/util`中或 sass 中通过对应变量获取
- 保持组件样式隔离，组件应包含独立的[背景色、字号、行高、文字颜色、文字方向], 防止受使用环境影响而导致样式错乱
- 对于需要高度定制扩展的组件:
  - 支持添加`noStyle`选项来关闭所有非必要样式
  - 每个关键样式部位都包含用于定制的类名
  - 可以将不同的样式特征声明到不同的类名下方便通过 props 关闭，如`__shadow`, `__hover`分别用于控制组件的阴影和交互样式
  - 用于定制组件某个部位的 prop 命名为 `customXXX`, 如果是一个定制函数`(xx) => node`, 命名为 `XXXCustomer`
  - 大部分组件都可以支持 Customer 接口来定制组件整体样式，还可以支持特定部位的 Customer 如 TitleCustomer
  - 扩展某处节点的 prop 名使用`xxExtraNode`, 如果是替换型的 props, 直接使用 `xxxNode`

## 组件约定

- 表单均需要支持 `value/defaultValue/onChange(val)` 接口，即使是`Radio`等组件。不应使用`check/defaultCheck`等更语义化的名称，一是增加学习成本，二是能减少与验证库或其他第三方库集成。
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
- 对于需要将内部 dom 元素通过 ref 转发的，使用名为`innerRef`的 prop, 组件实例使用`instanceRef`/`useImperativeHandle`, 必要时再使用`forwordRef`转发获取组件实例, 因为这种方式对组件类型签名破坏太大。
- 默认最优配置，尽量减少配置项，API 数，例如，常用 api 占 25%，那么可以将整体 api 压缩到 50%(25%的高频使用 api，25%的扩展型 api，剩余通过组件内部通过默认值管理), 后续再根据使用情况逐个放出有使用场景的 api，这样可以大大减少学习成本，并且降低出现破坏性变更的可能性。
- 除非完全不需要 `SSR` 的组件，否则一律不要直接在 render 中使用`document`、`window`等浏览器对象，对这些对象的操作都放到`effect`中。
- 组件的字符类参数应同时支持传入 string key 和 enum, 例如: `<Button type="large" />` | `<Button type={Size.large} />`, 以 Button 为例, 两种类型的命名应为`ButtonSizeKeys`/`ButtonSizeEnum`
- 某些依赖于数据源的组件如没有特殊含义，均命名为`dataSource`, 如`tree`组件, 选项格式为`{ label: ReactNode, value: any }`, 对应`components/types`中的`DataSourceItem`

## 文档

- 尽量简单明了, 配置参数等按使用频率排序, 并进行简单分类, 提高查找到需要属性的速度。
