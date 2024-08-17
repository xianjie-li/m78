import { RefObject } from "react";
import { type ScrollTriggerInstance, type ScrollTriggerOption, type ScrollTriggerState } from "../scroll/scroll.js";
/** 用于use-scroll的创建配置 */
export interface UseScrollTriggerOption extends Omit<ScrollTriggerOption, "target" | "handle"> {
    /** 传入要绑定的滚动元素或ref, 也可以通过useScroll返回的instance.ref绑定到dom */
    el?: HTMLElement | RefObject<any>;
    /** 滚动时触发 */
    onScroll?(meta: ScrollTriggerState): void;
}
/** use-scroll扩展后的ScrollTrigger实例 */
export interface UseScrollTriggerInstance<ElType extends HTMLElement> extends ScrollTriggerInstance {
    /** 可使用此项代替option.el进行绑定 */
    ref: RefObject<ElType>;
}
export declare function useScroll<ElType extends HTMLElement>(option: UseScrollTriggerOption): UseScrollTriggerInstance<ElType>;
//# sourceMappingURL=use-scroll.d.ts.map