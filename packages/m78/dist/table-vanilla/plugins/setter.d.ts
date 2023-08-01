import { TablePlugin } from "../plugin.js";
import { _TableEventPlugin } from "./event.js";
export declare class _TableSetterPlugin extends TablePlugin implements TableSetter {
    /** 用于滚动优化 */
    event: _TableEventPlugin;
    beforeInit(): void;
    init(): void;
    setHeight(height: number | string): void;
    setWidth(width: number | string): void;
    setX(x: number): void;
    setY(y: number): void;
    setXY(x: number, y: number): void;
}
export interface TableSetter {
    /** 更新x */
    setX(x: number): void;
    /** 更新y */
    setY(y: number): void;
    /** 更新xy */
    setXY(x: number, y: number): void;
    /** 设置宽度 */
    setWidth(width: number | string): void;
    /** 设置高度 */
    setHeight(height: number | string): void;
}
//# sourceMappingURL=setter.d.ts.map