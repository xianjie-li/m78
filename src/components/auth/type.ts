import React from 'react';
import { ButtonProps } from '@lxjx/fr/button';
import { AuthKeys, Auth, CreateAuthConfig, Validators, Action, ValidMeta } from '@lxjx/auth';
import { AnyObject } from '@lxjx/utils';

declare module '@lxjx/auth' {
  export interface Action extends ButtonProps {}
}

interface ExpandAuth<D, V> extends Auth<D, V> {
  /** 权限组件 */
  Auth: React.FC<AuthProps<D, V>>;
  /** 权限高阶组件 */
  withAuth: <P>(
    conf: Omit<AuthProps<D, V>, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
}

export interface ExpandCreate {
  <D extends AnyObject = AnyObject, V extends Validators<D> = Validators<D>>({
    dependency,
    validators,
    validFirst,
  }: CreateAuthConfig<D, V>): ExpandAuth<D, V>;
}

export interface AuthProps<D, V> {
  /**
   * 权限验证通过后显示的内容
   * * 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactNode | any;
  /**
   * 待验证的权限key组成的数组
   * * 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
   * * 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合后，两者的任一个满足条件则验证通过 */
  keys: AuthKeys<V>;
  /** 'feedback' | 反馈方式，占位节点、隐藏、气泡提示框, 当type为popper时，会自动拦截子元素的onClick事件 */
  type?: 'feedback' | 'hidden' | 'popper';
  /** 传递给验证器的额外参数 */
  extra?: any;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈信息
   * */
  feedback?: (rejectMeta: ValidMeta, props: AuthProps<D, V>) => React.ReactNode;
  /** 验证处于未完成状态时显示的节点, type 为 hidden 时无效 */
  pendingNode?: React.ReactNode;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: Validators<D>;
  /** 自定义显示的403 icon */
  icon?: React.ReactNode;
}
