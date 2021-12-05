import { FormProps as RFormProps } from 'rc-field-form/es/Form';
import { FieldProps } from 'rc-field-form/es/Field';
import { NamePath, FormInstance, RuleObject, Meta, Rule } from 'rc-field-form/es/interface';
import React from 'react';
import { AnyObject, ComponentBasePropsWithAny, ComponentBaseProps } from '@lxjx/utils';
import { DirectionEnum, DirectionKeys } from 'm78/common';
import { ListViewProps } from 'm78/list-view';

export interface FormItemCustomMeta extends Meta {
  disabled: boolean;
  required: boolean;
  label?: string;
  /** 表单状态 */
  status?: 'error' | 'loading';
  /** 描述错误的字符，存在此项时说明包含错误 */
  errorString?: string;
}

export interface FormRenderChild {
  (control: AnyObject, meta: FormItemCustomMeta, form: FormInstance): React.ReactNode;
}

export interface FormProps<Values = any>
  extends ComponentBaseProps,
    RFormProps,
    Omit<FormLayoutProps, 'children'> {
  /** false | 隐藏所有必选标记 */
  hideRequiredMark?: boolean;
  /** 直接传入rules配置来进行表单验证 */
  rules?: {
    [key: string]: Rule | Rule[];
  };
  /** 关闭默认的样式，开启后只会包含一个无样式的包裹容器，并且column、layout等布局配置失效，不会影响FormItem的样式 */
  noStyle?: boolean;
  /** 向表单控件传递disabled */
  disabled?: boolean;
  /** 获取表单控制实例 */
  instanceRef?: React.Ref<FormInstance<Values>>;
  /** 全宽显示表单 */
  fullWidth?: boolean;
}

/* 不带name的Item会作为布局组件使用 */
export interface FormItemProps /* 支持rc-form-field所有参数 */
  extends Omit<FieldProps, 'children'>,
    /* 支持平铺式的传入验证项 */
    Omit<RuleObject, 'validateTrigger'>,
    Omit<FormItemLayoutProps, 'children' | 'errorNode'>,
    ComponentBasePropsWithAny {
  /**
   * 一个作为表单控件的直接子元素, 需要支持value/onChange接口或通过自己配置相关key
   * - 可以通过FormRenderChild和可选的noStyle手动实现更精细的状态和样式控制
   * - 如果传入一组FormItem，会使其作为布局组件使用
   * */
  children: React.ReactElement | FormRenderChild | React.ReactNode;
  /**
   * 禁用样式/默认的验证样式，直接渲染表单控件, 只包含一个无样式的包装容器，可通过className和style控制容器样式
   * - 一般启用此项后都会通过children: FormRenderChild 自定义布局、验证样式
   * */
  noStyle?: boolean;
  /** true | 为false时组件以及组件状态都会被移除, 如果通过Form.List渲染表单，请使用其对应的字段控制api */
  valid?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
  /** true | 是否可见，不影响组件状态 */
  visible?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
}

export interface FormLayoutProps extends Omit<ListViewProps, 'effect'> {
  /** 'vertical' | 横向表单/纵向表单 */
  layout?: DirectionKeys | DirectionEnum;
}

export interface FormItemLayoutProps extends ComponentBaseProps {
  /** 内容 */
  children: React.ReactNode;
  /** 标题 */
  label?: string;
  /** 表单项的描述 */
  desc?: React.ReactNode;
  /** 错误提示文本 */
  errorNode?: React.ReactNode;
  /** 禁用（视觉禁用） */
  disabled?: boolean;
  /** 标记该项为必填项（标题后会带红色*号） */
  required?: boolean;
  /** 指向内部包裹dom的ref */
  innerRef?: React.Ref<HTMLDivElement>;
  /** 显示右侧箭头 */
  arrow?: boolean;
  /** 元素id */
  id?: string;
}
