import { Permission, CreatePermissionConfig, Validator, Validators, ValidMeta } from "./types.js";
import { _PermissionProSeedState, _PermissionProAST, PermissionProMetaConfig, PermissionProTpl } from "./proType.js";
export declare const throwError: (str: string) => never;
/**
 * 传入验证key、验证器列表、依赖数据、额外数据。对该key进行验证后返回验证结果(void 或 ValidMeta)
 * */
export declare const validItem: (key: string, validators: Validators<any>, state: any, extra: any) => void | ValidMeta;
/**
 * 实现Permission api
 * */
export declare function permissionImpl(conf: CreatePermissionConfig): Permission;
/**
 * ###############################################
 *                      Pro
 * ###############################################
 * */
/**
 * 将PermissionTpl转换为PermissionProAST, 如果格式错误则抛出异常
 * 首尾为特殊字符时异常
 * */
export declare function permissionProTplParser(tpl: PermissionProTpl): readonly [string, _PermissionProAST];
/** 权限实现的主验证器key */
export declare const PERMISSION_PRO_NAME = "PERMISSION_PRO";
/**
 * PermissionPro内置验证器
 * */
export declare function permissionProValidatorGetter(): Validator<_PermissionProSeedState>;
/** 对一个PermissionProAST执行验证 */
export declare function checkAST(ast: _PermissionProAST, permission: _PermissionProSeedState["permission"], mod: string, isFirst: boolean, meta?: PermissionProMetaConfig): {
    pass: any;
    result: any;
};
//# sourceMappingURL=common.d.ts.map