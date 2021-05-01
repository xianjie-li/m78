import React from 'react';
interface M78SeedState {
    /** 黑暗模式 */
    darkMode?: boolean;
    /** 全局配置Empty组件的空状态图片 */
    emptyNode?: React.ReactElement;
    /** Picture组件加载图片错误时的默认占位图 */
    pictureErrorImg?: string;
}
declare const m78Config: import("../seed/type").ExpandSeed<M78SeedState, import("@m78/seed/types").Validators<M78SeedState>>;
export { m78Config };
