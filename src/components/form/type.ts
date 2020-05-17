import { FormProps as RFormProps } from 'rc-field-form/es/Form';
import { FieldProps } from 'rc-field-form/es/Field';
import { NamePath, FormInstance } from 'rc-field-form/es/interface';
import React from 'react';
import { ListFormType } from '@lxjx/fr/lib/list';
import { ComponentBaseProps } from '../types/types';

export interface FormProps extends ComponentBaseProps, RFormProps, ListFormType {}

export interface FormItemProps extends ComponentBaseProps, FieldProps {
  /** 一个作为表单控件的直接子元素, 需要支持value/onChange接口或通过其他配置指定 */
  children: React.ReactElement | any;
  /** 表单项标题 */
  label?: string;
  /** 位于输入控件下方的描述文本 */
  extra?: React.ReactNode;
  /** 位于输入控件上方的描述文本 */
  desc?: React.ReactNode;
  /** 标记为必填, 会出现必填标记并在rules中添加required */
  required?: boolean;
  /** 禁用表单，如果表单控件不知道disabled属性，此项仅在样式上表现为"禁用" */
  disabled?: boolean;
  /** 禁用样式，直接渲染表单控件 */
  noStyle?: boolean;
  /** true | 为false时将组件以及组件状态都会被移除, 使用List的嵌套表单状态不会移除，请直接使用List相关API操作 */
  valid?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
  /** true | 是否可见，不影响组件状态 */
  visible?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
}
