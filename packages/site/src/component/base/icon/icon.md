---
title: Icon - 图标
group:
    title: 基础组件
    path: /base
---

## Icon 图标

使用 [material-design-icons](https://github.com/google/material-design-icons) 作为底层图标库, 并且所有图标均已由`svg`转换为了`react`组件, 方便按需导入和使用.

## 使用

1. 图标库维护在单独的包中, 使用前请确保已安装

```shell
npm install @m78/icons
```

2. 按需导入并使用

```tsx | pure
import { Icon4k } from "@m78/icons/icon-4k";
import { Icon5k } from "@m78/icons/icon-5k";
import { IconFace2 } from "@m78/icons/icon-face-2";

// jsx
<Icon4k />
<Icon5k />
<IconFace2 />
```

> 没有提供统一的出口, 因为图标总数约4k+, 即使你的打包器支持tree shake, 导入分析也会对你的智能编辑器造成巨大的负担, 严重影响开发体验.

## 图标列表

<code src="./icon-demo.tsx" inline="true"></code>


## 调整样式

`icon`没有提供任何特别的配置项, 你可以通过[layout](/component/base/layout)中提供的原子类像对待一个常规dom节点一样对其进行定制

```tsx | pure
<Icon4k className="fs-24" />  // 控制大小
<Icon4k className="color-red" />  // 控制颜色
```

另外, `icon` 包含了一段非常基础的控制样式, 如果你的项目中未依赖其他组件, 这段样式可能不会被自动注入, 需要手动添加到您的项目中.
```css
.m78-icon {
  display: inline-block;
  // 实际使用中发现, 因为图标普遍小于文本, 并且细节比文本更多, 将其放大一定比例会更好, 否则基本每次使用都会单独再将其通过样式放大
  width: 1.5em;
  height: 1.5em;
  fill: currentColor;
  vertical-align: middle;
  line-height: 1;
}
```

## 关于可访问性

通常图标用于装饰目的, 如果你要渲染一个具有语义的图标, 可以搭配`Button`组件使用
```tsx | pure
<Button aria-label="delete" icon>
  <FilledDelete />
</Button>
```
