import React from 'react';
/** 通用状态类型 */
export declare enum Status {
    info = "info",
    success = "success",
    warning = "warning",
    error = "error"
}
export declare type StatusKeys = keyof typeof Status;
export declare type StatusUnion = Status | StatusKeys;
/** 通用尺寸类型 40 | 32 | 24 */
export declare enum Size {
    large = "large",
    small = "small"
}
export declare type SizeKeys = keyof typeof Size;
export declare type SizeUnion = Size | SizeKeys;
/** 通用完整尺寸类型 */
export declare type FullSizeKeys = 'big' | SizeKeys;
/** 通用完整尺寸类型  */
export declare enum FullSize {
    large = "large",
    small = "small",
    big = "big"
}
export declare type FullSizeUnion = FullSize | FullSizeKeys;
/** 通用方向类型 */
export declare enum Position {
    left = "left",
    top = "top",
    right = "right",
    bottom = "bottom"
}
export declare type PositionKeys = keyof typeof Position;
export declare type PositionUnion = Position | PositionKeys;
/** 通用轴类型 */
export declare enum Direction {
    horizontal = "horizontal",
    vertical = "vertical"
}
export declare type DirectionKeys = keyof typeof Direction;
export declare type DirectionUnion = Direction | DirectionKeys;
/** 通用数据源类型 */
export interface DataSourceItem<ValType = any> {
    /** 选项名 */
    label: React.ReactNode;
    /** 选项值, 默认与label相同 */
    value: ValType;
}
export declare type DIVProps = React.PropsWithoutRef<JSX.IntrinsicElements['div']>;
//# sourceMappingURL=types.d.ts.map