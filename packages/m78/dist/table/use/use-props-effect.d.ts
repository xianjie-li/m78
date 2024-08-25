import { RCTableProps } from "../types.js";
/** 处理props变更, 尽可能减少不必要的更新, 特别是引用类型的props, 并在处理后将table props转换为vanilla table config */
export declare function _usePropsEffect(props: RCTableProps, cb: (props: Partial<RCTableProps>, needFullReload: boolean) => void): RCTableProps | null;
//# sourceMappingURL=use-props-effect.d.ts.map