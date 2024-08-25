# M78 Land

Front-end library, components, hooks, admin template, and more...

Still in development.


## 开发相关

**包管理器**

该项目使用 yarn v4 作为包管理器, 推荐开启并通过 corepack 来自动切换包管理器

<br>

**monorepo**

使用 yarn 的 workspace 特性来进行 monorepo 管理

<br>

**devtools**

工作区内提供了一个 devtools 模块, 它简单的包装了很多开发相关的工具, 例如ts, lint, 测试, 开发服务, 构建等, 用来简化各个模块的开发流程, 可以在各模块内通过 npm script 访问这些功能, 例如:

```bash
# 在工作区根目录执行, 创建一个新的包

yarn m78 init ./packages/my-package

# 在子包内执行以下命令, 进行对应的操作

yarn test # 在工作区内执行测试

yarn lint # 执行 lint 操作, 并处理可自动修复的部分

yarn build # 构建模块

yarn pub # 发布模块, 需要先进行 yarn npm login 认证

yarn example:xxx # 运行模块内部提供的示例

yarn workspace mod-a run build  # 你也可与在工作区任意位置通过 yarn workspace 来对该指定包运行命令
```

<br>

**ESM only**

该项目所有模块都仅支持和输出 ES modules, 这即能简化分发的工作量, 又能更好的拥抱未来 :)

所有需要发布的模块导入语句都应严格添加 `.js` 后缀, 且不可省略 `index.js`, 从而达到对 nodejs 和浏览器 ESM 的原生支持

> 事实上: 对于大部分项目 (使用bundler工具的项目), 这些打包器会自动处理 commonjs 和 es 模块的互交互, 而常规的 node 的项目中, 使用 cjs 的用户能够使用 import() 来导入 es 模块, 在目前版本中, 甚至已经可以使用 `--experimental-require-module` 来实现 require(ESM) , 所以在未来乃至现在, 模块兼容性都不再是一个值得一提的问题了. 