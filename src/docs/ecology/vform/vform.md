---
title: VForm - 虚拟表单
group:
    title: 生态
    path: /ecology
    order: 6000
---

`vform`是一些表单库常见功能的抽象实现, 完全脱离UI, 使用`vform`可以让你简单的在任何前端框架或原生js中实现自己的表单库.


## 简单示例

下面例子演示了如何通过`vform`来创建虚拟表单, 并绑定到视图, 这只是最简单的桥接实现, 开发中推荐使用[m78/form](/docs/form/form)以获得良好的开发体验和性能,
当然, 如果你要创建自己的`form`库, 使用`vform`会更合适.

<code src="./demo.tsx" />


## API

### VFormConfig
```ts
/**
 * 注意: 在vform verifyFirst默认为false
 * */
interface VFormConfig {
  /** 表单默认值 */
  defaultValue?: AnyObject;
  
  /** 
   * #### 继承至verify Config
   * */
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

### VForm

```ts
interface VForm {
  /** 表单默认值 */
  defaultValue: AnyObject;
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
  /**
   * 创建一个指向name的Field
   * - 如果指定name的Field已存在, 则返回已有字段
   * */
  createField: (fConf: VFieldConfig) => VField;
  /** 创建列表 */
  createList: (fConf: VListConfig) => VList;
  /** 字段状态改变触发, (touched/reset/验证) */
  updateEvent: CustomEvent<VFieldsProvideFn>;
  /** 触发updateEvent.emit, 如果多次调用, 会在下一次事件周期中统一触发 */
  tickUpdate: (...args: VFieldLike[]) => void;
  /** 字段值改变事件 */
  changeEvent: CustomEvent<VFieldsProvideFn>;
  /** 触发changeEvent.emit, 如果多次调用, 会在下一次事件周期中统一触发 */
  tickChange: (...args: VFieldLike[]) => void;
  /** 提交事件 */
  submitEvent: CustomEvent<VFormValueProvideFn>;
  /** 验证失败的回调, 失败分为form级的验证失败和field级的, 可通过isSubmit参数区分 */
  failEvent: CustomEvent<VFormFailFn>;
  /** 重置事件 */
  resetEvent: CustomEvent<VoidFunction>;
  /** 内部使用的`@m78/verify` 实例 */
  verifyInstance: Verify;
  /** 一个工具函数, 用来检测指定的name是否在一组filed中 */
  listIncludeNames: (names: NamePath[], filedList: VField[]) => boolean;
}
```

### VFieldConfig

```ts
interface VFieldConfig {
  /** 字段排序, 控制字段的验证顺序, 默认会根据字段创建顺序递增 */
  sort?: number;
  /** 字段默认值, 优先级大于form中设置的默认值 */
  defaultValue?: any;
  /** false | 设置为true时, 在创建后不再自动push到实例列表中 */
  separate?: boolean;

  /**
   * #### 继承至verify Schema
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

### VField

```ts
interface VField extends Schema {
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
   * #### 继承至verify Schema
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

### VListConfig

```ts
interface VListConfig extends VFieldConfig {
  /**
   * 用于为list同步field, 会在以下情况触发:
   * - defaultValue初始化赋值或手动更改list的value时, 如果value的长度大于或小于现有记录数量,
   * list内部会自动新增或删除记录来同步记录的长度
   * - 通过list.add()新增记录时, 如果没有传入任何field, 会新增一条空记录并触发onFillField
   *
   * 可以通过list上的add和withName方法来添加字段:
   * 
   * onFillField: (vl, key, index) => {
   *     vl.add({
   *       fields: [
   *         form.createField({ name: vl.withName(index, 'name'), separate: true }),
   *         form.createField({ name: vl.withName(index, 'desc'), separate: true }),
   *       ],
   *       key,
   *     });
   * },
   * 
   * */
    onFillField?: (vList: VList, key: string, index: number) => void;
}
```

### VList

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

### VListItem

```ts
interface VListItem {
  key: string;
  list: VField[];
}
```

### 其他类型

```ts
export type VFieldLike = VField | VList;

export type VFieldsProvideFn = (fields: VFieldLike[]) => void;

export type VFormValueProvideFn = (values: any) => void;

export type VFormFailFn = (fields: VFieldLike[], isSubmit: boolean) => void;
```
