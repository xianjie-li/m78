---
title: Portal - 传送门
---

便捷的通过 `React.createPortal` 将子节点渲染到 body 最外层

```tsx
import { Portal } from "m78";

// 每个portal需要提供一个唯一的namespace
<Portal namespace="portal-01">
  <div>I am Groot!</div>
</Portal>;
```
