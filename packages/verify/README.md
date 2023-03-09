<h1 align="center" style="color: #61dafb;">Verify</h1>

<br>

<p align="center" style="color:#666">Lightweight and fast js validator</p>



## Features

- 支持各种验证类型, object/array 验证，复杂嵌套结构验证，异步验证,  函数参数验证等。
- 很小的体积。
- 全验证器用法，易学，易组合， 以及更少的概念。
- 完善的验证模板定制能力。
- 很多常用的内置验证器。

<br>

## usage

### 基础

1. 使用任意包管理器安装依赖 `@m78/verify`

2. 导入并使用

```typescript
import { createVerify } from "@m78/verify";
import { required, string, number } from "@m78/verify/validator";

// 创建一个verify实例，可以创建多个实例，每个实例拥有独立的配置
const verify = createVerify(/* config */);

// 待验证的数据源
const data = {
  user: "lxj",
  sex: 1,
};

// 验证schema配置
const schema = {
  // 验证最外层的data
  validator: required(),
  // 验证内部字段
  schema: [
    {
      name: "user",
      validator: [required(), string({ min: 4 })],
    },
    {
      name: "sex",
      validator: [required(), number()],
    },
  ],
};

// 执行验证
const rejects = verify.check(data, schema);

// 如果rejects为null， 表示验证通过，验证失败时为一个包含了多个RejectMeta对象的数组, RejectMeta对象的详情见下方RejectMeta部分
[
  {
    message: "...",
    // more...
  },
];
```



### 异步验证

执行异步验证

```typescript
// 待验证的数据源
const data = {
  user: "lxj",
};

// 验证schema配置
const schema = {
  validator: required(),
  schema: [
    {
      name: "user",
      validator: [
        required(),
        string({ min: 4 }),
        // 添加异步验证器，通常会放在常规验证器底部, 异步验证器就是同步验证器的Promise版本，详情见API的Validator部分
        async () => {
          await someThing();
        },
      ],
    },
  ],
};

verify.asyncCheck(data, schema).catch((err) => {
  // 有两种方式获取错误消息, 第一种是这样使用内部提供的工具函数, 会自动根据错误类型获取适当的错误消息
  const message = verify.getRejectMessage(err);
  
  
  // 另一种方式, 手动获取, 通常需要依次处理 err.rejects > err.message
  if (err instanceof VerifyError) {
    // err.rejects
    // rejects与上一示例中的相同
  }
});
```



### 单值验证

于对单个值进行便捷验证

```ts
const rejects = verify.check(123, {
  validator: [required(), number({ max: 100 })],
});
```



### 函数参数验证

```typescript
function fn(...args) {
  const rejects = verify.check(args, {
    validator: required(),
    schema: [
      {
        name: "0",
        validator: required(),
      },
      {
        name: "1",
        validator: required(),
      },
    ],
  });

  // 处理rejects
}

fn();
```



另一种方式是使用 `arguments`

```typescript
function fn(name, age) {
  const rejects = verify.check(arguments, {
    validator: required(),
    schema: [
      {
        name: "0",
        validator: required(),
      },
      {
        name: "1",
        validator: required(),
      },
    ],
  });

  // 处理rejects
}

fn();
```



### name 取值示例

Schema 的 name 支持嵌套取值

```json
{
	name: 'key',	// 字段取值, 对应 source.key
	name: 0,		  // 数组取值, 对应 source[0]
	name: ['user', 'name'],		    // 对象嵌套取值, 对应 source.user.name
	name: ['list', 1, 'title'],		// 对象数组嵌套取值, 对应 source.list[1].name
	name: [0, 'title'],		// 数组嵌套取值, 对应 source[1].name
}
```



### 空值

以下值都会被认定为空值, 可以使用 `required()` 验证器来进行空值验证

```
undefined, null ,'', NaN, [], {}, 空白字符
```

另外,  类似一些编程语言中的null, 空值是所有验证器的子集, 如果待校验的值是空值, 验证器执行会被直接跳过, 可以通过`[required(), ...]`可以将字段标记为必传, 如:

这个示例中的 `number` 不会执行, 因为待验证值为空

```ts
// 待验证的值
null

// 验证器
[
  number()
];
```

通常需要这样写, 先进行空检测, 有值后才会执行后面的校验

```ts
// 待验证的值
null

[
  // 验证器
  required(), 
  number()
];
```



### 验证器

验证器分为同步验证器和异步验证器

验证器接收 Meta 对象，它包含了很多关于验证的信息，如果验证器返回了一个 string 或抛出错误, 则视为验证失败, 下面是一个同步验证器的示例。

```js
function string({ value }) {
  if (typeof value !== "string") return "必须为字符类型";

  // 如果验证器抛出错误，则将错误对象的message作为验证反馈, 通过下面代码可以实现相同的效果
  if (typeof value !== "string") throw new Error("必须为字符类型");
}
```

异步验证器与同步验证器编写方式几乎一致，除了它返回一个 Promise

