import { _Context } from "./types.js";
/**
 * 对triggerType从click -> active变更做一下特殊处理
 * - 主要是让overlay能更方便的实现嵌套菜单(事件需要通过click打开, 然后切换为active, 具体可见menu组件)
 * */
export declare function _useTypeProcess(ctx: _Context): void;
//# sourceMappingURL=use-type-process.d.ts.map