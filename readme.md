## 工作流

### 包管理器

使用`pnpm`作为包管理器, 并使用其内置的`monorepo`功能, 为了更好的兼容性, 项目全局启用了 `shamefully-hoist`

### 版本发布

进入对应的子包, 修改`package.json`版本, 然后执行`pnpn pub`
