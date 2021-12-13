---
title: Config - 全局配置
group:
  title: 工具包
  path: /utils
  order: 5000
---

# Config - 全局配置

全局性的控制组件的一些表现和行为
  
config本身是一个[seed](/docs/utils/seed), 可以使用seed的所有api

目前支持的配置如下:
```ts
interface M78SeedState {
  /** 黑暗模式 */
  darkMode?: boolean;
  /** empty组件特有配置 */
  empty: {
    /** 全局配置Empty组件的空状态图片 */
    emptyNode?: React.ReactElement;
  };
  picture: {
    /** Picture组件加载图片错误时的默认占位图 */
    errorImg?: string;
  };
}
```

通过`seed api`来获取和更新状态
```ts
const darkMode = seed.get().darkMode;

seed.set({ darkMode: !darkMode })
```

