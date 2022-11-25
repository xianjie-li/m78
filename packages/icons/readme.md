
转换了 `@material-design-icons/svg` 所有图标为react组件, 便于按需导入使用

使用方式:

```ts
import { TowToneWash } from "@m78/icons/two-tone-wash"
```

> 所有组件仅包含空的类型声明, 减少对用户编辑器造成的负担

转换/更新图标

```shell
pnpm transform-icon & pnpm build
```

!! 不要直接编辑src目录, 此目录为自动生成
