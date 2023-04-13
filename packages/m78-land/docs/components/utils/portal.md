---
title: Portal - 传送门
---

便捷的通过 `React.createPortal` 将子节点渲染到指定的 `dom` 中

```ts
import { Portal } from "m78";

function Portal({
  children,
  namespace,
}: React.FC<{
  namespace?: string;
  children?: React.ReactNode;
}>): ReactPortal;
```
