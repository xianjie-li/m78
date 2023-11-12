---
title: useToggle
group:
  path: /state
  order: 3
---

# useToggle

便捷的维护一个开关状态

## 示例

<Demo demo={require("./useToggle.demo.tsx")} code={require("!!raw-loader!./useToggle.demo.tsx")}></Demo>

## API

`init`默认值为`true`

**`function useToggle(init?: boolean): readonly [boolean, (next?: boolean) => void)]`**