```js
async function asyncCheck({ value }) {
  // 执行一些异步操作
  const val = await fetchSomething();

  if (val === value) return "该值已存在";
}
```

更多验证器的细节请见下方`Validator`部分



### 嵌套验证

支持任意结构和深度的嵌套值验证, `schema` 验证固定结构的子级，`eachSchema `配置所有直接子级应遵循的结构

```typescript
const data = {
  name: "lxj",
  list: ["1", "2", 3],
  map: {
    field1: "123",
    field2: 123,
  },
  listMap: [
    {
      key: "123",
    },
    {
      key: 123,
    },
  ],
  listList: [["xxx"], ["xxx"], 123, [123]],
};

const schema = {
  schema: [
    {
      name: "name",
      validator: string({ length: 4 }),
    },
    // 一个数组，该数组的每一个子级都是string
    {
      name: "list",
      validator: array(),
      eachSchema: {
        validator: string(),
      },
    },
    // 一个对象，对其字段进行验证
    {
      name: "map",
      validator: object(),
      schema: [
        {
          name: "field1",
          validator: number(),
        },
        {
          name: "field2",
          validator: string(),
        },
      ],
    },
    // 一个数组，每一个子级都是一个对象，同时也这个对象的结构进行了限制
    {
      name: "listMap",
      validator: array(),
      eachSchema: {
        validator: object(),
        schema: [
          {
            name: "key",
            validator: number(),
          },
        ],
      },
    },
    // 一个二维数组，二维数组的子项必须为number
    {
      name: "listList",
      validator: [required(), array()],
      eachSchema: {
        validator: [array()],
        eachSchema: {
          validator: [number()],
        },
      },
    },
  ],
};

verify2.check(data, schema);
```



### 自定义提示模板

内置了中文和英文两种提示模板，在创建实例时通过如下方式配置

```typescript
import { createVerify, simplifiedChinese, english } from '@m78/verify';

const verify = createVerify({
    languagePack: simplifiedChinese;
});
```

可以通过如下方式修改部分配置，模板配置会进行深合并，不会影响其他配置, 你可以任意扩展提示模板，并在自定义验证器中通过 meta 访问

```typescript
import { createVerify } from '@m78/verify';

const verify = createVerify({
    extendLanguagePack: {
        required: 'this is a required field',
        object: 'must be object',
        // 模板支持插值
        number: {
            notExpected: 'Must be a number',
            notInteger: 'Must be a integer',
            max: 'Cannot be greater than {max}',
            min: 'Cannot be less than {min}',
            size: 'Must be {size}',
        },
    };
});
```

如果有任何疑惑，可以参考默认语言模板配置 [language-pack.ts](./src/language-pack.ts) 



## API

### 内置验证器

请查阅: https://github.com/xianjie-li/m78/tree/master/packages/verify/src/validator



### NamePath

```typescript
// 表示name的字符或字符数组，用于链式取值，如: ['user', 'address']、[1, 'name']、['list', 4, 'name']
export type NameItem = string | number;
export type NamePath = NameItem | NameItem[];
```



### Config

共有两种配置, 一是创建 verify 时的配置，二是执行验证检测的配置

```typescript
/** verify创建配置 */
export interface Config {
  /**
   * true | 当其中一项验证失败后，停止后续字段的验证
   * - 注意, 如果是嵌套验证器, 父级验证失败了, 子级验证器通常就没有执行的意义了, 即使关闭了verifyFirst, 无效的子级验证器也不会执行
   * */
  verifyFirst?: boolean;
  /**
   * 语言包配置，错误模板可以是字符，也可以是接收Meta返回字符的函数, 传入对象会与默认语言配置深合并，所以如果只更改了部分错误模板，不会影响到其他模板
   * - 模板字符串会被注入以下变量, 通过{name}进行插值，如果插值语法和原有字符冲突，使用\\{name}来避免插值
   *    - name:  Schema.name
   *    - label: 对应Schema.label, 未传时与 name相同，用于展示字段名时应始终使用此值
   *    - value: 字段值, 应只在验证值为基础类型时使用
   *    - valueType: value类型的字符串表示
   * - 在特定的验证器中还会注入额外的插值，具体可以查看对应验证器的文档
   * */
  languagePack?: AnyObject;
  /** 不需要定制语言包, 仅需要对其扩展或覆盖时使用此项, 会与默认语言包进行深合并 */
  extendLanguagePack?: AnyObject;
  /** true | 配置是否忽略怪异值(schema中未声明的值), 关闭后未声明的值会产生错误 */
  ignoreStrangeValue?: boolean;
}
```



### Schema

表示模式配置中的一项

