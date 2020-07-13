<p align="center">
    <img src="https://gitee.com/llixianjie/docs/raw/master/fr/logo.png" width="160" align="center" />
</p>

<h1 align="center">fr</h1>
<p align="center">components, hooks, utils, part of the react toolchain</p>

<br>

## 🎉Introduction

一套 react 基础库，包含常用组件、hooks、以及其他工具。[查看文档](https://iixianjie.github.io/fr/docs)

<br>

## ✨Features

* 全`hooks`编写, `0`类组件。
* `antd`与`material`混搭风格。
* 使用 `TypeScript` 开发，类型定义完整。
* 标准化接口，大部分接口`color/value/onChange/size`等与社区约定一致，可方便集成。
* 提炼至业务，大部分组件都是从实际业务中提取而来, 更接地气也更实用。

<br>


## 📦Install

```shell
yarn add @lxjx/fr
# or
npm install @lxjx/fr
```

<br>

## 🍭Usage

### `import组件`

`fr `支持 `es modules` (推荐)和 `commomjs` 两种类型的模块，你分别可以通过`@lxjx/fr/esm/*`和`@lxjx/fr/cjs/*`导入它们。

```js
import Button, { ButtonProps } from '@lxjx/fr/esm/button';

function App() {
  return (
    <div>
      <Button>click</Button>
    </div>
  );
}
```



💡 默认是没有主入口的，所有组件都在独立的模块中维护,  这样可以做到天然的按需加载，`tree shake` 也更友好。



打包组件目录是支持使用[babel-plugin-import](<https://github.com/ant-design/babel-plugin-import>)的,  不过不推荐, 一是对这样对idea和ts来说很怪异，支持不好；二是，组件通常会包含多个命名导出，如 `import Form, { Item, Title, Footer, FormProps } from '@lxjx/fr/esm/form'`。



### `样式` 

`fr` 的样式采用后编译(开发时编译), 你需要为你的`webpack`或其他打包器添加`scss`文件支持才能正常使用。



## 🎄其他

还没想到.jpg

















