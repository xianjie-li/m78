---
title: usePropsChange
---

# usePropsChange

compare props and prev props, return changed props

The main use case is to develop react components with the existing js version library

return null if equal or first render

## API

```ts
function usePropsChange<T extends Object = AnyObject>(
  props: T,
  options: {
    /** keys will skip */
    omit?: string[];
    /** keys will use deep equal */
    deepEqual?: string[];
  }
): T | null;
```
