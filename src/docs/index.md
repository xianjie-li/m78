---
title: 快速上手
order: 1
---

<p align="center">
    <img src="https://gitee.com/llixianjie/docs/raw/master/fr/logo.png" width="160" align="center" />
</p>

<h1 align="center">M78</h1>
<p align="center">components, hooks, utils, part of the react toolchain</p>
<br>

## 🎉Introduction

一套 react 基础库，包含常用组件、hooks、以及其他工具。[查看文档](https://iixianjie.github.io/m78/docs)

<br>

## ✨Features

- 全`hooks`编写, `0`类组件。
- `antd`与`material`混搭风格。
- 使用 `TypeScript` 开发，类型定义完整。
- 标准化接口，大部分接口`color/value/onChange/size`等与社区约定一致，可方便集成。
- 提炼至业务，大部分组件都是从实际业务中提取而来, 更接地气也更实用。

<br>

## 📦Install

```shell
yarn add m78
# or
npm install m78
```

<br>

## 🍭Usage

### `import组件`

`M78` 使用 `es modules` 模块，通过`m78/*` 来导入主包下的各个模块

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

打包组件目录支持使用[babel-plugin-import](https://github.com/ant-design/babel-plugin-import), 不过不推荐, 一是对这样对 idea 和 ts 来说很怪异，支持不好；二是，组件通常会包含多个命名导出，如 `import Form, { Item, Title, Footer, FormProps } from 'M78/form'`。

<br>

### `样式`

样式采用后编译(开发时编译), 你需要为你的`webpack`或其他打包器添加`scss`文件支持才能正常使用。

<br>

## 🎄 其他

还没想到.jpg
