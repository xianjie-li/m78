import {
  AuthKeys,
  Validators,
  ValidMeta,
  AuthConfig,
  Auth,
  CreateAuthConfig,
  AuthPro,
  _AuthSeedProState,
} from '@m78/auth';
import { ButtonPropsWithHTMLButton } from 'm78/button';
import React, { ReactElement } from 'react';
import { AnyObject } from '@lxjx/utils';
import { AuthProConfig, AuthProStrings, AuthProValidMeta } from '@m78/auth/proType';

declare module '@m78/auth' {
  export interface Action extends ButtonPropsWithHTMLButton {}
}

export enum AuthType {
  feedback = 'feedback',
  hidden = 'hidden',
  popper = 'popper',
}

export type AuthTypeKeys = keyof typeof AuthType;

/** auth api */
export interface RCAuth<S, V> {
  /** 权限检测组件 */
  (props: AuthProps<S, V>): ReactElement<any, any> | null;
  /** 执行权限验证 */
  auth: Auth<S, V>;
  /** 创建带权限检测的高阶组件 */
  withAuth: <P>(
    conf: Omit<AuthProps<S, V>, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
  /** 权限验证hook */
  useAuth: UseAuth<S, V>;
}

/** 扩展seed create api */
export interface RCAuthCreate {
  <S extends AnyObject = AnyObject, V extends Validators<S> = Validators<S>>(
    conf: CreateAuthConfig<S, V>,
  ): RCAuth<S, V>;
}

export interface UseAuth<S, V> {
  (
    keys: AuthKeys<V>,
    config?: {
      /** 是否启用 */
      disabled?: boolean;
    } & AuthConfig<S>,
  ): /** 所有未通过验证器返回的ValidMeta，如果为null则表示验证通过 */
  ValidMeta[] | null;
}

export interface AuthProps<S, V> {
  /**
   * 权限验证通过后显示的内容
   * - 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactElement | (() => React.ReactElement);
  /**
   * 待验证的权限key组成的数组
   * - 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
   * - 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合的条件表示逻辑 `or` */
  keys: AuthKeys<V>;
  /** 'feedback' | 反馈方式，分为占位节点、隐藏、气泡提示框三种, 当type为popper时，会自动拦截子元素的onClick事件, 同时，也需要确保子节点符合<Popper />组件的子节点规则 */
  type?: AuthTypeKeys | AuthType;
  /** 传递给验证器的额外参数 */
  extra?: any;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (rejectMeta: ValidMeta[], props: AuthProps<S, V>) => React.ReactNode;
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

export interface AuthProProps
  extends Omit<AuthProps<_AuthSeedProState, any>, 'keys' | 'extra' | 'feedback' | 'validators'> {
  keys: AuthProStrings;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (rejectMeta: AuthProValidMeta[], props: AuthProProps) => React.ReactNode;
}

export interface RCAuthPro extends AuthPro {
  /** 权限检测组件 */
  (props: AuthProProps): ReactElement<any, any> | null;
  /** 权限验证hook */
  useAuth: (keys: AuthProStrings) => AuthProValidMeta[] | null;
  /** 创建带权限检测的高阶组件 */
  withAuth: <P>(
    conf: Omit<AuthProProps, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
}

export interface RCAuthProCreator {
  (config: AuthProConfig): RCAuthPro;
}
