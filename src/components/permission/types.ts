import { ButtonPropsWithHTMLButton } from 'm78/button';
import React, { ReactElement } from 'react';
import { AnyObject } from '@lxjx/utils';

import {
  _PermissionProSeedState,
  CreatePermissionConfig,
  Permission,
  PermissionConfig,
  PermissionKeys,
  PermissionPro,
  PermissionProConfig,
  PermissionProTpl,
  ValidMeta,
  Validators,
  PermissionProRejectMeta,
} from '@m78/permission';

/** 额外的验证结果 */
export interface PermissionExtraMeta {
  /** 该权限的文字描述 */
  desc?: string;
  /** 验证失败时提供给用户的一组操作 */
  actions?: Array<
    {
      /** 操作名称 */
      label: string;
      /** 可以扩展异常处理方法(handler)，渲染类型(link)等，帮助控制具体的显示 */
    } & ButtonPropsWithHTMLButton
  >;
}

/** 扩展验证结果 */
declare module '@m78/permission' {
  export interface ValidMeta extends PermissionExtraMeta {}

  export interface PermissionProMeta extends PermissionExtraMeta {}
}

/** 验证反馈类型 */
export enum PermissionType {
  feedback = 'feedback',
  hidden = 'hidden',
  popper = 'popper',
}

export type PermissionTypeKeys = keyof typeof PermissionType;

/** api */
export interface RCPermission<S, V> {
  /** 权限检测组件 */
  (props: PermissionProps<S, V>): ReactElement<any, any> | (() => ReactElement<any, any>) | null;

  /** 一个permission实例, 可用于主动执行权限验证 */
  permission: Permission<S, V>;
  /** 创建带权限检测的高阶组件 */
  withPermission: <P>(
    conf: Omit<PermissionProps<S, V>, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
  /** 权限验证hook */
  usePermission: UsePermission<S, V>;
}

/** 扩展create api */
export interface RCPermissionCreate {
  <S extends AnyObject = AnyObject, V extends Validators<S> = Validators<S>>(
    conf: CreatePermissionConfig<S, V>,
  ): RCPermission<S, V>;
}

export interface UsePermission<S, V> {
  (
    keys: PermissionKeys<V>,
    config?: {
      /** 是否启用 */
      disabled?: boolean;
    } & PermissionConfig<S>,
  ): /** 所有未通过验证器返回的ValidMeta，如果为null则表示验证通过 */
  ValidMeta[] | null;
}

export interface PermissionProps<S, V> {
  /**
   * 权限验证通过后显示的内容
   * - 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactElement | (() => React.ReactElement);
  /**
   * 待验证的权限key组成的数组
   * - 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
   * - 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合的条件表示逻辑 `or` */
  keys: PermissionKeys<V>;
  /** 'feedback' | 反馈方式，分为占位节点、隐藏、气泡提示框三种, 当type为popper时，会自动拦截子元素的onClick事件, 同时，也需要确保子节点符合<Overlay />组件的子节点规则 */
  type?: PermissionTypeKeys | PermissionType;
  /** 传递给验证器的额外参数 */
  extra?: any;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (rejectMeta: ValidMeta[], props: PermissionProps<S, V>) => React.ReactNode;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: Validators<S>;
  /** 自定义显示的403 icon */
  icon?: React.ReactNode;
}

/*
 * #####################################################
 *                         Pro
 * #####################################################
 * */

export type PermissionProTplList = Array<PermissionProTpl | PermissionProTpl[]>;

export interface PermissionProProps
  extends Omit<
    PermissionProps<_PermissionProSeedState, any>,
    'keys' | 'extra' | 'feedback' | 'validators'
  > {
  /** 执行验证, 如果验证失败, 返回缺失权限组成的数组, 如果数组项为数组则表示逻辑 `or` */
  keys: PermissionProTplList;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (
    rejectMeta: NonNullable<PermissionProRejectMeta>,
    props: PermissionProProps,
  ) => React.ReactNode;
}

export interface RCPermissionPro extends PermissionPro {
  /** 权限检测组件 */
  (props: PermissionProProps): ReactElement<any, any> | null;

  /** 权限验证hook */
  usePermission: (keys: PermissionProTplList) => PermissionProRejectMeta;
  /** 创建带权限检测的高阶组件 */
  withPermission: <P>(
    conf: Omit<PermissionProProps, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
}

export interface RCPermissionProCreator {
  (config: PermissionProConfig): RCPermissionPro;
}