```typescript
/**
 * 用于数据验证的模式对象
 * */
export interface Schema {
  /** 用来在source中取值的key */
  name: NamePath;
  /** 用于验证显示的字段名, 不传时取name转换为string的值 */
  label?: string;
  /**
   * 验证器或验证器数组
   * - 如果待校验的值是empty值, 验证器执行会被直接跳过, 这类似其他库中的`可选字段`, 字段存在值才校验, 不存在则跳过, 可以通过`[required(), ...]`可以将字段标记为必传
   * - 前一个验证器执行异常时会停止后续验证器执行
   * - 验证器的执行顺序与数组中的顺序有关，所以应将优先级更高的验证器放在前面
   * - 数组中传入的undefined/null将会被忽略
   * */
  validator?:
    | Validator
    | AsyncValidator
    | (Validator | AsyncValidator | null | undefined)[];
  /** 如果对象为嵌套结构(数组、对象)，对其执行嵌套验证, 子项的name前会自动添加其所有父级的name */
  schema?: Schema[];
  /** 验证值为array或object时, 所有 数组项/对象值 必须与此Schema匹配, 如果该值的类型不为array或object，此配置会被忽略 */
  eachSchema?: SchemaWithoutName;
  /** 在对值进行操作、验证前将其转换, 对于引用类型的值，应避免对其操作, 因为它是当前验证data的局部直接引用 */
  transform?: (value: any) => any;
}
```



### Verify

验证器实例

```typescript
/** Verify 实例 */
export interface Verify {
  /** 执行同步验证 */
  check: (
    source: any,
    rootSchema: SchemaWithoutName,
    config?: CheckConfig
  ) => RejectMeta | null;
  /**
   * 执行异步验证, 异步验证中也支持使用同步验证器, 验证失败时, resolve值为包含RejectMeta的错误对象VerifyError
   * */
  asyncCheck: (
    source: any,
    rootSchema: SchemaWithoutName,
    config?: CheckConfig
  ) => Promise<void>;
  /** 从错误对象中获取适当的消息用于反馈, 主要用于自动处理VerifyError */
  getRejectMessage: (err: any) => string;
  /** 当前使用的languagePack */
  readonly languagePack: AnyObject;
}
```





### Validator

```typescript
/**
 * 验证器，验证器可以有三种类型的返回值, 第2, 3种用法通常只在自己需要编写包含可高度定制的提示模板的验证器时才会使用:
 * 1. 返回string, 表示包含错误并将其作为错误反馈文本返回
 * 2. 返回一个函数, 函数接收Meta, 若校验失败也根据第一种返回规则一样返回string表示错误, 此用法通常用于languagePack，一般不会使用
 * 3. 一个包含错误模板和插值的ErrorTemplateInterpolate对象，用于实现模板插值，在扩展了languagePack并需要为自定义验证器添加插值时使用
 *
 * 一些注意事项:
 * - 如果验证器内部发生了异常，该异常会被捕获，并使用Error.message来作为错误反馈文本,
 * - 默认情况下, 编写验证器时可以假设待验证的value是必定非empty的, 只有配置了checkEmpty的验证器会接收并检测empty值, 因为验证器的职责是检测是否符合自己预期的情况, 而不是检测是是否非空
 * */
export interface Validator {
  (meta: Meta): void | ErrorTemplateType | ErrorTemplateInterpolate;

  /** 可选的验证器标识, 用来帮助判断 */
  key?: string;
  /** 默认情况下, 如果待验证的值是empty, 则验证器会直接跳过, 可以通过启用此项来强制进行验证 */
  checkEmpty?: boolean;
}

/**
 * 异步验证器, 与同步验证器编写几乎一样, 区别是原本的返回值通过Promise来处理
 * */
export interface AsyncValidator {
  (meta: Meta): Promise<void | ErrorTemplateType | ErrorTemplateInterpolate>;

  key?: string;
  checkEmpty?: boolean;
}
```



### Meta

```typescript
/** 在api内部被共享的对象 */
export interface Meta {
  /** 当前verify实例 */
  verify: Verify;
  /** Schema.name的字符化 */
  name: string;
  /** 当前项name */
  namePath: NamePath;
  /** 对应Schema.label, 未传时与 name相同，用于展示字段名时应始终使用此值 */
  label: string;
  /** 被验证的值 */
  value: any;
  /** 所有值，对应验证时传入的source */
  values: any;
  /** 参与验证的Schema */
  schema: Schema;
  /** 验证时传入的schema */
  rootSchema: Schema;
  /** 根据name获取其value */
  getValueByName: (name: NamePath) => any;
  /** 创建配置 */
  config: Required<Config>;
  /** 值是否为empty, 即 undefined, null ,'', NaN, [], {}, 空白字符 中的任意一种 */
  isEmpty: boolean;
  /** 如果在嵌套结构中, 此项为其父级的name */
  parentNamePath?: NamePath;

  /** 其他任意扩展字段 */
  [key: string]: any;
}
```



### RejectMeta

描述验证失败信息的对象, 除了新增了一个 message 字段外与 Meta 完全相同

```typescript
/** 验证失败时的反馈对象 */
export interface RejectMetaItem extends Meta {
  /** 验证失败的提示 */
  message: string;
}
```

