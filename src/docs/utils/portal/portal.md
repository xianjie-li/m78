---
title: Portal - 传送门
group:
    title: 工具
    path: /utils
    order: 7000
---

# Portal 传送门

通过React.createPortal将子节点渲染到指定的dom中


## 基础示例
```tsx
import React from 'react';
import Portal from '@lxjx/fr/lib/portal';
import '@lxjx/fr/lib/portal/style';

export default () => (
    <div>
        <div>下面的内容会被挂载到实例节点外, 外部节点默认位于 <span className="fw-600">body > div#J__PORTALS__NODE__DEFAULT</span> 下</div>
        <Portal>
            <span>我是被Portal渲染的内容</span>
        </Portal>
    </div>
)
```

## 指定namespace
指定namespace后，children会被渲染到指定的节点中, 可以用来防止无关的两个组件渲染造成的干扰。

```tsx
import React from 'react';
import Portal from '@lxjx/fr/lib/portal';
import '@lxjx/fr/lib/portal/style';

export default () => (
    <div>
        <div>查看 <span className="fw-600">body > J__PORTALS__NODE__extra-node</span></div>
        <Portal namespace="extra-node">
            <span>我是被Portal渲染的内容</span>
        </Portal>
    </div>
)
```


## props
```tsx | pure
type PortalProps = React.FC<{ 
    /** 以指定namespace生成额外的Portal节点并渲染内容 */
    namespace?: string;
}>;
```









