import { Seed } from '@m78/seed';
import { Permission } from './types';

/**
 * 权限模板
 *
 * 权限模板格式如: `module:keys`
 * - name为权限所属模块
 * - keys为具体的权限
 *
 * 模板中可以使用一些DSL语法, 比如:
 * - user:create&update
 * - user:create|update
 * - user:create&update|delete
 * - user:create&(update|update2)
 * */
export type PermissionProTpl = string;

/**
 * 描述权限的对象
 * */
export type PermissionProSchema = {
  [key: string]: string[];
};

/**
 * PermissionProAST中允许出现的类型
 * */
export enum _PermissionProPieceType {
  key,
  and,
  or,
  leftBrackets,
  rightBrackets,
}

/**
 * PermissionProAST的组成部分
 * */
export interface _PermissionProPiece {
  key?: string;
  type: _PermissionProPieceType;
}

/** 描述单个验证模板的简单语法树 */
export type _PermissionProAST = Array<_PermissionProPiece | Array<_PermissionProPiece>>;

/**
 * 用于描述一项权限的元信息
 * */
export interface PermissionProMeta {
  /** 权限名 */
  label: string;
  /** 标识权限的唯一key */
  key: string;
  /** 其他, 用于扩展字段 */
  [key: string]: any;
}

/** 用于描述验证失败的元信息 */
export type PermissionProRejectMeta =
  | null
  | {
      /** 所属模块名称 */
      label: string;
      /** 模块的key */
      module: string;
      /** 缺失的权限 */
      missing: PermissionProMeta[];
    }[];

/**
 * meta配置
 * */
export interface PermissionProMetaConfig {
  /** 通用配置, 如果modules中没有匹配则使用这里的配置 */
  general?: PermissionProMeta[];
  /** 每个模块独立的配置, 可以是权限信息数组或包含module名的对象 */
  modules?: {
    [key: string]:
      | PermissionProMeta[]
      | {
          /** 模块名 */
          label?: string;
          list?: PermissionProMeta[];
        };
  };
  /** 用于在验证meta生成前对其改写 */
  each?: (meta: PermissionProMeta) => PermissionProMeta;
}

/** PermissionPro实例 */
export interface PermissionPro {
  /** 执行验证, 如果验证失败, 返回缺失权限组成的数组, 如果数组项为数组则表示逻辑 `or` */
  check: (keys: Array<PermissionProTpl | PermissionProTpl[]>) => PermissionProRejectMeta;
  /** 内部使用的seed实例 */
  seed: Seed<_PermissionProSeedState>;
  /** 内部使用的常规版permission实例 */
  permission: Permission<_PermissionProSeedState>;
}

export interface _PermissionProSeedState {
  permission: PermissionProSchema;
  meta?: PermissionProMetaConfig;
}

/**
 * PermissionPro的创建配置
 * */
export interface PermissionProConfig {
  /** 初始权限 */
  permission?: PermissionProSchema;
  /**
   * 对权限进行详细描述的配置, 不设置时通过key来生成验证失败的信息
   * - 此配置用来为权限附加更多的可用信息, 如权限名, 权限描述, 可用的操作等等, 方便使用者通过这些信息创建更友好的失败反馈.
   * */
  meta?: PermissionProMetaConfig;
  /** 内部使用的的seed, 如果创建pro时传入了seed则两者是相同的 */
  seed?: Seed;
}

/**
 * PermissionPro实例创建器
 * */
export interface PermissionProCreator {
  (config: PermissionProConfig): PermissionPro;
}
