<h1 align="center" style="color: #61dafb;">@m78/form</h1>
<h1 align="center" style="font-size: 80px;color:#61dafb">🍭</h1>

<br>

<p align="center">一个多用途的headless form库, 可用于客户单和服务端, 提供了值收集 / 验证 / 表单状态管理等等表单功能.</p>



<br>

## Install

```shell
npm install @m78/form
```

<br>

## Feature

- 无UI, 适合作为底层库集成到各个框架或平台, 但也可以非常简单的在不绑定的情况下使用
- 所有表单库必须的能力, 如值收集 / 验证 / 联动 / 动态表单 / list 表单等
- 独立提供了schema验证, 可用于服务端或其他仅需验证的场景, 如 json验证, 函数参数验证等
- 易于扩展和定制的验证消息模板

<br>

> 官方提供了[React集成](https://github.com/xianjie-li/m78/tree/master/packages/m78/src/form)

<br>



## overview

通过 createForm(formConfig) 创建form实例,  form实例上提供了 设置/获取值, 设置/获取状态, 提交, 验证, 列表操作, 事件绑定等等api.

创建时可同时提供schemas配置,  通过 Schema 配置来实现对values的约束和验证.



如果仅需要验证功能或是在服务端等场景下, 则可以使用 createForm(formConfig) 代替, 它有更快的执行速度和更少的api.



## createForm

创建form实例,  包含完整的 收集 / 验证 / 联动 / 动态表单 / list 表单 等功能

```ts
import { createForm } from "@m78/form";

const form = createForm({
  schemas: {...},
  values: {...},
});

// 一些api示例, 具体见API Instance部分

// 状态/值
form.getValue(‘fieldName’);
form.getValues(‘fieldName’);
form.setValue(‘fieldName’, 111);
form.setValues({ xxx: 111 });
form.getChanged(‘fieldName’);
form.getFormChanged();
form.getTouched(‘fieldName’);
form.getChangedValues();
form.getDefaultValues();

// 表单操作
form.submit();
form.reset();
form.verify().then(rejects => {
	if (rejects) console.log(‘error’, rejects);
});

// list操作
form.getList(…);
form.listAdd(…);
form.listRemove(…);
form.listMove(…);
form.listSwap(…);

// 事件
form.events.update.on(cb);
form.events.change.on(cb);
form.events.submit.on(cb);
form.events.fail.on(cb);
```



## createVerify

仅提供验证功能的api,  资源占用更少, 并去除了一些校验场景中不需要使用的 form 功能, 更适合在服务端使用, 你也可以在其他仅需要校验的场景使用它.

```ts
import { createVerify } from "@m78/form";

const verify = createVerify({
  schemas: {...}
});

verify.check({
  name: 'm78',
  age: 2,
}).then(rejects => {
  if (rejects) console.log('error', rejects);
})
```



## Schema

### 基础

schema是一个如下结构的对象

```ts
// 表示结构: { name: 'm78', describe: 'front kits' }
const schema: FormSchema = {
  schema: [
    {
      label: "姓名",
      name: "name",
      validator: [required(), string({ min: 2, max: 5 })],
    },
    {
      label: "简介",
      name: "describe",
      validator: string({ max: 20 }),
    },
  ],
  // 根schema表示的是对象本身, 你也可以对其进行配置
  // validator: required(),
}
```



### 复杂结构的Schema

```ts
const schema: FormSchema = {
  schema: [
    {
      label: "姓名",
      name: "name",
      validator: [required(), string({ min: 2, max: 5 })],,
    },
    {
      label: "简介",
      name: "describe",
      validator: string({ max: 20 }),
    },
    // 包含两个字段的对象: base: { age: 1, sex: 1 }
    {
      label: "基础信息",
      name: "base",
      schema: [
        {
          name: "age",
        },
        {
          name: "sex",
        },
      ],
    },
    // 包含三个项的数组: address: ['xx', 'xxx', 'xxxx']
    {
      label: "地址",
      name: "address",
      schema: [
        {
          name: 0,
        },
        {
          name: 1,
        },
        {
          name: 2,
        },
      ],
    },
    // 一个任意长度的数组或对象, 其子项的结构必须是 { field1: 'xxx', field2: 'xxx' }
    {
      label: "其他",
      name: "other",
      eachSchema: {
        schema: [
          {
            name: "filed1",
          },
          {
            name: "filed2",
          },
        ]
      },
    },
  ],
}
```



### 动态Schema

通过 dynamic 根据当前的验证值动态设置schema项

```ts
const schema: FormSchema = {
  schema: [
    {
      label: "姓名",
      name: "name",
      validator: [required(), string({ min: 2, max: 5 })],
    },
    {
      label: "密码",
      name: "psw",
      validator: required(),
    },
    {
      label: "再次输入",
      name: "psw2",
      // 声明对字段psw的依赖, 使对应字段发生变更时自身也会同步变更, 此配置主要用于提升性能, 避免不必要的渲染
      deps: ["psw"],
      // dynamic使我们可以根据当前表单的状态动态调整schema配置
      dynamic: (formIns) => ({
        // valid为true时, 字段才会显示并参与验证和提交
        valid: !!formIns.getValue("psw"),
        // 这里我们自定义了一个验证器, 要求psw2和psw的值必须相同
        validator: [
          required(),
          ({ value }) => {
            if (value !== formIns.getValue("psw")) {
              return "两次输入不一致";
            }
          },
        ],
      }),
    },
  ],
}
```



### List

配置项为list后, 可使用list系列的api对其进行操作

```ts
const schema: FormSchema = {
  schema: [
    {
      label: "姓名",
      name: "name",
      validator: [required(), string({ min: 2, max: 5 })],
    },
    {
      label: "简介",
      name: "describe",
      validator: string({ max: 20 }),
    },
    {
      label: "物品信息",
      name: "things",
      // 设置该项为list项
      list: true,
      // 每一个子项应遵循的的schema
      eachSchema: {
        // 由于这里是多个子字段, 所以传入了schema数组, 如果是单个字段可以直接在eachSchema中配置字段
        schema: [
          {
            name: "title",
            validator: required(),
          },
          {
            name: "remark",
          },
        ],
      },
    },
  ],
}
```





## 验证器

验证器是一个普通 js 函数, 通过如下方式使用

```ts
{
  name: "user",
  validator: required(),  // 单个验证器
},
{
  name: "describe",
  validator: [required(), string({ min: 4 })],  // 多个验证器通过数组传入
},
```



你可以在[这里](https://github.com/xianjie-li/m78/tree/master/packages/form/src/validator)找到所有内置验证器.

此外, 只有空验证器(比如`required()`)才会对空值进行校验, 其他验证器都会忽略空值.

验证器对空值的定义不仅仅是 null, 具体来说, 是以下值:

```shell
undefined, null, "", NaN, [], {}, 空白字符
```



> 使用函数验证器而不是常见的的字符串验证的原因是: 更好的类型检测, 清晰的来源, 更易定制和扩展, 无 DSL 和几乎为 0 的学习成本.



### 内置验证器

你可以在[这里](https://github.com/xianjie-li/m78/tree/master/packages/form/src/validator)找到所有内置验证器.



### 自定义验证器

验证器分为同步验证器和异步验证器, 验证器接收一些当前上下文的信息(配置/当前值/实例/name 等), 并返回验证结果.

```ts
function string({ value }) {
  if (typeof value !== "string") return "必须为字符类型";

  // 如果验证器抛出错误，则将错误对象的message作为验证反馈, 通过下面代码可以实现相同的效果
  if (typeof value !== "string") throw new Error("必须为字符类型");
}
```



验证器可以是异步的

```ts
async function verifyUser({ value }) {
  const res = await someAuthService(value);

  if (!res.pass) return "对不起, 你没有权限执行此操作";

  // 同样可以通过抛出错误来使验证失败, err.message 会作为错误提示
  if (!res.pass) throw new Error("对不起, 你没有权限执行此操作");
}
```



## name 取值示例

Schema 的 name 支持嵌套取值, 并遵循以下规则

```ts
{
	name: 'key',	// 字段取值, 对应 source.key
	name: 0,		  // 数组取值, 对应 source[0]
	name: ['user', 'name'],		    // 对象嵌套取值, 对应 source.user.name
	name: ['list', 1, 'title'],		// 对象数组嵌套取值, 对应 source.list[1].name
	name: [0, 'title'],		// 数组嵌套取值, 对应 source[1].name
}
```



<br>

## APIs

### createForm

```ts
/** 创建form实例 */
function createForm(config: FormConfig): FormInstance
```



### createVerify

```ts
/**
 * 创建verify实例, verify用于纯验证的场景, 在需要将form用于服务端或是仅需要验证功能的场景下非常有用, 在数据体量较大时能显著提升执行速度
 *
 * > 用于创建verify实例时, 部分 FormConfig 会被忽略, 如 autoVerify
 * */
function createVerify(config: FormConfig): FormVerify
```



### Config

```ts
/** Form 创建配置 */
export interface FormConfig {
  /**
   * false | 当其中一项验证失败后，停止后续字段的验证
   *
   * 对于嵌套验证器, 父级验证失败后会始终跳过子级
   * */
  verifyFirst?: boolean;
  /** 描述表单值结构的对象 */
  schemas: FormSchemaWithoutName;
  /** 默认值 */
  values?: any;
  /** 创建verify实例时为false, 否则为true | 值变更时是否自动触发verify */
  autoVerify?: boolean;
  /**
   * 语言包配置，错误模板可以是字符，也可以是接收Meta返回字符的函数
   * - 传入的配置对象会与默认语言配置深合并，所以如果只更改了部分错误模板，不会影响到其他模板
   * - 模板字符串会被注入以下变量, 通过{name}进行插值，如果插值语法和原有字符冲突，使用\\{name}来避免插值
   *    - name:  Schema.name
   *    - label: 对应Schema.label, 未传时与 name 相同，用于展示字段名时应始终使用此值
   *    - value: 字段值, 应只在验证值为基础类型时使用
   *    - type: 表示value类型的字符串
   * - 在特定的验证器中还会注入额外的插值，具体可以查看对应验证器的文档
   * */
  languagePack?: AnyObject;
  /** true | 配置是否忽略怪异值(schema中未声明的值), 关闭后未声明的值会产生错误 */
  ignoreStrangeValue?: boolean;
  /** 自定义内部的事件创建器(通常不需要关注, 用于实现ui层时扩展事件订阅器用法) */
  eventCreator?: AnyFunction;
}
```





### Instance

```ts
/** Form 实例 */
export interface FormInstance {
  /* #### 继承至 FormVerifyInstance #### */
  /** 获取Form创建配置 */
  getConfig(): FormConfig;

  /** 获取当前数据 */
  getValues<T = any>(): T;

  /** 获取指定name的值 */
  getValue<T = any>(name: NamePath): T;

  /** 获取对dynamic/valid/list等特殊项进行处理进行处理后的完整schema副本 */
  getSchemas(): FormSchemaWithoutName;

  /** 获取对dynamic/valid/list等特殊项进行处理进行处理后的指定schema副本 */
  getSchema(name: NamePath): FormSchema | FormSchemaWithoutName | null;
  
  /* #### 自有api #### */
  
  /** 指定值是否与默认值相同 */
  getChanged(name: NamePath): boolean;

  /** 表单当前值是否与默认值相同 */
  getFormChanged(): boolean;

  /** 指定值是否被操作过 */
  getTouched(name: NamePath): boolean;

  /** 设置指定值touched状态 */
  setTouched(name: NamePath, touched: boolean): void;

  /** 表单是否被操作过 */
  getFormTouched(): boolean;

  /** 设置整个表单的touched状态 */
  setFormTouched(touched: boolean): void;

  /** 设置所有值 */
  setValues(values: any): void;

  /** 设置指定name的值 */
  setValue(name: NamePath, val: any): void;

  /** 获取当前的默认值 */
  getDefaultValues<T = any>(): T;

  /** 重新设置当前的默认值, 设置后, 下一次reset会使用此值 */
  setDefaultValues(values: any): void;

  /**
   * 获取变更的值, 没有变更时返回null
   * - 如果values本身是一个基础类型值, 则会在与默认值不同时直接返回
   * - 只有根级别的字段会参与对比, 如果根字段发生了变更, 其子级字段会一同返回
   * - values是对象时, 会将defaultValue中存在但被删除的字段返回为初始值(字符串为"", 其他类型为null)
   * */
  getChangedValues(): any | null;

  /** 获取错误信息, 注意: 此方法不会自动执行验证, 仅用于获取最后一次验证后的结果 */
  getErrors(name?: NamePath): FormRejectMeta;

  /** 重置表单状态 */
  reset(): void;

  /** 执行验证, 若验证通过则触发submit事件并返回null, 失败时返回包含错误信息的meta数组 */
  submit(): Promise<FormRejectMeta | null>;

  /**
   * 对当前values执行校验, 验证成功时返回null, 失败时返回包含错误信息的meta数组
   *
   * 若传入extraMeta, 会将其扩展到该次验证的 FormVerifyMeta 中, 然后你可以在验证器/验证错误信息等位置对其进行访问
   * */
  verify(
    name?: NamePath,
    extraMeta?: AnyObject
  ): Promise<FormRejectMeta | null>;

  /**
   * debounce版本的verify, 处理高频调用时可以使用, cb会在成功或失败时触发, 失败时包含错误信息
   *
   * 注意: 由于防抖机制, 连续调用时, 大部分验证都会被忽略, 所以cb不是必定触发的, 通常只有第一次和最后一次调用触发
   * */
  debounceVerify: (
    name?: NamePath,
    cb?: (error?: FormRejectMeta) => void
  ) => void;

  /**
   * 获取指定list的数据, 若未在schema中配置为list则返回null. 根schema设置为list时, 可传入`[]`来获取
   * */
  getList<Item = any>(name: NamePath): Array<FormListItem<Item>> | null;

  /** 为list新增一项或多项, index为添加到的索引位置, 默认追加到结尾. 若name不是有效list或其他原因导致失败会将返回false */
  listAdd(name: NamePath, items: any | any[], index?: number): boolean;

  /** 移除list指定索引的元素 */
  listRemove(name: NamePath, index: number): boolean;

  /** 移动list的指定元素到另一位置 */
  listMove(name: NamePath, from: number, to: number): boolean;

  /** 交换list的两个元素 */
  listSwap(name: NamePath, from: number, to: number): boolean;

  /** 重新设置当前schemas, 通常需要在重新设置schema后手动自动执行一次verify()来清理之前的校验状态 */
  setSchemas(schema: FormSchemaWithoutName): void;

  /** 事件 */
  events: {
    /** 字段值或状态变更时, 这里是更新ui状态的理想位置 */
    update: CustomEvent<FormNamesNotify>;
    /** 字段值改变事件. update事件包含了change的触发场景 */
    change: CustomEvent<FormNamesNotify>;
    /** 提交事件 */
    submit: CustomEvent<EmptyFunction>;
    /** 验证失败的回调, 由 setValue 触发自动校验时, isValueChangeTrigger 为 true */
    fail: CustomEvent<
      (errors: FormRejectMeta, isValueChangeTrigger?: boolean) => void
    >;
    /** 重置事件 */
    reset: CustomEvent<EmptyFunction>;
  };

  /**
   * 创建用于update/change事件回调的过滤器, 帮助识别变更是否与当前name关联,
   * 传入deps时, 会在deps中指定的name触发事件时触发
   * */
  notifyFilter: (
    name: NamePath,
    notify: FormNamesNotify,
    deps?: NamePath[]
  ) => FormNamesNotify;
}
```





### VerifyInstance

```ts
/** 仅包含验证必须功能的实例, FormInstance 的子集, 不直接对外暴露, 会在内部以及部分schema api中作为参数传入 */
export interface FormVerifyInstance {
  /** 获取Form创建配置 */
  getConfig(): FormConfig;

  /** 获取当前数据 */
  getValues<T = any>(): T;

  /** 获取指定name的值 */
  getValue<T = any>(name: NamePath): T;

  /** 获取对dynamic/valid/list等特殊项进行处理进行处理后的完整schema副本 */
  getSchemas(): FormSchemaWithoutName;

  /** 获取对dynamic/valid/list等特殊项进行处理进行处理后的指定schema副本 */
  getSchema(name: NamePath): FormSchema | FormSchemaWithoutName | null;
}
```



### Verify

```ts
/** 验证实例 */
export interface FormVerify {
  /**
   * 对指定的values执行校验, 验证成功时返回null, 失败时返回包含错误信息的meta数组
   *
   * 若传入extraMeta, 会将其扩展到该次验证的 FormVerifyMeta 中, 然后你可以在验证器/验证错误信息等位置对其进行访问
   * */
  check(values: any, extraMeta?: AnyObject): Promise<FormRejectMeta | null>;

  /** 获取Form创建配置 */
  getConfig(): FormConfig;
}
```



### Schema

```ts
/** 描述values结构的单个项 */
export interface FormSchema {
  /** 对应values中的key, 也用于从values中取值 */
  name: NameItem;
  /** 用于验证显示的字段名, 不传时取name的字符串表示 */
  label?: string;
  /**
   * 验证器或验证器数组。
   * - 如果待验证的值是空值，验证器的执行将被跳过，类似于其他库中的“可选字段”概念，只有字段存在值才进行校验，不存在则跳过。可以使用 `[required(), ...]` 将字段标记为必传。
   * - 如果同一组中前一个验证器异常，将停止执行后续验证器。
   * - 验证器的执行顺序与数组中的顺序相关，因此应该将更容易出错的验证器/非异步验证器放在前面。
   * - 在数组中传入的 `undefined`/`null` 值将被忽略。
   */
  validator?: FormValidator | (FormValidator | null | undefined)[];
  /** valid为false时, 该schema不会参与验证, 并且提交时会排除掉schema指向的值, 不可用于list项的第一级子项(应使用list相关api操作) */
  valid?: boolean;
  /** 动态设置其他参数 */
  dynamic?: (
    form: FormVerifyInstance
  ) => Omit<FormSchemaWithoutName, "dynamic" | "name" | "list"> | void;
  /** 类型为数组、对象时, 对其结构进行验证 */
  schema?: FormSchema[];
  /** 验证值为array或object时, 子级的所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: FormSchemaPartial;
  /**
   * 设置该项为list项, 设置后可使用list系列的api对其子项进行新增/删除/排序等操作,
   * 若用于root项, 通过getList([])可获取根schema
   * */
  list?: boolean;
  /** 对值进行验证前进行转换, 不影响原始值, 仅用于验证 */
  transform?: (value: any) => any;
}

/** 不包含name的schema */
export type FormSchemaWithoutName = Omit<FormSchema, "name">;

/** 去除了部分配置的schema */
export type FormSchemaPartial = Omit<FormSchema, "name" | "list">;
```





### Validator

```ts
/**
 * 验证器 - 一个异步函数，接受三种返回值类型。
 * 第二和第三种用法用于自定义错误消息模板，通常只涉及验证器作者关注。
 * 1. 返回字符串：表示错误并将其作为反馈文本返回。字符串中可使用基本模板变量（参见 Config.languagePack）。
 * 2. 返回函数：函数接收 Meta，如果校验失败，按照第一种返回规则返回字符串，表示错误。通常用于 languagePack，很少使用。
 * 3. 包含错误模板和插值的 ErrorTemplateInterpolate 对象。用于在扩展 languagePack 并需要为自定义验证器添加插值时使用模板插值。
 *
 * 一些注意事项：
 * - 如果验证器内部发生异常，将捕获该异常，并使用 Error.message 作为反馈文本。
 * - 默认情况下，传递给验证器的所有值都是非空的。只有配置了 checkEmpty = true 的验证器才会接受并检测空值。
 */
export interface FormValidator {
  (meta: FormVerifyMeta):
    | Promise<void | FormErrorTemplateType | FormErrorTemplateInterpolate>
    | void
    | FormErrorTemplateType
    | FormErrorTemplateInterpolate;

  /** 可选的验证器标识，用于辅助识别 */
  key?: string;
  /** 默认情况下，如果待验证的值为空，则验证器将直接跳过。启用此选项可强制对空值进行验证 */
  checkEmpty?: boolean;
}

/** 错误模板值允许的类型/验证器支持的返回类型 */
export type FormErrorTemplateType = string | ((meta: FormVerifyMeta) => string);

/** 错误模板插值对象, 也可作为验证器返回来扩展模板变量 */
export interface FormErrorTemplateInterpolate {
  /** 模板对象 */
  errorTemplate: FormErrorTemplateType;
  /** 要额外插入模板中的模板变量 */
  interpolateValues: AnyObject;
}
```



### Meta

在验证器/错误信息中可以访问的一些信息

```ts
/** 在验证各个阶段传递验证信息的对象, 比如作为验证器参数, 或是包含在验证失败的错误信息中 */
export interface FormVerifyMeta {
  /** schema.name的字符串表示 */
  name: string;
  /** 当前项name */
  namePath: NamePath;
  /** 对应 schema.label, 未传时与 name 相同，用于展示字段名时应始终使用此值 */
  label: string;
  /** 被验证的值 */
  value: any;
  /** 所有值, 该字段是原对象的引用, 可能会在验证后被其他代码更改 */
  values: any;
  /** 当前项的schema */
  schema: FormSchema;
  /** 该次验证的schema */
  rootSchema: FormSchemaWithoutName;
  /** 值是否为empty, 即 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一种 */
  isEmpty: boolean;
  /** 如果在嵌套结构中, 此项为其父级的name */
  parentNamePath?: NamePath;
  /** 根据name获取其value */
  getValueByName: (name: NamePath) => any;
  /** 当前form配置 */
  config: FormConfig & {
    languagePack: AnyObject;
  };

  /** 其他扩展字段 */
  [key: string]: any;
}
```





### RejectMeta

描述错误信息的对象, 其还包含了所有 FormVerifyMeta

```ts
/** 验证失败时的反馈对象 */
export interface FormRejectMetaItem extends FormVerifyMeta {
  /** 验证失败的提示 */
  message: string;
}

/** 包含验证错误信息的数组, 每一项都表示一个验证错误 */
export type FormRejectMeta = FormRejectMetaItem[];
```



### ListItem

```ts
/** 表示List的一项 */
export interface FormListItem<Item = any> {
  /** 列表项的唯一key */
  key: string;
  /** 列表项的数据 */
  item: Item;
}
```



### FormNamesNotify

```ts
/**
 * 用于update/change事件的回调
 * @param name 触发变更的name, 不传时表示更新所有字段
 * @param relation 为true时表示应该更新与当前name关联的值(父级/子级)
 * */
export type FormNamesNotify = (name?: NamePath, relation?: boolean) => void;

```

<br/>
