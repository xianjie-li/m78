import { AnyFunction, CustomEvent } from "@m78/utils";
export interface CustomEventWithHook<Listener extends AnyFunction> extends CustomEvent<Listener> {
    useEvent(listener: Listener): void;
}
/** 增强一个现有事件对象 */
export declare function enhance<Listener extends AnyFunction = AnyFunction>(event: CustomEvent<Listener>): CustomEventWithHook<Listener>;
/**
 * 自定义事件，用于多个组件间或组件外进行通讯
 * */
declare function createEvent<Listener extends AnyFunction = AnyFunction>(): CustomEventWithHook<Listener>;
declare namespace createEvent {
    var enhance: typeof import("./use-event").enhance;
}
export { createEvent };
//# sourceMappingURL=use-event.d.ts.map