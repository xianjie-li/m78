import { NameItem, NamePath } from "@m78/utils";
import { _Context, _State, FormNamesNotify } from "./types.js";
/** 获取指定name的state, 状态对象还不存在时会自动进行创建 */
export declare function _getState(ctx: _Context, name: NamePath): _State;
/** 遍历已存在的所有state */
export declare function _eachState(ctx: _Context, cb: (st: _State) => void): void;
/** 根据values递归为其设置或初始化state */
/**
 * 用于创建update/change事件回调的过滤器, 只在name对应的值发生变化时才会触发回调,
 * 若传入deps, deps中指定的值发生变化时也会触发回调
 * */
export declare function _notifyFilter(name: NamePath, notify: FormNamesNotify, deps?: NamePath[]): FormNamesNotify;
/** 用于namePath路径的通配占位, 匹配eachSchema等没有name的层级 */
export declare const _ANY_NAME_PLACE_HOLD = "__ANY_NAME_PLACE_HOLD__";
/** 用于在某些情况作为根schema的name标注 */
export declare const _ROOT_SCHEMA_NAME = "__ROOT_SCHEMA_NAME__";
/** 递归删除指定的namePath值, 支持在namePath中使用ANY_NAME_PLACE_HOLD进行通配占位 */
export declare function _recursionDeleteNamePath(values: any, names: NamePath): void;
/** 数组1是否与数组2的左侧相等或完全相等 */
export declare function _isLeftEqualName(arr1: any[], arr2: any[]): boolean;
export declare function _isRelationName(n: NameItem[], n2: NameItem[]): boolean;
/** 从listState中获取指定name的子级, 每次命中会触发回调, 也可以使用返回值 */
export declare function _getListChild(ctx: _Context, name: NamePath, eachCB?: (nameString: string, name: NamePath) => void): NamePath[];
/** 移除当前name和其子级的所有listState, 触发关联更新 */
export declare function _clearChildAndSelf(ctx: _Context, name: NamePath): void;
/** 同步指定list下所有关联的list项name索引, newIndex为当前索引到新索引的映射, 比如[0,2,1]表示, 原本索引2的元素移动到中间 */
export declare function _syncListIndex(ctx: _Context, name: NamePath, newIndex: number[]): void;
//# sourceMappingURL=common.d.ts.map