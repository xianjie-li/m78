---
title: 快速上手
order: 1
---

<p align="center">
    <img src="https://gitee.com/llixianjie/m78/raw/master/public/logo.png" width="160" align="center" />
</p>

<h1 align="center">M78</h1>
<p align="center">components, hooks, utils, part of the react toolchain</p>
<br>

## 🎉Introduction

一个 react 基础库，包含常用组件、hooks、以及其他工具。[查看文档](http://llixianjie.gitee.io/m78/docs)

<br>

## ✨Features

- 设计风格上采用`antd`与`material`混搭, 基础样式兼容`antd`, 可作为其的补充组件库使用。
- 大部分组件都进行了大小屏处理，移动端/PC 端均可用
- 使用 `TypeScript` 开发，包含完整的类型声明。
- 完全使用`hooks`编写。
- 标准化接口，size/value/defaultValue/onChange/color 等很多配置与社区大部分组件保持一致，学习成本更低。
- 贴近前台业务，相比其他为中后台设计的组件库可能会更适用于前台。

<br>

## 📦Install

```shell
yarn add m78
# or
npm install m78
```

<br>

## 📘Usage

### `导入组件`

`M78` 使用 `es modules` 模块，你可以通过`m78/*` 来导入主包下的各个模块

```js
import Button, { ButtonProps } from 'm78/button';

function App() {
  return (
    <div>
      <Button>click</Button>
    </div>
  );
}
```

💡 默认是没有主入口的，所有组件都在独立的模块中维护, 这样可以做到天然的按需加载，`tree shake` 也更友好。

<br>

### `启用sass加载器`

样式采用后编译(开发时编译), 你需要为你的`webpack`或其他打包器添加`scss`文件支持才能正常使用。

### 定制主题(可选)

如果要自定义主题色和其他样式变量，可以通过`webpack`配置`sass-loader`的`prependData`选项，并导入自定义的变量文件, 步骤如下:

1. 自定义 sass 变量

```scss
// custom.scss
@import '~@m78/style/sass-vars.scss'; // 不同工具的导入方式可能不一致，比如vite导入时不带前面的 `~`

// 主题色更改为红色
$color-6: red;

// 自定义信息色
$color-info: blue;
$color-success: green;
$color-error: red;
$color-warn: yellow;
```

更多变量请查看[m78/style](https://github.com/m78-core/style/blob/main/config.scss)

2. 修改`webpack` -> `sass-loader`配置(也可以跳过此步，在每个 sass 文件顶部自行引入)

```
// 你的webpack配置文件.js (每个脚手架配置方式可能会有所不同，请自行查阅)
{
  prependData: '@import "@/[文件路径]/custom.scss;',
}
```

<br>

## 🎄 其他

还没想到.jpg
