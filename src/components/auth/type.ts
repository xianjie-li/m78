import React from 'react';
import { ButtonProps } from '@lxjx/fr/button';
import { AuthKeys } from '@lxjx/auth';
import { AnyObject } from '@lxjx/utils';
import { Auth, CreateAuthConfig, Validators } from '@lxjx/auth/types';

declare module '@lxjx/auth' {
  export interface Action extends ButtonProps {}
}

interface ExpandAuth<D, V> extends Auth<D, V> {
  Auth: React.FC<AuthProps<V>>;
}

export interface ExpandCreate {
  <D extends AnyObject = AnyObject, V extends Validators<D> = Validators<D>>({
    dependency,
    validators,
    validFirst,
  }: CreateAuthConfig<D, V>): ExpandAuth<D, V>;
}

export interface AuthProps<V> {
  /** 关联的权限key */
  keys: AuthKeys<V>;
  /** 'feedback' | 反馈方式，占位节点、隐藏、气泡提示框 */
  type?: 'feedback' | 'hidden' | 'tooltip';
  /** 传递给验证器的额外参数 */
  extra?: any;
  /** 控制更新粒度 */
  deps?: any[];
  /** 定制无权限时的反馈样式 */
  feedback?: () => React.ReactNode;
  /** 验证处于未完成状态是显示的节点, type 为 hidden 时无效 */
  pendingNode?: React.ReactNode;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: any[];
}
