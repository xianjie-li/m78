import { BoundSize, TupleNumber, type AnyObject } from "@m78/utils";
import { _eventImpl } from "./event.js";
/** 存在冲突事件时, 配置事件的覆盖策略, 主要针对虚拟位置事件 */
export declare enum TriggerOverrideStrategy {
    /** 持久事件的独占权, 若存在多个possess事件, 取最后注册的 */
    possess = 0,
    /** 跳过当前事件, 转移执行权 */
    transfer = 1,
    /** 允许和其他非possess事件并行执行 */
    parallel = 2
}
/**
 * 用于配置在特定事件下的光标显示类型
 *
 * 光标样式挂载在html节点, 若事件节点包含自定义或预设光标样式, 需为其设置css: cursor: "inherit", 防止干扰
 *  */
export interface TriggerCursorMap {
    /** active触发时 */
    active?: string;
    /**
     * 可拖动节点的active状态, 优先级高于 active
     *
     * 注: 启用active事件后生效
     *  */
    dragActive?: string;
    /** 拖动过程中 */
    drag?: string;
}
/**
 * 事件项的配置对象, 此对象属性均是可变的, 如果你修改了对象内容, 则后续事件中会使用修改后的内容
 * */
export interface TriggerOption {
    /** 事件的触发目标, dom节点或一个虚拟的位置 */
    target: HTMLElement | BoundSize;
    /** 需要绑定的事件类型 */
    type: TriggerType | TriggerType[];
    /** 事件处理程序 */
    handler: TriggerListener;
    /** 控制事件是否启用, 由于会频繁调用, 不应包含复杂逻辑 */
    enable?: boolean | ((data: TriggerTargetData) => boolean);
    /** 控制在特定事件下的光标类型 */
    cursor?: TriggerCursorMap;
    /** 可在此存放一些自定义信息, 并在Event中访问 */
    data?: any;
    /**
     * 限制拖动边界, 此配置影响事件对象上的 movement, distance
     *
     * > note: 依赖于target的当前位置, 必须在事件回调中正确的更新了target的位置(无论是dom节点还是虚拟位置), 才能此配置生效
     *  */
    dragBound?: BoundSize;
    /** 0 | 事件级别, 较大的目标会覆盖较小目标的事件, 若最大级别下包含多个target, 则这些target会根据覆盖规则触发事件 */
    level?: number;
    /** parallel | 同一level下有多个相同类型的事件触发时, 配置事件的覆盖策略 */
    overrideStrategy?: TriggerOverrideStrategy;
}
/** TriggerOption的包装类型, 包含了一些额外信息 */
export interface TriggerTargetData {
    /** 为true表示该项target是一个虚拟事件目标, 为false时为真实的dom节点 */
    isVirtual: boolean;
    /** 该项的位置 */
    bound: BoundSize;
    /** 事件目标dom, 需断言isVirtual为false时可用 */
    dom: HTMLElement;
    /** 用来便捷的检测指定类型事件是否启用 */
    typeMap: Map<TriggerType, boolean>;
    /** 与默认cursor配置合并后的配置对象 */
    cursor: TriggerCursorMap;
    /** 原始事件对象, 引用与原始对象一致 */
    option: TriggerOption;
}
/** 支持的事件类型 */
export declare enum TriggerType {
    /** 点击 */
    click = "click",
    /**
     * 根据不同的事件源, 触发方式不同:
     * - 支持光标的设备, 在鼠标移动到上方时触发
     * - 支持touch的设备, 短暂按住后触发, 与contextMenu在触控设备下触发方式相同, 区别是active会在松开手指后关闭
     * */
    active = "active",
    /** 获取焦点和失去焦点, 仅dom类型的target有效 */
    focus = "focus",
    /**
     * 根据不同的事件源, 触发方式不同:
     * - 支持光标的设备表现为右键点击
     * - 支持touch的设备, 短暂按住后触发, 与active在触控设备下触发方式相同, 区别是active会在松开手指后关闭
     * */
    contextMenu = "contextMenu",
    /** 光标或触摸点在目标上方移动 */
    move = "move",
    /** 对目标进行拖动 */
    drag = "drag"
}
export type TriggerTypeKeys = keyof typeof TriggerType;
export type TriggerTypeUnion = TriggerTypeKeys | TriggerType;
export interface TriggerInstance {
    /** 启用或禁用所有事件 */
    enable: boolean;
    /** 是否正在拖拽中 */
    dragging: boolean;
    /** 当前是否有active状态节点 */
    activating: boolean;
    /** 当前是否有move状态节点 */
    moving: boolean;
    /** 是否有持续性事件正在运行, 即 dragging / activating / moving 任意一项为true */
    running: boolean;
    /**
     * 新增单个或多个事件配置, 可传入一个唯一的key将配置分组, 并在后续通过相同的key可以通过批量移除事件或是获取指定分组的事件信息
     *
     * - 事件对象的引用是事件本身的标识, 在进行移除事件等操作时, 皆以应用为准
     * - 每个配置对象在移除前只能通过on添加一次, 重复添加会导致预期外的行为
     *  */
    on(opt: TriggerOption | TriggerOption[], key?: string): void;
    /** 根据key或事件选项移除事件配置, 若事件通过key添加, 则只能通过key移除 */
    off(opt: TriggerOption | TriggerOption[]): void;
    /** 通过绑定事件时的key批量移除 */
    off(key: string): void;
    /** 清空事件配置 */
    clear(): void;
    /** 事件配置总数 */
    size(): number;
    /** 获取可用事件目标的数据 */
    getTargetData(args: {
        /** 指定要获取事件的点 */
        xy?: TupleNumber;
        /** 指定触发事件的dom节点, 若同时传入xy, 会先通过xy过滤, 再通过dom检测节点, 能够提升一定的性能 */
        dom?: HTMLElement;
        /** 指定事件类型, 非对应类型的事件被过滤 */
        type?: TriggerType | TriggerType[];
        /** 分组key, 传入时, 只获取该分组的事件 */
        key?: string;
        /** 可在确认事件列表前对其进行再次过滤, 使用此参数而不是直接获取返回结果过滤是因为, 其在 overrideStrategy / level 等配置处理前执行, 通过filter能够使这些配置能正常作用 */
        filter?: (data: TriggerTargetData) => boolean;
    }): TriggerTargetData[];
}
export type TriggerListener = (e: TriggerEvent) => void;
/** 事件对象, 特定属性仅在其指定的事件类型中生效, 其他时候会是它们的初始值 */
export interface TriggerEvent {
    /** 事件类型 */
    type: TriggerType;
    /** 原生事件对象 */
    nativeEvent: Event;
    /** 是否是事件开始 */
    first: boolean;
    /** 是否是事件结束 */
    last: boolean;
    /** 事件对应的配置对象 */
    target: TriggerOption;
    /** 事件对象中配置的TriggerOption.data */
    data: any;
    /** 根据事件信息产生的额外信息 */
    eventMeta: TriggerTargetData;
    /** 触发时间, 注: 一些事件存在开始或结束延迟, 发生延迟时, timeStamp 为不计入延迟的时间 */
    timeStamp: number;
    /** 触发位置相对屏幕的x坐标 */
    x: number;
    /** 触发位置相对屏幕的y坐标 */
    y: number;
    /** 触发位置相对目标左上角的x坐标 */
    offsetX: number;
    /** 触发位置相对目标左上角的y坐标 */
    offsetY: number;
    /** 是否处于active状态 */
    active: boolean;
    /** 是否处于focus状态 */
    focus: boolean;
    /** 用于检测focus是否是由直接点击触发 */
    isTapFocus: boolean;
    /** 该次拖动期间移动的总距离 */
    movementX: number;
    /** 该次拖动期间移动的总距离 */
    movementY: number;
    /** 相对上一次触发移动的距离 */
    deltaX: number;
    /** 相对上一次触发移动的距离 */
    deltaY: number;
    /** 事件目标绑定到现在拖拽的总距离 */
    distanceX: number;
    /** 事件目标绑定到现在拖拽的总距离 */
    distanceY: number;
    [key: string]: any;
}
export interface _TriggerContext {
    /**
     * 存放所有注册的事件
     * - 字符串key表示事件组, 其value为事件组组成的map
     * - option key表示单个注册的事件, 其事件项为单个对象
     *
     * 以上行为由代码层面约束
     *  */
    optionMap: Map<TriggerOption | string, TriggerOption | Map<TriggerOption, TriggerOption>>;
    /** 用于在内部以option为key存储一些跨多次事件共享的数据, 会在事件卸载时清理 */
    keepAliveData: Map<TriggerOption, AnyObject>;
    /** 存放所有事件的列表, 每次事件列表变更时更新 */
    optionList: TriggerOption[];
    /** 尚未初始化完成的trigger */
    trigger: TriggerInstance;
    /** 在触控设备的active或类似事件中, 需要防止触发默认的上下文菜单, 可通过此标记通知contextMenu事件 */
    shouldPreventDefaultContextMenu: boolean;
    /** event实现对外暴露的内容 */
    event: ReturnType<typeof _eventImpl>;
    /**
     * 获取指定事件坐标的有效事件配置数据
     * - list 所有与type匹配的 _TriggerTargetData
     * - optList 所有与type匹配的 TriggerOption
     * - eventList 所有xy点的 TriggerTargetData 信息, 并且对 level 和 overrideStrategy 进行了处理, 去掉了被覆盖项
     */
    getEventList(args: {
        /** 指定要获取事件的点 */
        xy?: TupleNumber;
        /** 指定触发事件的dom节点, 若同时传入xy, 会先通过xy过滤, 再通过dom检测节点, 能够提升一定的性能 */
        dom?: HTMLElement;
        /** 指定事件类型, 非对应类型的事件被过滤 */
        type?: TriggerType | TriggerType[];
        /** 分组key, 传入时, 只获取该分组的事件 */
        key?: string;
        /** 可在确认事件列表前对其进行再次过滤, 使用此参数而不是直接获取返回结果过滤是因为, 其在 overrideStrategy / level 等配置处理前执行, 通过filter能够使这些配置能正常作用 */
        filter?: (data: TriggerTargetData) => boolean;
        /** 在同时传入dom和xy时, 需要xy通过后才会对比dom, 可以设置此项为true来使xy检测可选 */
        looseXYCheck?: boolean;
    }): {
        list: TriggerTargetData[];
        optList: TriggerOption[];
        eventList: TriggerTargetData[];
    };
    /** 根据传入的 TriggerTargetData 获取其最新的 TriggerTargetData, 用于持续性的事件中更新对象本身 */
    updateTargetData(data: TriggerTargetData): TriggerTargetData;
    /** 从 TriggerOption 获取 _TriggerTargetData */
    getDataByOption(opt: TriggerOption, typeMap?: Map<TriggerType, boolean>): TriggerTargetData;
    /** 清理所有未开始/未完成的事件, 会将conf中类型key为true的未完成事件全部结束 */
    clear: () => void;
    /** 在所有事件触发时调用, 用于统一处理光标样式等场景 */
    handleEvent(e: TriggerEvent): void;
}
//# sourceMappingURL=types.d.ts.map