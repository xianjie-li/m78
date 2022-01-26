---
title: Form - 表单
group:
  title: 数据录入
  path: /form
---

# Form 表单

一个灵活、高性能的 react 表单解决方案, 可用于解决各种复杂的表单场景

## 基本使用

基本使用, 通过`createForm()`或`useForm()`创建`form`实例, 并通过实例来渲染字段、提交、验证等.

<code src="./base.tsx" />

## 嵌套结构

将`name`声明为一个数组, 来将字段绑定到对象任意深度的`key`上.

<code src="./nest.tsx" />

## 动态表单

通过`form.List`来创建一个动态表单

<code src="./list.tsx" />

> 可以通过[m78/dnd](/docs/feedback/dnd)来为此示例添加拖拽功能

## 验证

验证主要是通过`validator`进行, `validator`接收一个或一组验证器来进行验证, 更多内置验证器请参考下方 api 部分

<code src="./verify.tsx" />

> 如果需要根据表单状态动态调整验证规则, 请参考下方的[动态 validator](/docs/form/form#%E5%8A%A8%E6%80%81validator);

### 验证器

验证器是一个普通 js 函数, 如果返回 string, 表示包含错误并将其作为错误反馈文本, 如果验证器内部发生了错误，该错误会被捕获，并使用`Error.message`来作为错误反馈文本.

> 空校验应交给 required 验证器完成, 自定义验证器时, 如果遇到空值的情况应视为成功

<code src="./validator.tsx" />

> 除了基础用法外, 验证器还为提示模板提供了特殊用法, 如果你需要定制提示模板, 更多细节请见[@m78/verify](https://github.com/m78-core/verify)

### 异步验证

异步验证由异步验证器完成, 它与常规验证器几乎相同, 区别是他通过`Promise`而不是`return`来获取错误文本

<code src="./async-validator.tsx" />

> 由于验证是逐个执行的, 因此最好是将同步验证器放在异步验证器之前

## 表单联动

组件提供了能覆盖绝大多数联动场景的 4 个 prop:

- `valid`: 一个 boolean 值或返回 boolean 的函数, 用于动态控制表单是否有效, 无效表单不会渲染并且不会参与提交与验证
- `hidden`: 一个 boolean 值或返回 boolean 的函数, 用于动态控制表单是否显示, 被隐藏的表单仍然会参与提交与验证
- `disabled`: 一个 boolean 值或返回 boolean 的函数, 用于动态控制表单是否禁用(需要表单控件支持 disabled), 无效表单不会渲染并且不会参与提交与验证
- `validator`: 为`validator`传入一个动态返回验证器的函数, 用来动态控制表单验证规则

传统`react`表单都是非常低效的, 每一次`change`会导致整个表单区域重绘, `Form`将更新控制在了字段级别, 从而达到更好的性能.

因此, 在联动表单中, 必须要传入`deps`来与关联表单控件进行绑定从而达到同步更新的效果.

### valid

<code src="./valid.tsx" />

### disabled

<code src="./disabled.tsx" />

### hidden

<code src="./hidden.tsx" />

### 动态 validator

<code src="./dynamic-validator.tsx" />

## ValueRender

用来获取并渲染当前表单值

<code src="./value-render.tsx" />

## 布局/样式

`Form`与其他表单库的一个显著区别是: 对结构的限制非常小, 你可以灵活的使用现有的布局组件来排布你的表单控件, 比如`m78/layout`中的布局组件.

同时, 你也可以完全覆盖默认的样式, 从 0 开始编写表单布局.

### 横向/纵向

除了默认的纵向`label`排列方式外, 你还可以将`label`水平放置

<code src="./horizontal.tsx" />

### 响应式表单

通过[`m78/layout`](/docs/base/layout#响应式栅格)来轻松的实现响应式表单.

调整页面宽度查看下方示例的效果.

<code src="./grids.tsx" />

### 气泡型提示

在一些布局空间比较小和固定的场景中, 可以通过气泡来显示提示和错误信息

<code src="./bubble-tips.tsx" />

### 自定义布局

通过`fieldCustomer`和`listCustomer`来分别彻底的自定义`Field`和`List`的布局, 也可以通过对应组件上的`customer`来单独进行配置.

> 使用自定义布局后, 其他样式类的配置都会失效

<code src="./customer.tsx" />

## vform/verify

此库通过[`@m78/vform`](/docs/ecology/vform)和[`@m78/verify`](https://github.com/m78-core/verify)作为底层实现:

- `vform`是一个脱离 UI 的虚拟表单库, 专注于值的收集与验证等表单底层操作.
- `verify`是一个验证库

如果本库中的用例无法满足你的需求, 可以尝试搭配`vform`和`verify`的 api 来解锁更多能力.

## 常见问题

- 为什么实例中`const Form = useForm()`中`Form`作为实例却使用大写?

在jsx中写起来会更工整

- 通过接口获取到表单默认值后, 如何设置到表单?

分为两种情况, 一是需要使用`form.reset()`时, 可以使用`createForm()`来在接口请求完成后再创建form实例, jsx中判断form示例存在后再渲染表单;
另一种情况是不需要`reset()`功能, 接口拿到数据后通过`form.setValues(values)`设置当前表单值即可


## API

### createForm/useForm

`useForm`是`createForm`的一个便利性封装, 两者都接收相同的配置对象并返回`form`实例

```ts
import {createForm} from "m78/form";

const form = createForm({...});

const form = useForm({...});
```

### FormConfig

创建 form 的配置对象. 继承了`vform`的和`verify`创建配置

```ts
interface RFormConfig {
  /** #### 扩展配置 #### */
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

  /** #### vform配置 #### */
  /** 表单默认值 */
  defaultValue?: AnyObject;

  /** #### verify配置 #### */
  /** true | 当其中一项验证失败后，停止后续字段的验证 */
  verifyFirst?: boolean;
  /**
   * 语言包配置，错误模板可以是字符，也可以是接收Meta返回字符的函数, 传入对象会与当前对象深合并，所以如果只更改了部分错误模板，不会影响到其他模板
   * - 模板字符串会被注入以下变量, 通过{name}进行插值，如果插值语法和原有字符冲突，使用\\{name}来避免插值
   *    - name:  Schema.name
   *    - label: 对应Schema.label, 未传时与 name相同，用于展示字段名时应始终使用此值
   *    - value: 字段值, 应只在验证值为基础类型时使用
   *    - valueType: value类型的字符串表示
   * - 在特定的验证器中还会注入额外的插值，具体可以查看对应验证器的文档
   * */
  languagePack?: AnyObject;
}
```

### Form

form 实例, 继承至`vform`, 扩展了几个便于在`react`中使用的`api`

```ts
interface Form {
  /** #### 扩展api #### */
  /** 构建一个表单字段 */
  Field: (props: FieldProps) => ReactElement<any, any> | null;
  /** 构建一组表单字段 */
  List: (props: ListProps) => ReactElement<any, any> | null;
  /** 实时渲染一个值 */
  ValueRender: (props: ValueRenderProps) => ReactElement<any, any> | null;

  /** #### vform api #### */
  /** 值是否被更新过 */
  readonly changed: boolean;
  /**
   * 是否被操作过, (验证/更新值)
   * - 将此项由true改为false时, 会将所有Field的touched同时改为false
   * */
  touched: boolean;
  /** 获取指定name的Field, 包括children中的子字段 */
  getField: (name: NamePath) => VField | null;
  /**
   * 获取所有Field, 不包括listField的子字段
   * - 传入validIsTrue: true时, 仅获取valid为true的字段
   * */
  getFields: (validIsTrue?: boolean) => VFieldLike[];
  /**
   * 获取所有Field, 包括children中的子字段
   * - 传入validIsTrue: true时, 仅获取valid为true的字段, 如果一个list的valid为false, 则会过滤掉其所有子级
   * */
  getFlatFields: (validIsTrue?: boolean) => VFieldLike[];
  /** 获取指定name的value */
  getValue: (name: NamePath) => any;
  /** 获取所有value */
  getValues: () => any;
  /** 设置value为指定值 */
  setValues: (v: AnyObject) => void;
  /** 移除指定name的字段 */
  remove: (name: NamePath) => void;
  /** 重置所有字段, 还原value为初始值, 重置error和touched */
  reset: () => void;
  /** 触发提交事件, 若验证未通过则不会触发事件 */
  submit: () => Promise<void>;
  /** 校验所有valid为true的字段, 未通过时resolve包含错误信息的所有Field */
  verify: () => Promise<VField[] | null>;
  /** 字段状态改变触发, (touched/reset/验证) */
  updateEvent: CustomEventWithHook<VFieldsProvideFn>;
  /** 字段值改变事件 */
  changeEvent: CustomEventWithHook<VFieldsProvideFn>;
  /** 提交事件 */
  submitEvent: CustomEventWithHook<VFormValueProvideFn>;
  /** 验证失败的回调, 失败分为form级的验证失败和field级的, 可通过isSubmit参数区分 */
  failEvent: CustomEventWithHook<VFormFailFn>;
  /** 重置事件 */
  resetEvent: CustomEventWithHook<VoidFunction>;

  /** #### 其他api #### */
  /** 表单默认值 */
  defaultValue: AnyObject;
  /**
   * 创建一个指向name的Field
   * - 如果指定name的Field已存在, 则返回已有字段
   * */
  createField: (fConf: VFieldConfig) => VField;
  /** 创建列表 */
  createList: (fConf: VListConfig) => VList;
  /** 触发updateEvent.emit, 如果多次调用, 会在下一次事件周期中统一触发 */
  tickUpdate: (...args: VFieldLike[]) => void;
  /** 触发changeEvent.emit, 如果多次调用, 会在下一次事件周期中统一触发 */
  tickChange: (...args: VFieldLike[]) => void;
  /** 内部使用的`@m78/verify` 实例 */
  verifyInstance: Verify;
  /** 一个工具函数, 用来检测指定的name是否在一组filed中 */
  listIncludeNames: (names: NamePath[], filedList: VField[]) => boolean;
}
```

### FieldProps

`Field`组件的 props, 继承至`vfield`和`verify schema`对象

```ts
interface FieldProps {
  /**
   * ##### 常用 #####
   * */
  /** 用来在source中取值的key */
  name: NamePath;
  /** field内容, 必须是一个能支持changeKey/valueKey对应props作为控制的受控表单控件, 控制key默认为onChange/value */
  children: React.ReactElement;
  /** 一组验证器, 可以传入一个返回一组验证器的函数来实现动态验证规则 */
  validator?:
    | (Validator | AsyncValidator)[]
    | ((form: VForm, field: VFieldLike) => (Validator | AsyncValidator)[]);
  /** 字段默认值, 优先级大于form中设置的默认值 */
  defaultValue?: any;

  /**
   * ##### 表单联动  #####
   * */
  /** true | valid为false的field不会参与验证和提交, 并且处于不可见状态 */
  valid?: boolean | ((form: VForm, field: VFieldLike) => boolean);
  /** false | 组件是否可见, 不影响field的验证和值获取 */
  hidden?: boolean | ((form: VForm, field: VFieldLike) => boolean);
  /** false | disabled状态的表单不会参与验证和提交, 控制表单控件的disabled(需要控件支持), 与valid的区别是他禁用控件而不是隐藏 */
  disabled?: boolean | ((form: VForm, field: VFieldLike) => boolean);
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
  bind?: any;
  /** 直接传入一个field对象来代替内部自动创建的对象 */
  field?: VFieldLike;

  /**
   * ##### 其他VFieldConfig #####
   * */
  /** 字段排序, 控制字段的验证顺序, 默认会根据字段创建顺序递增 */
  sort?: number;
  /** false | 设置为true时, 在创建后不再自动push到实例列表中 */
  separate?: boolean;

  /**
   * ##### 其他verify Schema #####
   * */
  /** 如果对象为嵌套结构(数组、对象)，对其执行嵌套验证, 子项的name前会自动添加其所有父级的name */
  schema?: Schema[];
  /** 验证值为array或object时, 所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: Omit<Schema, 'name'>;
  /** 在对值进行操作、验证前将其转换, 对于引用类型的值，应拷贝对象进行转换以防止对原对象造成破坏 */
  transform?: (value: any) => any;
}
```

### ListProps

`List`组件的`props`, 继承所有`FieldProps`

```ts
interface ListProps extends Omit<FieldProps, 'children'> {
  /** 渲染list children */
  children: (props: ListRenderProps) => React.ReactElement;
  // ...除了children外的所有FieldProps都可用
}
```

### ListRenderProps

`List`的`children()`接收的对象

```ts
interface ListRenderProps {
  /** 用于渲染的item列表 */
  list: ListItem[];
  /** 新增一条记录, val会作为记录的初始值 */
  add: (val: any) => void;
  /** 移除指定index的记录 */
  remove: (index: number) => void;
  /** 将index的记录移动到index2的位置 */
  move: (index: number, index2: number) => void;
  /** 交换两条记录的位置 */
  swap: (index: number, index2: number) => void;
}
```

### ListItem

描述了`List`的一个子项

```ts
interface ListItem {
  /** 所在list的key */
  key: string;
  /** 用于绑定到list的对象 */
  bind: any;
}
```

### 自定义渲染器

`Field`和`List`的自定义渲染器

```ts
type LayoutCustomer = (props: FieldRenderProps, child: React.ReactElement) => React.ReactNode;

interface FieldRenderProps {
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
```

### VField

一个虚拟字段对象, 在一些 api 中作为参数接收

```ts
interface VField {
  /** 字段默认值 */
  readonly defaultValue: any;
  /** name的字符串表示 */
  readonly key: string;
  /** 排序, 用于控制验证顺序 */
  sort: number;
  /** 值是否被更新过 */
  readonly changed: boolean;
  /** 是否被操作过, (验证/更新值) */
  touched: boolean;
  /** value */
  value: any;
  /** 是否正在验证 */
  validating: boolean;
  /** 最后一次执行验证时的错误信息 */
  error: string;
  /** 是否生效, 未生效的表单不会参与验证, 获取值时也会被忽略 */
  valid: boolean;
  /** 验证, 未通过时resolve包含错误内容的Field信息 */
  verify: () => Promise<VField | null>;
  /**
   * 重置字段, 还原value为初始值, 重置error和touched
   * 如果是list字段, 会将列表还原为初始状态, 仅保留add时指定了isDefault的项
   * */
  reset: () => void;

  /**
   * ##### 继承至Schema #####
   * */
  /** 用来在source中取值的key */
  name: NamePath;
  /** 用于验证显示的字段名, 不传时取name转换为string的值 */
  label?: string;
  /**
   * 验证器或验证器数组
   * - 前一个验证器执行异常时会停止后续验证器执行
   * - 验证器的执行顺序与数组中的顺序有关，所以应将优先级更高的验证器放在前面，如 [required(), dateTime()]
   * - 如果是异步验证，异步验证器应始终放在前面
   * */
  validator?: Validator | AsyncValidator | (Validator | AsyncValidator)[];
  /** 如果对象为嵌套结构(数组、对象)，对其执行嵌套验证, 子项的name前会自动添加其所有父级的name */
  schema?: Schema[];
  /** 验证值为array或object时, 所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: Omit<Schema, 'name'>;
  /** 在对值进行操作、验证前将其转换, 对于引用类型的值，应拷贝对象进行转换以防止对原对象造成破坏 */
  transform?: (value: any) => any;
}
```

### VList

一个虚拟列表字段对象, 在一些 api 中作为参数接收

```ts
interface VList extends VField {
  /** 存放list子项 */
  list: VListItem[];
  /** 创建子项name的帮助函数 */
  withName: (index: number, name?: NamePath) => NamePath;
  /** 新增一条记录 */
  add: (para?: {
    /** [] | 待添加的一组Field, 没有传入任何field时会作为空记录并触发onFillField */
    fields?: VFieldLike[];
    /** 添加到指定key的位置, 未传时添加到底部 */
    key?: string;
    /** 是否为list的初始项, 重置时会还原为初始项组成的list */
    isDefault?: boolean;
    /** 触发onFillField自动添加记录时, 会以此值作为新增记录的初始值 */
    fillValue?: any;
  }) => void;
  /** 移除指定index的记录 */
  remove: (index: number) => void;
  /** 将index的记录移动到index2的位置 */
  move: (index: number, index2: number) => void;
  /** 交换两条记录的位置 */
  swap: (index: number, index2: number) => void;
  /**
   * 获取展开的children
   * - 传入validIsTrue: true时, 仅获取valid为true的字段
   * */
  getFlatChildren: (validIsTrue?: boolean) => VFieldLike[];
}
```
