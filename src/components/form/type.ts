import { FormProps as RFormProps } from 'rc-field-form/es/Form';
import { FieldProps } from 'rc-field-form/es/Field';
import {
  NamePath,
  FormInstance,
  StoreValue,
  RuleType,
  RuleObject,
  Meta,
} from 'rc-field-form/es/interface';
import React, { ReactElement } from 'react';
import { ListFormType } from '@lxjx/fr/lib/list';
import { AnyObject } from '@lxjx/utils';
import { ComponentBaseProps } from '../types/types';

export interface FormItemCustomMeta extends Meta {
  disabled: boolean;
  required: boolean;
  /** 表单状态 */
  status?: 'error' | 'loading';
  /** 描述错误的字符，存在此项时说明包含错误 */
  errorString?: string;
}

export interface FormProps extends ComponentBaseProps, RFormProps, ListFormType {
  /** false | 隐藏所有必选标记 */
  hideRequiredMark?: boolean;
}

export interface FormItemProps extends ComponentBaseProps, Omit<FieldProps, 'children'> {
  /** 一个作为表单控件的直接子元素, 需要支持value/onChange接口或通过其他配置指定 */
  children:
    | React.ReactElement
    | ((control: AnyObject, meta: FormItemCustomMeta, form: FormInstance) => React.ReactNode)
    | React.ReactNode;
  /** 表单项标题 */
  label?: string;
  /** 位于输入控件下方的描述文本 */
  extra?: React.ReactNode;
  /** 位于输入控件上方的描述文本 */
  desc?: React.ReactNode;
  /** 禁用表单，如果表单控件不知道disabled属性，此项仅在样式上表现为"禁用" */
  disabled?: boolean;
  /** 禁用样式，直接渲染表单控件 */
  noStyle?: boolean;
  /** true | 为false时将组件以及组件状态都会被移除, 使用List的嵌套表单状态不会移除，请直接使用List相关API操作 */
  valid?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
  /** true | 是否可见，不影响组件状态 */
  visible?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
  /* ========== 验证型配置 ========= */
  /* 为了方便，简单的验证可以直接使用下面的配置而不用传rules(两种方式尽量不要混用) */
  enum?: StoreValue[];
  len?: number;
  max?: number;
  message?: string | ReactElement;
  min?: number;
  pattern?: RegExp;
  required?: boolean;
  transform?: (value: StoreValue) => StoreValue;
  type?: RuleType;
  validator?: (
    rule: RuleObject,
    value: StoreValue,
    callback: (error?: string) => void,
  ) => Promise<void> | void;
  whitespace?: boolean;
}
