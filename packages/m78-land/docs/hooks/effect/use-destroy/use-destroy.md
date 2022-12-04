---
title: useDestroy
---

# useDestroy

用于在组件卸载时执行清理操作

```ts
import { useDestroy } from "./use-destroy.js";

useDestroy(() => {
  console.log("clean");
});
```
