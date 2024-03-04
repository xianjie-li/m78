import { FormConfig, FormInstance, FormVerifyInstance } from "./types.js";
/** 创建form实例 */
export declare function _createForm(config: FormConfig): FormInstance;
/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 能够避免form相关的多余计算
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */
export declare function _createVerify(config: FormConfig): FormVerifyInstance;
//# sourceMappingURL=main.d.ts.map