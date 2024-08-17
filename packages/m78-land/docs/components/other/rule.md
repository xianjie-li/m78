---
title: 文档&组件约定
---

## 项目组织

- **导出:** 对外导出内容一律使用`named export`, 这能带来一些可预见的好处:

  - 导出名一致, 有效避免混淆, 减少记忆成本, 不会出现 `$` `jquery` `_` `lodash` 等各式各样的命名, 如果出现重名, 通过`as`重命名也非常简单
  - 更精准的智能编辑器预测, 更好的提供自动导入
  - 一个包通常会包含很多导出, 比如 `button` 模块包含组件/枚举/ts 类型等导出

    ```ts
    import { Button, ButtonColor, ButtonProps } from "m78"; // 这样看起来似乎更好?

    import React, { useEffect, useState } from "react";
    ```

- **类型:**
  - 类型数量较少的组件类型统一放到其目录下`types.ts`中管理, 并在`index.ts`入口集中导出
  - 类型以组件或模块名开头, 防止各组件之间命名空间干扰
  - 依赖的第三方库如果通过`@types/*`提供并且需要暴露给用户, 将类型包安装为 `dependencies`, 这样用户不用处理 `peerDependencies` 就能正常获取到类型
- **ESM:**
  - 严格遵循 ESM, 所有导入项添加`.js`后缀
- **命名:**
  - 文件命名一律使用`kebab-case`命名, 如`my-component`
    - 一是这是 npm 依赖包的通用命名方式, 使用起来会更统一
    - 二是会让代码更整齐, 比如我们平时最常见的命名方式: 组件/class 大驼峰, 其他文件小驼峰, 使用体验其实并不是很好
  - 对于要区分文件类型的场景, 使用 `.类型.后缀`, 比如: `button.demo.tsx` `user.service.ts`
  - 所有不对外导出的成员/类型一律使用`_`开头, 严格使用 `package.json` 的 `exports` 控制导出内容.
    - 遵循这一点能减少库代码对用户智能编辑器的提示干扰.
    - 库代码也会更加清晰, 可以非常简单的区分内容是否对外导出.

## UI 约定

- **size:** 所有表单控件都尽可能的支持`large` `small` 两种额外的尺寸, 可以通过`types`包中的`SizeUnion/Size/FullSize`类型声明, 可以在`componet/consts`中或 sass 中通过对应变量获取
- **z-index:** 组件`z-index`统一使用预置的几种类型, 可可以在`componet/consts`中或 sass 中通过对应变量获取
- **样式继承:** 某些组件需要保持样式隔离，组件应包含独立声明的`背景色、字号、行高、文字颜色、文字方向`, 防止受使用环境影响而导致样式错乱, 某些组件则不需要

## 组件约定

- **组件定制性:**
  - 对应可能会有很强定制意愿的组件, 可以考虑实现 `unstyled`(无 ui 组件) 和常规两个版本, 前者只包含组件核心逻辑, 不包含 ui 层, 但提供了方便的挂载 ui 方式
  - 对应需要普通定制的组件, 参考以下点:
    - 每个关键样式部位都包含用于定制的 css 类名
    - 可以将不同的样式特征声明到不同的类名下方便通过 props 关闭，如`__shadow`, `__hover`分别用于控制组件的阴影和交互样式
    - 定制性的 props, 以定制的部位命名, 如 header, 通常会支持直接传`node`和`(xx) => node`的方式, 替换或定制某个部位节点使用 `XXXNode`命名, 只支持渲染器定制则使用`XXXCustomer`, 扩展某部位的 prop 命名为`xxExtra`, 组件性的整体定制使用名称`customer`
    - 为避免 API 中通常由双重否定所造成的困惑， boolean 类型的参数和属性始终以肯定的形式命名（比如，使用 enabled: true 而非 disabled: false）
- **表单:**

  - 表单控件严格限制为 `value/defaultValue/onChange(val)` 接口，即使是`Radio`等组件。不使用`check/defaultCheck`等更语义化的名称，一是增加学习成本，二是能减少与验证库或其他第三方表单库集成成本。
  - 所有表单控件 onChange 首参应输出直接可用的 value 类型，而不是未处理的特殊类型。比如`antd`时间控件的`onChange(moment)`，对使用者不友好。
  - 表单控件应该根据类型支持以下态或其他衍生状态

    - 必须

      - disabled
      - focus - ui
      - hover - ui
      - active - ui

    - 可选

      - loading
      - error
      - success

  - 需要支持 tabindex 和 键盘操作

- **ref:** 转发内部 dom 使用`props.innerRef`, 组件实例使用`props.instanceRef`, 使用`forwordRef`对组件类型签名破坏太大并且除了能直接传 ref 没有实质性的好处。
- 复杂的条件渲染(参与验证的条件超过两个)，考虑使用 `If`, `Toggle`, `Fork` 等组件。
- 默认最优配置，尽量减少配置项，API 数，例如，常用 api 占 25%，那么可以将整体 api 压缩到 50%(25%的高频使用 api，25%的扩展型 api，剩余通过组件内部通过默认值管理), 后续再根据使用情况逐个放出有使用场景的 api，这样可以大大减少学习成本，并且降低出现破坏性变更的可能性。
- **ssr/ssg:**
  - 除了仅需要支持浏览器渲染的组件，不要直接在 render 中直接使用`document`、`window`等浏览器 api，对这些对象的操作都放到`effect`中, 或使用 `BrowserOnly` 组件包裹
  - 另外, 不要使用 `typeof window !== 'undefined` 这类的代码来条件性的渲染 ui(纯文本可以, 但是最终 dom 结构不同不行), 这会导致进行 hydration 操作时 dom 结构不一致而产生错误
- 组件的字符类参数应同时支持传入 string key 和 enum, 例如: `<Button type="large" />` | `<Button type={Size.large} />`, 以 Button 为例, 两种类型的命名应为`ButtonSizeKeys`/`ButtonSize`, 并声明一个用于直接使用的联合类型 `ButtonSizeKeys | ButtonSize`
- 某些依赖于数据源的组件如没有特殊含义，均命名为`dataSource`, 如`tree`组件, 选项格式为`{ label: ReactNode, value: any }`, 对应`components/types`中的`DataSourceItem`

## 文档

- 尽量简单明了, 配置参数等按使用频率排序, 并进行简单分类, 提高查找到需要属性的速度。
