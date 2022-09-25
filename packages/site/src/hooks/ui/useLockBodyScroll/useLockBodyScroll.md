---
title: useLockBodyScroll
group:
  path: /ui
---

# useLockBodyScroll

## 示例

<code src="./useLockBodyScroll.demo.tsx" />

## API

`const currentLocked = useLockBodyScroll(locked: boolean)`

**locked** - 锁定/恢复滚动条

**currentLocked** - 当前的真实锁定状态，当在不同地方使用多个 useLockBodyScroll 时, 锁定状态往往会和传入值不同
