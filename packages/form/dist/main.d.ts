import { FormConfig, FormInstance, FormVerify } from "./types.js";
/**
 * defaultValue -> value
 * verify移除
 * Verify类型更名 添加Form前缀
 * meta修改
 * 错误处理方式修改
 * 验证器key 私有化
 * */
/** 创建form实例 */
export declare function _createForm(config: FormConfig): FormInstance;
/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 在数据体量较大时能显著提升执行速度
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */
export declare function _createVerify(config: FormConfig): FormVerify;
//# sourceMappingURL=main.d.ts.map