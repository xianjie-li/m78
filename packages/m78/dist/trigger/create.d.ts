import "./index.scss";
import { TriggerInstance, TriggerConfig } from "./types.js";
/**
 * 事件触发器, 可在dom或虚拟位置上绑定事件, 支持大部分常用事件, 相比原生事件更易于使用
 *
 * 对于有拖拽行为的事件, 始终应该为对应节点添加 .m78-touch-prevent , 反正原生行为的干扰
 * */
export declare function _create(config: TriggerConfig): TriggerInstance;
//# sourceMappingURL=create.d.ts.map