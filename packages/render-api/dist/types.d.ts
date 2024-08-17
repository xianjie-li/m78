import { createEvent } from "@m78/hooks";
import React from "react";
import { AnyFunction } from "@m78/utils";
/**
 * 一个更包容的组件接收器类型
 * */
export type ComponentType<P = any> = React.ComponentType<P> | AnyFunction;
/**
 * 实现组件的标准props, 实现组件可以选择继承此接口
 *
 * 若实现组件自定义了自定义open/onChange key则应该继承RenderApiComponentBaseProps
 * */
export interface RenderApiComponentProps<S, I = null> extends RenderApiComponentBaseProps<S, I> {
    /** 是否显示 */
    open?: boolean;
    /** open状态变更时通知父组件 */
    onChange?: (cur: boolean) => void;
}
/**
 * 实现组件会接受的基础props, 实现组件可以以此类型作为基础props
 * */
export interface RenderApiComponentBaseProps<S, I = null> {
    /** 通知上层组件销毁本组件的实例 */
    onDispose?: () => void;
    /** 更新state, 使用此回调来通知外部组件更新传递给自身的state */
    onUpdate?: RenderApiComponentInstanceBase<S>["setState"];
    /** 当需要对外暴露更多的api时使用, 将额外的api挂载到此ref, 挂载内容会展开到组件实例上, 如果与现有api重名, 现有api将被覆盖 */
    instanceRef?: React.Ref<I>;
}
/** create() 方法接收的配置对象 */
export interface RenderApiOption<S> {
    /** 交由api渲染的组件 */
    component: ComponentType<RenderApiComponentBaseProps<any>>;
    /** 默认state状态，会和render(state)时传入的state合并 */
    defaultState?: Partial<RenderApiOmitBuiltState<S>>;
    /** 将实例渲染到指定命名空间的节点下, 而不是使用默认的命名空间 */
    namespace?: string;
    /** 包装组件，如果你的实现组件依赖于特定的布局，可以通过传递此项来包裹它们 */
    wrap?: ComponentType;
    /** 最大实例数，当渲染的组件数超过此数值时，会将最先进入的实例移除 */
    maxInstance?: number;
    /** 'open' | 自定义控制组件显示/隐藏的props key */
    openKey?: string;
    /** 'onChange' | 自定义open变更进行通知的方法 */
    changeKey?: string;
    /** 用于在调用render时过滤掉一些不想接收的state, 会以返回的state传递给render(state) */
    omitState?: (state: Partial<RenderApiOmitBuiltState<S>>) => Partial<RenderApiOmitBuiltState<S>>;
}
/** api实例，通过create()方法创建 */
export interface RenderApiInstance<S, I> {
    /** 渲染一个组件实例, 返回创建的实例 */
    render: (state: RenderApiOmitBuiltState<S>) => RenderApiComponentInstance<S, I>;
    /**
     * 实例的挂载组件，一般会放在组件树的根节点下，并且应该避免其被延迟渲染
     * - 此组件存在的目的是保证外部渲染的组件实例能够被解析到主react实例树中从而使得React context等api正常可用
     * - 挂载位置与渲染位置无关，最终都会渲染到body下
     * - 如果RenderTarget在第一次运行render时仍没有被挂载, 则会将其默认挂载到body下
     * */
    RenderTarget: ComponentType;
    /** 关闭全部实例 */
    closeAll: () => void;
    /** 开启全部实例 */
    openAll: () => void;
    /** 销毁全部实例 */
    disposeAll: () => void;
    /** 获取所有实例的列表 */
    getInstances: () => Array<RenderApiComponentInstance<S, I>>;
    /** 可用事件对象 */
    events: {
        /** 实例发生可能会影响ui的改变时触发的事件, 通常是新增/移除实例 */
        change: ReturnType<typeof createEvent>;
    };
    /**
     * 更改create()时传入的配置, 只有白名单内的配置可以更改
     * whiteList: ['defaultState', 'wrap', 'maxInstance']
     * */
    setOption: (opt: Pick<RenderApiOption<S>, "defaultState" | "wrap" | "maxInstance">) => void;
    /**
     * 获取正在使用的配置
     * */
    getOption: () => RenderApiOption<S>;
}
/** render组件基础实例, 调用render()后生成 */
export interface RenderApiComponentInstanceBase<S> {
    /** 隐藏 */
    close: () => void;
    /** 显示 */
    open: () => void;
    /** 销毁 */
    dispose: () => void;
    /** 渲染组件的state */
    state: S;
    /** 更新渲染组件的state */
    setState: (nState: Partial<RenderApiOmitBuiltState<S>>) => void;
}
/**
 * render组件实例, 调用render()后生成
 *
 * I 为实例组件对外暴露的属性和方法
 * */
export type RenderApiComponentInstance<S, I> = RenderApiComponentInstanceBase<S> & I;
/** 内部使用的实例的元信息 */
export interface _ComponentItem {
    /** 组件/实例的唯一id */
    id: string;
    state: any;
    instance: RenderApiComponentInstance<any, any>;
    /** 更新标记, 用于最大程度的避免不需要的re-render */
    updateFlag: number;
}
/**
 * 过滤掉内部属性的state
 * */
export type RenderApiOmitBuiltState<S> = Omit<S, "open" | "onChange" | "onDispose" | "onUpdate" | "instanceRef">;
//# sourceMappingURL=types.d.ts.map