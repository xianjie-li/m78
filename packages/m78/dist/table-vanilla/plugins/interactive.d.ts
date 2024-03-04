import { TablePlugin } from "../plugin.js";
import { TableCell, TableCellWithDom } from "../types/items.js";
import { KeyboardMultipleHelper } from "@m78/utils";
import { _TableFormPlugin } from "./form.js";
import { _TableDisablePlugin } from "./disable.js";
/**
 * 提供单元格双击交互功能, 用于实现交互期间展示表单控件或其他交互组件, 是在form的上做的一层抽象, 并非一定用于form
 * */
export declare class _TableInteractivePlugin extends TablePlugin {
    items: TableInteractiveItem[];
    wrapNode: HTMLElement;
    doubleClickLastCell: TableCell | null;
    doubleClickTimer: any;
    lastDownTime: number;
    multipleHelper: KeyboardMultipleHelper;
    form: _TableFormPlugin;
    disable: _TableDisablePlugin;
    init(): void;
    mounted(): void;
    beforeDestroy(): void;
    rendering(): void;
    rendered(): void;
    private getKeydownOptions;
    private initDom;
    private onAttachClick;
    private onClick;
    isInteractive(cell: TableCell): boolean | undefined;
    /** 使一个单元格进入交互状态, 可通过defaultValue设置交互后的起始默认值, 默认为当前单元格value */
    private interactive;
    private updateNode;
    private hideInvisibleInteractive;
    private closeAll;
    private createAttachNode;
    private onTabDown;
    private onEnterDown;
    private onEscDown;
    private isJustDoneExecuted;
}
/** 表示交互完成后要执行的操作 */
export type TableInteractiveDone = (isConfirm: boolean) => void | Promise<void>;
/** 交互组件渲染参数 */
export interface TableInteractiveRenderArg {
    /** 触发交互的单元格 */
    cell: TableCellWithDom;
    /** 用于挂载交互组件的dom节点 */
    node: HTMLElement;
    /** 表单控件应显示的默认值 */
    value: any;
    /** isConfirm = true | 手动结束交互, 比如在用户按下enter时
     * isConfirm为true时表示该操作被确认, done应该在事件回调等位置调用, 不能在render流程中调用
     * */
    done: (isConfirm?: boolean) => void;
}
/** 交互配置 */
export interface TableInteractiveConfig {
    /** 控制单元格是否可交互 */
    interactive?: boolean | ((cell: TableCell) => boolean);
    /**
     * 渲染交互组件, 交互组件挂载于attachNode上, 并且应在交互完成或关闭时调用arg.done()来结束交互状态
     *
     * 返回的TableInteractiveDone会在交互结束清理attachNode前执行, 可用于实际更新值或者执行清理操作, 如果清理需要异步完成, 或者
     * 包含关闭动画, 可以返回一个Promise, 内部将等待Promise完成后再清理attachNode
     *
     * arg.done()和TableInteractiveDone()都接收isConfirm参数, 用于识别是确认操作还是取消操作
     * */
    interactiveRender?: (arg: TableInteractiveRenderArg) => TableInteractiveDone;
}
interface TableInteractiveItem {
    cell: TableCell;
    node: HTMLElement;
    mounted?: boolean;
    unmounted?: boolean;
    done(isConfirm?: boolean): void;
}
export {};
//# sourceMappingURL=interactive.d.ts.map