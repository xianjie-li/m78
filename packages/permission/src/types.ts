import { AnyObject } from '@lxjx/utils';
import { Seed } from '@m78/seed';

/**
 * 验证失败时提供给用户的一组操作(仅作为约定，可以根据需要扩展)
 * */
// export interface Action {
//   /** 操作名称 */
//   label: string;
//   /** 可以扩展异常处理方法(handler)，渲染类型(link)等，帮助控制具体的显示 */
//   [key: string]: any;
// }

/** 验证器返回的结果 */
export interface ValidMeta {
  /** 该权限名称 */
  label: string;
  /** 可以扩展异常处理方法(handler)，渲染类型(link)等，帮助控制具体的显示 */
  [key: string]: any;
  // /** 该权限的文字描述 */
  // desc?: string;
  // /** 验证失败时提供给用户的一组操作 */
  // actions?: Action[];
}

/** 验证器, 一旦验证器返回了ValidMeta则该次验证视为不通过 */
export interface Validator<S> {
  (state: S, extra?: any): ValidMeta | void;
}

export interface Validators<S = AnyObject> {
  [key: string]: Validator<S>;
}

/** 用于验证的keys */
export type PermissionKeys<V, C = AnyObject> = Array<keyof (V & C) | Array<keyof (V & C)>>;

export interface PermissionConfig<S = AnyObject> {
  /** 传递给验证器的额外参数, 比如用户id */
  extra?: any;
  /** 局部验证器 */
  validators?: Validators<S>;
}

/**
 * Permission实例
 * */
export interface Permission<S = AnyObject, V = AnyObject> {
  /**
   * @param keys - 所属权限, 如果数组项为数组则表示逻辑 `or`
   * @return validMeta - 验证结果，如果验证通过则为null
   * */
  (keys: PermissionKeys<V>): ValidMeta[] | null;
  /**
   * @param keys - 所属权限, 如果数组项为数组则表示逻辑 `or`
   * @param config - 配置
   * @return validMeta - 验证结果，如果验证通过则为null
   * */
  (keys: PermissionKeys<V>, config: PermissionConfig<S>): ValidMeta[] | null;
  /** 由配置传入的seed的原样导出 */
  seed: Seed;
}

/**
 * Permission创建配置
 * */
export interface CreatePermissionConfig<S = any, V = any> {
  /** 用于控制内部状态的seed */
  seed: Seed<S>;
  /** 待注册的验证器 */
  validators?: V;
  /**
   * 如果一个验证未通过，则阻止后续验证
   * * 对于or中的子权限，即使开启了validFirst，依然会对每一项进行验证，但是只会返回第一个
   * * 在执行check()时将优先级更高的权限key放到前面有助于提高验证反馈的精度, 如 login > publisher, 因为publisher状态是以login为前提的
   *  */
  validFirst?: boolean;
}

/**
 * 实例创建器
 * */
export interface PermissionCreator {
  <S extends AnyObject = AnyObject, V extends Validators<S> = Validators<S>>(
    conf: CreatePermissionConfig<S, V>,
  ): Permission<S, V>;
}
