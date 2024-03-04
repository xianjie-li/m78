import React from "react";
/**
 *  支持对deps进行深度对比的`useEffect`
 *  💡保持deps值结构相对简单能够减少对比深度，从而提高性能
 *  @param effect - 同useEffect参数
 *  @param deps - 依赖数组，用法与useEffect一致，但是会对dep项执行深对比
 * */
export declare function useEffectEqual(effect: React.EffectCallback, deps?: any[]): void;
//# sourceMappingURL=use-effect-equal.d.ts.map