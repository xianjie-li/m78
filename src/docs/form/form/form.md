---
title: Form - 表单
group:
  title: 数据录入
  path: /form
---

# Form 表单

与 antd 一样，通过 [rc-field-form](https://github.com/react-component/field-form) 库进行封装, 为了减少学习和使用成本，表单层面的 api 基本 **使用&表现** 一致，额外对验证体验/表单联动进行了优化，使其更易用。

## 基本使用

基本的值收集和验证能力，`Form.Item`可以直接使用包含`value/onChange`接口的表单控件(也可以通过配置定制从表单取值的方式)。

<code src="./base.tsx" />

## 嵌套结构

支持对象嵌套和数组嵌套

<code src="./neest.tsx" />

## 联动

相比 antd, `Form`组件提供了更简单易用的表单联动支持, 并且可以自动地清理已经失效的字段

<code src="./linkage.tsx" />

💡 the gist:

1. 通过`valid`或`visible`返回`boolean`状态，字段将根据返回来决定是否渲染表单，支持直接传入`boolean`值
2. 为了更好的性能，默认情况下某一表单值变更不会影响到其他的字段，通过手动传入`dependencies`来监听对应字段值的变化
3. `valid`和`visible`的区别是，前者会在接收到`false`时清理表单值，并在为`true`时还原，后者仅仅是简单的进行`display`切换，不会对已有值造成影响

## 动态表单

通过`List`组件对一组数组值进行管理

<code src="./list.tsx" />

## 验证

支持三种方式传递验证选项

1. 通过`rules`来进行[async-validator](https://github.com/yiminghe/async-validator/)规则配置, 与`antd`用法完全一致
2. 通过`Form.Item`直接配置`required`、`type`、`max`等验证配置，组件内部会将其转换为第一种后验证
3. 通过`Form`直接传入`rules`, 这种方式可以大大保持`jsx`的干净度。

<code src="./validate.tsx" />

⛔ 三种验证方式可以混用，但是最好别这么做。验证顺序是 `直接传入` > `rules` > `Form配置`

## API

### **`Form`**

```ts
interface FormProps extends ComponentBaseProps, FormProps, ListFormType {
  /** false | 隐藏所有必选标记 */
  hideRequiredMark?: boolean;
  /** 直接传入rules配置来进行表单验证 */
  rules?: {
    [key: string]: RuleObject | RuleObject[];
  };
}

interface ListFormType {
  /** false | 是否去掉列表项边框 */
  notBorder?: boolean;
  /** 'vertical' | 横向表单/纵向表单 */
  layout?: 'horizontal' | 'vertical';
  /** 1 | 当大于1时，表单为多列模式 */
  column?: number;
  /** false | 不限制最大宽度 */
  fullWidth?: boolean;
  /** false | 禁用(样式层面) */
  disabled?: boolean;
}

interface FormProps {
  /** 表单初始值 */
  initialValues?: Store;
  /** 通过useForm设置表单实例 */
  form?: FormInstance;
  /** 子元素，支持render props(不推荐) */
  children?: RenderProps | React.ReactNode;
  /** 'form' | 自定义表单渲染方式, 为false时禁用内嵌form */
  component?: false | string | React.FC<any> | React.ComponentClass<any>;
  /** 控制表单字段状态。 仅在Redux中使用 */
  fields?: FieldData[];
  /** 配置FormProvider所对应的name */
  name?: string;
  /** 自定义验证消息模板 */
  validateMessages?: ValidateMessages;
  /** 当表单值变更时触发 */
  onValuesChange?: Callbacks['onValuesChange'];
  /** 任一表单状态变更时触发，参数一length不为0是说明该字段变更 */
  onFieldsChange?: Callbacks['onFieldsChange'];
  /** 验证成功并触发提交时触发 */
  onFinish?: Callbacks['onFinish'];
  /** 验证失败时触发 */
  onFinishFailed?: Callbacks['onFinishFailed'];
  /** 触发验证的事件 */
  validateTrigger?: string | string[] | false;
}
```

### **`Item`**

有关验证字段的配置，这里只做例举，具体请查看 [rc-field-form](https://github.com/react-component/field-form)

```ts
interface FormItemProps
  extends ComponentBaseProps,
    Omit<FieldProps, 'children'>,
    Omit<RuleObject, 'validateTrigger'> {
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
  /** 禁用表单，如果表单控件不识别disabled属性，此项仅在样式上表现为"禁用" */
  disabled?: boolean;
  /** 禁用样式，直接渲染表单控件 */
  noStyle?: boolean;
  /** true | 为false时将组件以及组件状态都会被移除, 使用List的嵌套表单状态不会移除，请直接使用List相关API操作 */
  valid?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
  /** true | 是否可见，不影响组件状态 */
  visible?: boolean | ((namePath: NamePath, form: FormInstance) => boolean);
}

interface FieldProps {
  name?: NamePath;
  /** @private Passed by Form.List props. */
  isListField?: boolean;
  children?:
    | React.ReactElement
    | ((control: ChildProps, meta: Meta, form: FormInstance) => React.ReactNode);
  /**
   * Set up `dependencies` field.
   * When dependencies field update and current field is touched,
   * will trigger validate rules and render.
   */
  dependencies?: NamePath[];
  getValueFromEvent?: (...args: EventArgs) => StoreValue;
  name?: InternalNamePath;
  normalize?: (value: StoreValue, prevValue: StoreValue, allValues: Store) => StoreValue;
  rules?: Rule[];
  shouldUpdate?: ShouldUpdate;
  trigger?: string;
  validateTrigger?: string | string[] | false;
  validateFirst?: boolean;
  valuePropName?: string;
  getValueProps?: (value: StoreValue) => object;
  messageVariables?: Record<string, string>;
  initialValue?: any;
  onReset?: () => void;
}

interface BaseRule {
  enum?: StoreValue[];
  len?: number;
  max?: number;
  message?: string | ReactElement;
  min?: number;
  pattern?: RegExp;
  required?: boolean;
  transform?: (value: StoreValue) => StoreValue;
  type?: RuleType;
  validator?: Validator;
  whitespace?: boolean;
  /** Customize rule level `validateTrigger`. Must be subset of Field `validateTrigger` */
  validateTrigger?: string | string[];
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

### **布局组件**

`Title`, `SubTitle`, `Footer`与[list](/view/list)中相关组件一样，请查看
