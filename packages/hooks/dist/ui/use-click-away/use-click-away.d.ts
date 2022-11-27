/// <reference types="react" />
import { DomTarget } from "../../index.js";
export interface UseClickAwayConfig {
    /** 触发回调, e取决于events配置, 用户可根据events自行进行类型断言 */
    onTrigger: (e: Event) => void;
    /** 监听目标, 可以是单个或多个DOM/包含DOM的react ref */
    target?: DomTarget | DomTarget[];
    /** ['mousedown', 'touchstart'] | 要触发的事件 */
    events?: string[];
}
export declare function useClickAway({ target, events, onTrigger, }: UseClickAwayConfig): import("react").MutableRefObject<any>;
//# sourceMappingURL=use-click-away.d.ts.map