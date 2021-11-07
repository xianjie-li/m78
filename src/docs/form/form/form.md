---
title: Form - 表单
group:
  title: 数据录入
  path: /form
---

# Form 表单

与 antd 使用同一底层库 [rc-field-form](https://github.com/react-component/field-form) 进行封装, api 使用大体上一致，但额外对验证体验/表单联动/布局方式等进行了优化，更简单易用。

## 基本使用

基本的值收集和验证能力，`Form.Item`可以直接使用包含`value/onChange`接口的表单控件(也可以通过配置定制从表单取值的方式)。

<code src="./base.tsx" />

## 嵌套结构

支持对象嵌套和数组嵌套

<code src="./embedded.tsx" />

## 动态表单

通过`List`组件对一组列表值进行管理

<code src="./list.tsx" />

## 动态表单 + 拖动排序

为上一个例子添加拖拽功能

<code src="./drag.tsx" />

## 联动

相比 antd, 组件提供了更简单易用的表单联动支持, 并且可以自动地清理已经失效的字段

<code src="./linkage.tsx" />

💡 the gist:

1. 通过`valid`或`visible`返回`boolean`状态，字段将根据返回来决定是否渲染，支持直接传入`boolean`值
2. 为了更好的性能，默认情况下某一表单值变更不会影响到其他的字段，通过手动传入`dependencies`来监听对应字段值的变化
3. `valid`和`visible`的区别是，前者会在接收到`false`时清理表单值，并在为`true`时还原，后者仅仅是简单的进行`display`切换，不会对已有值造成影响

## 验证

支持三种方式进行验证

1. 通过`rules`来进行[async-validator](https://github.com/yiminghe/async-validator/)规则配置, 与`antd`用法完全一致
2. 通过`Form.Item`直接配置`required`、`type`、`max`等验证配置
3. 通过`Form`直接传入`rules`, 这种方式可以大大保持`jsx`的干净度

⛔ 三种验证方式可以混用，但是最好别这么做。验证顺序是 `直接传入` > `rules` > `Form配置`

### 基础验证

<code src="./validate.tsx" />

<br>

### 表单级验证

通过`Form`传递验证规则，可以抽离验证代码，减少`jsx`污染

<code src="./validate2.tsx" />

## 布局/样式

### 基础布局

多种基础布局方式展示

<code src="./layout.tsx" />

### 内联表单

内置的内联表单样式

<code src="./inline.tsx" />

### 自定义样式

如果你有很强的样式定制意愿，通过`noStyle`关闭内置样式，然后再实现`FormRenderChild`来定制内容排版、样式

<code src="./custom.tsx" />
 
💡 通常会将定制内容抽取为单独的Item组件，并在需要的地方直接使用

## 表单实例

可以通过 form 实例来控制表单行为、设置值、提交验证等。

<code src="./instance.tsx" />

## API

### **`Form`**

```ts
interface FormProps<Values = any> {
  /** false | 隐藏所有必选标记 */
  hideRequiredMark?: boolean;
  /** 同表单级别的配置来进行验证 */
  rules?: {
    [key: string]: Rule | Rule[];
  };
  /** 关闭默认的样式，开启后只会包含一个无样式的包裹容器，并且column、layout等布局配置失效，不会影响FormItem的样式 */
  noStyle?: boolean;
  /** 向表单控件传递disabled */
  disabled?: boolean;
  /** 获取表单实例 */
  instanceRef?: React.Ref<FormInstance<Values>>;
  /** 'vertical' | 横向表单/纵向表单 */
  layout?: 'horizontal' | 'vertical';
  /** 多列模式 */
  column?: number;
  /** 调整布局紧凑程度、字号等 */
  size?: SizeEnum | Size;
  /** false | 列表容器显示边框 */
  border?: boolean;
  /**
   * 'splitLine' | 项的基础样式类型
   * - splitLine模式在开启了多列的情况下无效
   * */
  itemStyle?: 'splitLine' | 'border' | 'none' | ListViewItemStyleEnum;

  /** 表单初始值 */
  initialValues?: Store;
  /** 通过useForm设置表单实例 */
  form?: FormInstance<Values>;
  /** 子元素，支持render props(不推荐) */
  children?: RenderProps | React.ReactNode;
  /** 'form' | 自定义表单内置tag, 为false时禁用内嵌form */
  component?: false | string | React.FC<any> | React.ComponentClass<any>;
  /** 控制表单字段状态。 仅在Redux中使用 */
  fields?: FieldData[];
  /** 配置FormProvider所对应的name */
  name?: string;
  /** 自定义验证消息模板 */
  validateMessages?: ValidateMessages;
  /** 当表单值变更时触发 */
  onValuesChange?: Callbacks<Values>['onValuesChange'];
  /** 任一表单状态变更时触发，参数一length不为0是说明该字段变更 */
  onFieldsChange?: Callbacks<Values>['onFieldsChange'];
  /** 验证成功并触发提交时触发 */
  onFinish?: Callbacks<Values>['onFinish'];
  /** 验证失败时触发 */
  onFinishFailed?: Callbacks<Values>['onFinishFailed'];
  /** 触发验证的事件 */
  validateTrigger?: string | string[] | false;

  preserve?: boolean;

  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;
}
```

### **`Item`**

有关验证字段的配置，这里只做例举，详情请参考 [async-validator](https://github.com/yiminghe/async-validator/)

```ts
interface FormItemProps {
  /**
   * 一个作为表单控件的直接子元素, 需要支持value/onChange接口或通过自己配置相关key
   * - 可以通过FormRenderChild和可选的noStyle手动实现更精细的状态和样式控制
   * - 如果传入一组FormItem，会使其作为布局组件使用
   * */
  children: React.ReactElement | FormRenderChild | React.ReactNode;
  /** 标题 */
  label?: string;
  /** 表单项的描述 */
  desc?: React.ReactNode;
  /** 禁用（视觉禁用） */
  disabled?: boolean;
  /** 标记该项为必填项（标题后会带红色*号） */
  required?: boolean;
  /** 指向内部包裹dom的ref */
  innerRef?: React.Ref<HTMLDivElement>;
  /** 显示右侧箭头 */
  arrow?: boolean;
  /**
   * 禁用样式/默认的验证样式，直接渲染表单控件, 只包含一个无样式的包装容器，可通过className和style控制容器样式
   * - 一般启用此项后都会通过children: FormRenderChild 自定义布局、验证样式
   * */
  noStyle?: boolean;
  /** true | 为false时组件以及组件状态都会被移除, 如果通过Form.List渲染表单，请使用其对应的字段控制api */
  valid?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
  /** true | 是否可见，不影响组件状态 */
  visible?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);

  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;

  /** 表单名路径 */
  name?: NamePath;
  /** 如果依赖项变化会触发重新render */
  dependencies?: NamePath[];
  /** 指定如何从事件中获取值 */
  getValueFromEvent?: (...args: EventArgs) => StoreValue;
  /** 用于在值更新前对其进行处理 */
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
  /** 验证规则 */
  rules?: Rule[];
  /** 判断字段是否应该更新 */
  shouldUpdate?: ShouldUpdate;
  /** 指定用于更新值的事件触发器 */
  trigger?: string;
  /** 配置规则触发的时机对应的事件 */
  validateTrigger?: string | string[] | false;
  /** 在某个值验证失败时中断后续验证器执行 */
  validateFirst?: boolean | 'parallel';
  /** 配置值映射到的属性, 如使用checkbox时应设置 valuePropName="checked" */
  valuePropName?: string;
  /** valuePropName的函数形式 */
  getValueProps?: (value: StoreValue) => object;
  /** 为ruleMesage配置额外的模板变量 */
  messageVariables?: Record<string, string>;
  /** 初始值，优先级小于form中设置的initialValue */
  initialValue?: any;
  onReset?: () => void;
  preserve?: boolean;

  /** 
   验证类型, 包含一下可选值
   string：必须为字符串类型。 这是默认类型。
   number：必须为数字类型。
   boolean：必须为布尔值类型。
   method：必须为函数类型。
   regexp：必须是RegExp的实例，或者是在创建新RegExp时不会生成异常的字符串。
   integer：必须为数字类型和整数。
   float：必须是数字类型和浮点数。
   array：必须是由Array.isArray确定的数组。
   object：必须为object类型，而不是Array.isArray。
   enum：值必须存在于枚举中。
   date：值必须由Date对象确定有效
   url：必须为url类型。
   hex：必须为十六进制类型。
   email：必须为电子邮件类型。
   any：可以是任何类型。
   * 
   * */
  type?: RuleType;
  /** 值只能为列表中指定的 */
  enum?: StoreValue[];
  /** 验证字段的确切长度。 对于字符串和数组类型，将对length属性进行比较，对于数字类型，此属性表示该数字的精确匹配 */
  len?: number;
  /** 使用min和max属性定义范围。 对于字符串和数组类型，将对length进行比较，对于数字类型，数字不得小于min或大于max */
  max?: number;
  min?: number;
  /** 定义验证消息 */
  message?: string | ReactElement;
  /** 指定需要通过验证的正则表达式 */
  pattern?: RegExp;
  /** 在验证之前转换值 */
  transform?: (value: StoreValue) => StoreValue;
  /** 自定义指定字段的验证函数 */
  validator?: Validator;
  /** 默认将只包含空格的必填字段视为错误， 此项用于控制此行为 */
  whitespace?: boolean;
}
```

### **`FormProvider`**

```ts
interface FormProviderProps {
  validateMessages?: ValidateMessages;
  onFormChange?: (name: string, info: FormChangeInfo) => void;
  onFormFinish?: (name: string, info: FormFinishInfo) => void;
}
```

### **`List`**

```ts
interface ListField {
  name: number;
  key: number;
  isListField: boolean;
}
interface ListOperations {
  add: (defaultValue?: StoreValue) => void;
  remove: (index: number) => void;
  move: (from: number, to: number) => void;
}
interface ListProps {
  name: NamePath;
  children?: (fields: ListField[], operations: ListOperations) => JSX.Element | React.ReactNode;
}
```
