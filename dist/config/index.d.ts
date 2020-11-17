import React from 'react';
export interface FrConfig {
    /** empty组件的空状态图片 */
    emptyNode?: React.ReactElement;
    /** Picture组件加载图片错误时的默认占位图 */
    pictureErrorImg?: string;
}
declare function useConfig(): FrConfig;
declare const _default: {
    context: React.Context<FrConfig>;
    Provider: React.Provider<FrConfig>;
    Consumer: React.Consumer<FrConfig>;
    useConfig: typeof useConfig;
};
export default _default;
