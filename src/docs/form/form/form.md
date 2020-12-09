---
title: Form - 表单
group:
  title: 数据录入
  path: /form
---

# Form 表单

与 antd 一样通过底层库 [rc-field-form](https://github.com/react-component/field-form) 进行封装, 为了减少学习和使用成本，表单层面的 api 会大体上 **使用&表现** 一致，对验证体验/表单联动/表单行为等进行了优化，更简单易用。

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

通过`List`组件对一组列表值进行管理

<code src="./list.tsx" />

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

  /** 表单初始值 */
  initialValues?: Store;
  /** 通过useForm获取表单实例 */
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

有关验证字段的配置，这里只做例举，具体请参考 [async-validator](https://github.com/yiminghe/async-validator/)

```ts
interface FormItemProps {
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

  /** 包裹元素的类名 */
  className?: string;
  /** 包裹元素样式 */
  style?: React.CSSProperties;

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
  validateFirst?: boolean | 'parallel';
  valuePropName?: string;
  getValueProps?: (value: StoreValue) => object;
  messageVariables?: Record<string, string>;
  initialValue?: any;
  onReset?: () => void;
  preserve?: boolean;

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

`Title`, `SubTitle`, `Footer`与[list](/docs/view/list)中相关组件一样，请查看
