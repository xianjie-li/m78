import React from "react";
/**
 * 将其作为要监听容器的子节点, 能够提供一个独立的MediaQuery上下文，其内部的所有MediaQuery会在此上下文中单独管理, 用于要为窗口以外的节点监听断点时
 * - MediaQueryContext会在容器内挂载一个用于计算尺寸的节点, 你需要容器的position为static以外的值
 * */
export declare const _MediaQueryContext: React.FC<{
    children: React.ReactNode;
}>;
//# sourceMappingURL=media-query-context.d.ts.map