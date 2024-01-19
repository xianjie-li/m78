import { FormConfig as VanillaFormConfig, FormInstance as VanillaFormInstance, FormNamesNotify as VanillaFormNamesNotify, FormRejectMeta, FormSchema as VanillaFormSchema, FormVerifyInstance, NamePath } from "@m78/form";
import React from "react";
import { AnyObject, EmptyFunction, NameItem } from "@m78/utils";
import { CustomEventWithHook, SetState } from "@m78/hooks";
import { SizeUnion } from "../common/index.js";
import { CellColProps, CellRowProps, TileProps } from "../layout/index.js";
import { FormAdaptors, FormAdaptorsItem } from "../config/index.js";
/** 要剔除的form-vanilla配置 */
export declare const _omitConfigs: readonly ["eventCreator", "languagePack", "verifyFirst", "ignoreStrangeValue"];
/** 要剔除的form-vanilla配置 */
type OmitType = typeof _omitConfigs[number];
/** 支持的布局类型 */
export declare enum FormLayoutType {
    horizontal = "horizontal",
    vertical = "vertical"
}
/** 支持的布局类型 */
export type FormLayoutTypeKeys = keyof typeof FormLayoutType;
/** 支持的布局类型, 可传入枚举或字面量 */
export type FormLayoutTypeUnion = FormLayoutTypeKeys | FormLayoutType;
/** 表单控件适配器, 优先级: 全局 < Form < Field */
export type FormAdaptor = (args: FormCustomRenderBasicArgs) => React.ReactElement | null;
/** 部分能够支持React版本的VanillaFormConfig配置 */
type VanillaFormConfigPartial = Omit<VanillaFormConfig, OmitType | "schemas">;
/** 创建form实例时传入的配置 */
export interface FormConfig extends VanillaFormConfigPartial, FormProps {
    /** 描述表单值结构的对象 */
    schemas?: FormSchemaWithoutName;
    /** 表单控件适配器, 优先级高于全局适配器 */
    adaptors?: FormAdaptors;
}
/** 部分能够支持React版本的VanillaFormSchema配置 */
type VanillaFormSchemaPartial = Omit<VanillaFormSchema, "label" | "dynamic" | "schema" | "eachSchema">;
/** 单个schema项 */
export interface FormSchema extends VanillaFormSchemaPartial, FormCommonProps {
    /** 动态设置其他参数 */
    dynamic?: (args: {
        /** 当前的验证实例 */
        form: FormVerifyInstance;
        /** 当前schema对应的name, 在eachSchema等包含不确定name路径的场景很有意义 */
        namePath: NameItem[];
    }) => Omit<FormSchema, "dynamic" | "name" | "list" | "deps"> | void;
    /** 类型为数组、对象时, 对其结构进行验证 */
    schema?: FormSchema[];
    /** 验证值为array或object时, 子级的所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
    eachSchema?: Omit<FormSchema, "name" | "list">;
    /** {} | list新增项时使用的默认值, 用于schema render, 且仅在项的值类型不为对象时需要配置 */
    listDefaultValue?: any;
}
/** 不包含name的schema */
export type FormSchemaWithoutName = Omit<FormSchema, "name">;
/** 去除了部分配置的VanillaFormInstance */
type VanillaFormInstancePartial = Omit<VanillaFormInstance, "getSchemas" | "setSchemas" | "getSchema" | "events" | "getConfig">;
/** Form实例 */
export interface FormInstance extends VanillaFormInstancePartial {
    /** 获取对dynamic/valid/list等特殊项进行处理进行处理后的完整schema副本 */
    getSchemas(): FormSchemaWithoutName;
    /** 重新设置当前schemas, 通常需要在重新设置schema后手动自动执行一次verify()来清理之前的校验状态 */
    setSchemas(schema: FormSchemaWithoutName): void;
    /** 获取对dynamic/valid/list等特殊项进行处理进行处理后的指定schema副本 */
    getSchema(name: NamePath): FormSchema | FormSchemaWithoutName | null;
    /** 获取Form创建配置 */
    getConfig(): FormConfig;
    /** 更改部分样式配置 */
    updateProps(props: FormProps): void;
    /** 事件 */
    events: {
        /** 字段值或状态变更时, 这里是更新ui状态的理想位置 */
        update: CustomEventWithHook<VanillaFormNamesNotify>;
        /** 字段值改变事件. update事件包含了change的触发场景 */
        change: CustomEventWithHook<VanillaFormNamesNotify>;
        /** 提交事件 */
        submit: CustomEventWithHook<(data: any) => void>;
        /** 验证失败的回调, 由 setValue 触发自动校验时, isValueChangeTrigger 为 true */
        fail: CustomEventWithHook<(errors: FormRejectMeta, isValueChangeTrigger?: boolean) => void>;
        /** 重置事件 */
        reset: CustomEventWithHook<EmptyFunction>;
    };
    /** 用于表示并绑定到表单字段 */
    Field: React.FunctionComponent<FormFieldProps>;
    /** 渲染列表 */
    List: <Item = any>(props: FormListProps<Item>) => React.ReactElement;
    /** 根据当前的schema配置直接渲染表单 */
    SchemaRender: React.FunctionComponent<FormSchemaRenderProps>;
}
/** FormProps中的所有key, 用于在分别根据Field/schema/config获取配置时检测是否可安全获取 */
export declare const _formPropsKeys: string[];
/** 这些配置支持在 config/schema/Field 中传入, 作用优先级为 Field > schema > config */
export interface FormProps {
    /** 布局类型 */
    layoutType?: FormLayoutTypeUnion;
    /** 使用气泡显示表单项描述 */
    bubbleDescribe?: boolean;
    /** 表单项的最大宽度, 用于防止宽度过大造成表单控件变形或不易操作 */
    maxWidth?: number | string;
    /** 尺寸 (决定布局紧凑程度, 会同时向表单控件传递props.size, 需要表单控件支持才能正常启用) */
    size?: SizeUnion;
    /** 禁用表单, 与标准disabled的区别是, disabled不会影响值的提交. 此外, 需要表单组件支持接收props.disabled */
    disabled?: boolean;
    /** 为 filed 根节点添加类名 */
    className?: string;
    /** 为 field 根节点添加样式 */
    style?: React.CSSProperties;
    /** 用于为 Field 添加自定义外层容器 */
    customer?: (args: FormCustomRenderWrapperArgs) => React.ReactElement | null;
    /** true | 是否显示根据validator生成的必输标记 */
    requireMarker?: boolean;
    /** 是否在Field周围填充空白 */
    spacePadding?: boolean;
}
/** 在Field和schema中均可用的配置, FormProps的扩展, 优先级 Field > schema */
export interface FormCommonProps extends FormProps {
    /** 表单项标题 */
    label?: React.ReactNode;
    /**
     * 表单控件, 需要满足以下条件之一:
     * - 支持value/onChange接口
     * - 通过全局或Form级adaptors适配过的表单控件, 传入string时表示其在适配器配置中的name
     * - 直接传入一个FormAdaptor, 可用于临时快速绑定新的表单控件或是渲染一个非表单的视图控件
     * */
    element?: React.ReactElement | string | FormAdaptor;
    /** 传递给 element 的 props, 通常在 element 传入 string 时使用 */
    elementProps?: Record<string, any>;
    /** 表单控件适配器 */
    adaptor?: FormAdaptor;
    /** 额外显示的字段描述 */
    describe?: React.ReactNode;
    /** 隐藏表单 */
    hidden?: boolean;
    /**
     * 依赖的值, 若通过dynamic依赖了其他值, 需要在此处声明依赖的其他字段
     *
     * - 此配置是为了减少Field不必要的re-render, 使字段能够在关联字段变更时才更为精确的更新
     * */
    deps?: NamePath[];
    /** 跳过除表单控件外的其他内容渲染, 如label, describe等, 用于高度定制场景 */
    preventDefaultRenders?: boolean;
    /** 渲染在field左侧的额外节点 */
    leftNode?: React.ReactNode | FormCustomRender;
    /** 渲染在field右侧的额外节点 */
    rightNode?: React.ReactNode | FormCustomRender;
    /** 渲染在field下方的额外节点 */
    bottomNode?: React.ReactNode | FormCustomRender;
    /** 渲染在field上方的额外节点 */
    topNode?: React.ReactNode | FormCustomRender;
    /** start | 控制元素(label/表单控件/leftNode等...)在交叉轴上的对齐方式 */
    crossAlign?: TileProps["crossAlign"];
}
/** 依次从 Field.props > schema > config 中获取通用配置 */
export interface FormCommonPropsGetter {
    <K extends keyof FormCommonProps>(key: K): FormCommonProps[K];
}
/** Filed Props */
export interface FormFieldProps extends FormCommonProps {
    /** 表单name */
    name?: NamePath;
}
/** 去除了部分配置的FormFieldProps */
type FormFieldPropsPartial = Omit<FormFieldProps, "element" | "elementProps" | "adaptor">;
/** 作为 list 时, 应从 Filed 或 schema 剔除的配置 */
export declare const _lisIgnoreKeys: string[];
/** List Props 相比 Field 少了一些配置项 */
export interface FormListProps<Item = any> extends FormFieldPropsPartial {
    /** 渲染list子级, 相比layoutRender不包含预设的布局 */
    render?: FormListRenderChildren<Item>;
    /** 使用预设list布局进行渲染, 包含了新增/排序/删除等布局控件 */
    layoutRender?: FormListCustomRenderCallback;
}
export interface FormSchemaRenderProps {
    /** true | 是否显示预置的重置/提交等按钮 */
    showActionButtons?: boolean;
    /** 提交回调, 触发表示验证已通过 */
    onSubmit?: (values: any) => void;
    /** 根节点为一个<Cells/>组件, 可通过此项配置其props, 用于多列表单渲染 */
    cellsProps?: Omit<CellRowProps, "children">;
    /** 每个根field/List均由<Cell/>组件包裹, 可通过此项配置其props, 用于多列表单渲染 */
    cellProps?: Omit<CellColProps, "children">;
}
/** 用于Adaptors的参数 */
export interface FormCustomRenderBasicArgs {
    /** 用于展开绑定到表单组件的props. 根据配置, 可能包含size/disabled, 可根据表单控件支持度按需传入 */
    bind: {
        /** 受控绑定的值 */
        value: any;
        /** 值变更回调 */
        onChange: (value: any) => void;
        /** 是否禁用 */
        disabled?: boolean;
        /** 组件尺寸 */
        size?: string;
    };
    /** 用于将传入的props绑定到element的助手函数 */
    binder: <Props = AnyObject>(element: React.ReactElement | null, props: Props) => React.ReactElement | null;
    /** Form实例 */
    form: FormInstance;
    /** 创建配置 */
    config: FormConfig;
    /** 传递给field的props */
    props: FormFieldProps;
    /** 用于根据默认优先级获取通用配置(FormCommonProps) */
    getProps: FormCommonPropsGetter;
    /** 表单控件节点 */
    element: React.ReactElement | null;
}
/** 用于Customer的参数 */
export interface FormCustomRenderWrapperArgs extends FormCustomRenderBasicArgs {
    /** 原节点, 通常需要挂载到定制的包裹节点中 */
    element: React.ReactElement | null;
    /** 在config/schema/props配置了复数的customer时, 可以在执行后阻止后续customer的运行, 执行顺序为props -> schema -> config */
    preventNext(): void;
}
/** List渲染 */
export type FormListCustomRenderCallback<Item = any> = (meta: {
    /** 该项的值 */
    item: Item;
    /** 该项索引 */
    index: number;
    /** 总长度 */
    length: number;
    /** 将指定 name 前拼接上 List 父级的 name 后返回 */
    getName(name?: NamePath): NamePath;
}) => React.ReactElement;
type FormCustomRenderBasicArgsPartial = Omit<FormCustomRenderBasicArgs, "bind" | "element" | "binder">;
/** FormListRenderChildren 入参 */
export interface FormListCustomRenderArgs<Item = any> extends FormCustomRenderBasicArgsPartial {
    /** 用于渲染列表 */
    render(renderCB: FormListCustomRenderCallback): React.ReactElement;
    /** 为list新增一项或多项, index为起始位置, 默认追加到结尾. 若name不是有效list或其他原因导致失败会将返回false */
    add(items: Item | Item[], index?: number): boolean;
    /** 移除list指定索引的元素 */
    remove(index: number): boolean;
    /** 移动list的指定原素到另一位置 */
    move(from: number, to: number): boolean;
    /** 交换list的两个元素 */
    swap(from: number, to: number): boolean;
}
/** Filed自定义渲染函数 */
export interface FormCustomRender {
    (args: FormCustomRenderBasicArgs): React.ReactNode;
}
/** List自定义渲染函数 */
export interface FormListRenderChildren<Item = any> {
    (args: FormListCustomRenderArgs<Item>): React.ReactElement;
}
export interface _FormContext {
    config: FormConfig;
    form: FormInstance;
    /** 合并config.formAdaptors和formConfig.formAdaptors的map, 以组件本身作为key */
    adaptorsMap: Map<any, FormAdaptorsItem>;
    /** 以name存储的adaptors, 仅包含配置了字符串name的项 */
    adaptorsNameMap: Map<string, FormAdaptorsItem>;
    /** updateProps调用时通知组件更新 */
    updatePropsEvent: CustomEventWithHook<EmptyFunction>;
}
export interface _FieldContext {
    state: {
        schema: FormSchema | FormSchemaWithoutName | null;
        renderKey: number;
    };
    setState: SetState<_FieldContext["state"]>;
    isList: boolean;
    props: FormFieldProps;
    name: NamePath;
    wrapRef: React.MutableRefObject<HTMLDivElement>;
    /** 组件的唯一标识, 目前仅用于list拖拽排序分组 */
    id: string;
    /** name的string化 */
    strName: string;
}
export {};
//# sourceMappingURL=types.d.ts.map