import { FormProps as RFormProps } from 'rc-field-form/es/Form';
import { FieldProps } from 'rc-field-form/es/Field';
import { NamePath, FormInstance, RuleObject, Meta, Rule } from 'rc-field-form/es/interface';
import React from 'react';
import { ListFormType } from 'm78/list';
import { AnyObject } from '@lxjx/utils';
import { ComponentBaseProps } from 'm78/types';
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
export interface FormProps<Values = any> extends ComponentBaseProps, RFormProps, ListFormType {
    /** false | 隐藏所有必选标记 */
    hideRequiredMark?: boolean;
    /** 直接传入rules配置来进行表单验证 */
    rules?: {
        [key: string]: Rule | Rule[];
    };
    /** 关闭默认的样式，开启后只会保护一个无样式的包裹容器，并且column、layout等布局配置失效，不会影响FormItem的样式 */
    noStyle?: boolean;
    /** 是否启用带边框的布局` */
    border?: boolean;
    /** 获取表单控制实例 */
    instanceRef?: React.Ref<FormInstance<Values>>;
}
export interface FormItemProps extends ComponentBaseProps, Omit<FieldProps, 'children'>, Omit<RuleObject, 'validateTrigger'> {
    /**
     * 一个作为表单控件的直接子元素, 需要支持value/onChange接口或通过自己配置相关key
     * - 可以通过FormRenderChild和可选的noStyle手动实现更精细的状态和样式控制
     * - 如果传入的不是合法的ReactElement或FormRenderChild, 会不做任何处理直接渲染
     * */
    children: React.ReactElement | FormRenderChild | React.ReactNode;
    /** 表单项标题 */
    label?: string;
    /** 位于输入控件下方的描述文本 */
    extra?: React.ReactNode;
    /** 位于输入控件上方的描述文本 */
    desc?: React.ReactNode;
    /** 禁用表单，如果表单控件不识别disabled属性，此项仅在样式上表现为"禁用" */
    disabled?: boolean;
    /**
     * 禁用样式/默认的验证样式，直接渲染表单控件, 只包含一个无样式的包装容器，可通过className和style控制容器样式
     * - 一般启用此项后都会通过children: FormRenderChild 自定义布局、验证样式
     * */
    noStyle?: boolean;
    /** true | 为false时组件以及组件状态都会被移除, 如果通过Form.List渲染表单，请使用其对应的字段控制api */
    valid?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
    /** true | 是否可见，不影响组件状态 */
    visible?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
    /** 指向内部包裹dom的ref */
    innerRef?: React.Ref<HTMLDivElement>;
}
