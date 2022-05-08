<p align="center">
    <img src="https://m78.vercel.app/logo-small.png" width="160" align="center" />
</p>

<h1 align="center">M78</h1>
<p align="center">components, hooks, utils, part of the react toolchain</p>
<br>

## 🎉Introduction

一个 react 基础库，包含常用组件、hooks、开发工具。

<br>

## ✨Features

- 统一的视觉风格
- 移动端/PC 双端兼容
- 使用 `TypeScript` 开发，包含完整的类型声明
- 完全使用`hooks`编写
- 除 UI 外，还包含大量应用层面的工具实现，如：`权限`、`状态管理`等
- 优秀的组件定制能力

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

`M78` 使用 `es modules` 模块系统，你可以通过`m78/*` 来导入主包下的各个模块

```js
import { Button, ButtonProps } from 'm78/button';

function App() {
  return (
    <div>
      <Button>click</Button>
    </div>
  );
}
```

💡 不包含主入口，所有组件都在独立的模块中维护并独立导入使用, 以达到天然的按需加载，`tree shake` 也更友好。

<br>

### `启用sass加载器`

样式采用后编译(开发时编译), 你需要为你的`webpack`或其他打包器添加`.scss`文件支持才能正常使用。


### 定制主题(可选)

组件库采用`CSS variables`来管理css配置, 由于此特性是浏览器天然支持的, 使用权重更高的变量覆盖组件库变量即可实现样式定制

可以在[此处](https://github.com/m78-core/style/blob/main/var.scss)查看所有可用变量

```css
*.m78 {
  --m78-color-6: red;
  --m78-color-sub: pink;
  --m78-color-info: blue;
  --m78-color-success: green;
  --m78-color-error: red;
  --m78-color-warn: orange;
  --m78-fs: 16px;
}
```


<br>

## 🎄 其他

还没想到.jpg

<br>

## 🎁 support

Thanks for the open source license provided by JetBrains

<img alt="JetBrains" width="120" src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png?_gl=1*1p2eqoh*_ga*MTcxMDQ3MTQxLjE2Mzc2ODcwNDc.*_ga_V0XZL7QHEB*MTYzOTA5OTgwMi41LjAuMTYzOTA5OTgwMi4w&_ga=2.52930088.1860787367.1639099803-171047141.1637687047" />
