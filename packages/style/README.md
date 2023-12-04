# @m78/style
预置的css变量、原子类、normalize、grid、以及常用的sass混合等，用于简化样式编写

* 需要使用支持sass/scss的打包器加载
* 此项目大量使用`css properties`, 用户可根据兼容需求使用[postcss-custom-properties](https://github.com/postcss/postcss-custom-properties)或类似工具进行回退处理
* 所有基础样式、原子类都是无污染的, 仅作用在`.m78`限定类名下或其本身, 可以使用到任意现有项目中而不用担心造成破坏
    * 对于新项目, 将 `.m78 ` 直接添加到html元素上, 使所有样式都能全局生效
    * 对于不想全局作用的项目, 在需要使用的节点根添加`.m78`类名
    * `.m78-init` 可用于重置节点的几个基础样式, 通常用于需要避免外部继承影响的组件



## 安装

```shell
yarn add @m78/style
```



## 全量引入

最简单的方式，自动包含`normalize`、布局模块、原子类、sass变量、混合等

```js
import '@m78/style'; // 包含var、normalize、atomic、component等基础模块
```



## 按需引入

```sass
// ########## 主要模块
// css变量, 少量的sass变量, 一些sass混合工具
@import "var";

// 初始化基础样式
@import "normalize";

// 原子类
@import "atomic";

// 组件
@import "components";

// ########## 根据需要引入 ##########

// 网格系统
//@import "grid";

// 移动端特殊配置
//@import "mobile";


// 小程序环境的normalize
//@import "normalize-for-mini-program";
```



## 生成自己的主题色

```shell
# 执行createCustomVar.js
node node_modules/@m78/style/script/createCustomVar.js

# 输入主题色
? 请输入主题色: red
--m78-color-1: #ffeae6;
--m78-color-2: #ffafa3;
--m78-color-3: #ff887a;
--m78-color-4: #ff5d52;
--m78-color-5: #ff3029;
--m78-color-6: #ff0000;
--m78-color-7: #d90007;
--m78-color-8: #b3000c;
--m78-color-9: #8c000e;
--m78-color-10: #66000e;
--m78-color: #d90007;
--m78-color-opacity-sm: #{rgba(#d90007, 0.2)};
--m78-color-opacity-md: #{rgba(#d90007, 0.4)};
--m78-color-opacity-lg: #{rgba(#d90007, 0.7)};

# 复制输出到自己的样式文件中进行覆盖, 可适当调整样式权重来确保整正确覆盖
# global-style.scss	你自己的全局样式文件
:root .m78, :root.m78 {
	# 复制到这里
}
```

