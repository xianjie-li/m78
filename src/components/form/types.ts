import React, { ReactElement } from 'react';
import { NamePath, AsyncValidator, Validator } from '@m78/verify';
import { ComponentBaseProps } from '@lxjx/utils';
import { CustomEventWithHook } from '@lxjx/hooks';
import { Direction } from 'm78/common';
import {
  VField,
  VFieldConfig,
  VFieldLike,
  VFieldsProvideFn,
  VForm,
  VFormConfig,
  VFormFailFn,
  VFormValueProvideFn,
  VList,
} from '@m78/vform';

export interface RForm
  extends Omit<VForm, 'updateEvent' | 'changeEvent' | 'submitEvent' | 'resetEvent' | 'failEvent'> {
  updateEvent: CustomEventWithHook<VFieldsProvideFn>;
  changeEvent: CustomEventWithHook<VFieldsProvideFn>;
  submitEvent: CustomEventWithHook<VFormValueProvideFn>;
  failEvent: CustomEventWithHook<VFormFailFn>;
  resetEvent: CustomEventWithHook<VoidFunction>;
  /** 构建一个表单字段 */
  Field: (props: FieldProps) => ReactElement<any, any> | null;
  /** 构建一组表单字段 */
  List: (props: ListProps) => ReactElement<any, any> | null;
  /** 实时渲染一个值 */
  ValueRender: (props: ValueRenderProps) => ReactElement<any, any> | null;
}

/** RForm扩展配置, 添加了一些布局相关的配置 */
export interface RFormConfig extends VFormConfig {
  /** 自定义所有Field样式 */
  fieldCustomer?: LayoutCustomer;
  /** 自定义所有List样式 */
  listCustomer?: LayoutCustomer;
  /** 通过气泡来显示验证提示, extra等, 用于需要错误提示和extra不会破坏布局空间的情况 */
  bubbleTips?: FieldProps['bubbleTips'];
  /** 隐藏必填标记 */
  hideRequiredMark?: FieldProps['hideRequiredMark'];
  /** 'vertical' | 表单的布局方向 */
  layout?: FieldProps['layout'];
  /** 440 | 字段的最大宽度, 用于防止宽度过大造成表单控件变形或不易操作 */
  maxWidth?: number | string;
}

export type FieldChecker = boolean | ((form: VForm, field: VFieldLike) => boolean);

/** `Field`和`List`的自定义渲染器 */
export type LayoutCustomer = (
  props: FieldRenderProps,
  child: React.ReactElement,
) => React.ReactNode;

export interface FieldRenderProps {
  /** 用来控制表单控件的绑定props, 用于展开并透传到表单控件上 */
  bind: any;
  /** 表单对应的vField实例 */
  field: VField;
  /** 组件接收的参数 */
  fieldProps: FieldProps;
  /** 是否是必填项 */
  required: boolean;
  /** 用来实现FieldProps.hidden, 可根据此值为根节点传入样式 { display: hidden ? 'none' : undefined } 来控制显示和隐藏 */
  hidden: boolean;
  /** 挂载到渲染的dom节点上, 用于实现验证后自动聚焦等dom相关操作 */
  innerRef: React.Ref<any>;
}

export interface FieldProps<Val = any>
  extends Omit<VFieldConfig, 'label' | 'validator'>,
    ComponentBaseProps {
  /**
   * ##### 核心  #####
   * */
  /** field内容, 必须是一个能支持changeKey/valueKey对应props作为控制的受控表单控件, 控制key默认为onChange/value */
  children: React.ReactElement;
  /** 一组验证器, 可以传入一个返回一组验证器的函数来实现动态验证规则 */
  validator?:
    | (Validator | AsyncValidator)[]
    | ((form: VForm, field: VFieldLike) => (Validator | AsyncValidator)[]);

  /**
   * ##### 表单联动  #####
   * */
  /** true | valid为false的field不会参与验证和提交, 并且处于不可见状态 */
  valid?: FieldChecker;
  /** false | 组件是否可见, 不影响field的验证和值获取 */
  hidden?: FieldChecker;
  /** false | disabled状态的表单不会参与验证和提交, 控制表单控件的disabled(需要控件支持), 与valid的区别是他禁用控件而不是隐藏 */
  disabled?: FieldChecker;
  /** 只有传入字段和本字段变更时, 才会更新组件 */
  deps?: NamePath[];

  /**
   * ##### 值处理/获取  #####
   * */
  /** 'onChange' | 表单控件回调value的prop */
  changeKey?: string;
  /** 'value' | 表单控件用于控制value的prop */
  valueKey?: string;
  /** 自定义如何从事件对象中取值, 默认为 e.target.value > e */
  getValueFromEvent?: (...eArgs: any[]) => Val;
  /** 在从表单控件onChange接收到value时, 先对其进行格式化在存储 */
  formatter?: (val: Val) => any;
  /** 设置值到表单控件value前, 使用此函数对其先进行处理, 并将处理后的值设置到value */
  parser?: (val: any) => Val;
  /** 值变更时回调通知 */
  onChange?: (val: Val) => void;

  /**
   * ##### 样式类  #####
   * */
  /** 表单label */
  label?: React.ReactNode;
  /** 10 | horizontal模式下, label的上间距, 用于表单控件过小的情况下优化显示 */
  labelFixPad?: number;
  /** 额外内容, 常用语说明文本 */
  extra?: React.ReactNode;
  /** 'vertical' | 表单的布局方向 */
  layout?: Direction;
  /** 隐藏必填标记 */
  hideRequiredMark?: boolean;
  /** 通过气泡来显示验证提示, extra等, 用于需要错误提示和extra不会破坏布局空间的情况 */
  bubbleTips?: boolean;
  /** 自定义渲染, 需要高度自定义表单样式和结构时使用, 自定义样式会使所有样式类配置失效 */
  customer?: LayoutCustomer;
  /** 表单控件前面的内容 */
  leading?: React.ReactNode;
  /** 表单控件后面的内容 */
  trailing?: React.ReactNode;
  /** 440 | 字段的最大宽度, 用于防止宽度过大造成表单控件变形或不易操作 */
  maxWidth?: number | string;

  /**
   * ##### 其他  #####
   * */
  /** 用于作为list项时, 绑定到对应的list */
  bind?: ListBind;
  /** 直接传入一个field对象来代替内部自动创建的对象 */
  field?: VFieldLike;
}

export type ListRenderChildren = (props: ListRenderProps) => React.ReactElement;

/** list的render children接收参数 */
export interface ListRenderProps
  extends Omit<VList, 'list' | 'withName' | 'add' | 'getFlatChildren' | keyof VField> {
  /** 用于渲染的item列表 */
  list: ListItem[];
  /** 新增一条记录, val会作为记录的初始值 */
  add: (val?: any) => void;
}

export interface ListProps extends Omit<FieldProps, 'children'> {
  /** 渲染list children */
  children: ListRenderChildren;
}

/** 用来将field关联到list中 */
export interface ListBind {
  /** vList实例 */
  instance: VList;
  /** 所在list的index */
  index: number;
  /** 所在list的key */
  key: string;
}

/** 描述了`List`的一个子项 */
export interface ListItem {
  /** 所在list的key */
  key: string;
  /** 用于绑定到list的对象 */
  bind: ListBind;
}

export interface ValueRenderProps {
  name: NamePath;
  children: (val: any) => React.ReactNode;
}
