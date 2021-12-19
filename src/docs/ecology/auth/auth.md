---
title: Auth - 权限
group:
  title: 生态
  path: /ecology
  order: 6000
---

# Auth 权限

此库包含两种权限实现:

1. 常规版本，验证通过本地验证器和一组[`seed`](/docs/utils/seed)状态来实现, 适合用来完成中少量权限的控制。
2. Pro 版本，通过进一步的封装简化了 api 的整体使用，适合包含大量复杂权限逻辑的中后台项目，并且可以非常简单的和任意后端体系集成。

<br>

两种权限非常适合混合使用，比如在一个后台管理系统中，常规版本的权限控制很适合用来进行进行登录、账号状态等验证，而 Pro 版本的权限验证则可以用来完成路由、组件、按钮级别的权限控制。

## Auth

常规版本验证函数，适合用来进行一些碎片化验证的权限验证。

### 基本示例

创建 seed 实例并通过通过 Auth 组件来对指定节点附加权限

<code src="./base-demo.tsx" />

### 反馈方式

无权限时有三种可选的反馈方式：占位节点、气泡框提示、隐藏

<code src="./feedback-type-demo.tsx" />

### withAuth

为现有组件附加权限控制，生成的权限组件会直接附带权限验证，可用于路由组件等的权限验证

<code src="./with-auth-demo.tsx" />

### useAuth

hooks 式的验证，接受验证参数，返回验证结果

<code src="./use-auth-demo.tsx" />

### or

类似编程语言中的 `||`，如果需要在两个权限中任意一个通过就通过验证，可以将权限 key 设置为二维数组`['key', ['key2', 'key3']]`·

💡 与常规验证器不同，串联的 `或验证器` 不会在前面的验证器执行失败后阻止后面的同级验证器执行

<code src="./or-demo.tsx" />

### 额外参数

某些验证器会需要接受当前运行时参数作为验证参照（比如验证是否为本人，会需要传入当前用户的信息给验证器），可以通过 extra 传递

<code src="./extra-demo.tsx" />

### 定制反馈节点

<code src="./custom-demo.tsx" />

### 局部验证器

只作用于当前挂载组件的验证器

<code src="./scope-demo.tsx" />

### api 速览

```tsx | pure
import { createSeed } from 'm78/seed';
import { createAuth } from 'm78/auth';

// ###############################
//            创建实例
// ###############################

// 创建用于管理auth状态的seed
const seed = createSeed({
  /* 被所有验证器依赖数据 */
  state: {
    /** 登录用户 */
    user: '',
    /** 是否是管理员 */
    admin: 2,
  },
});

// 创建Auth实例
const Auth = createAuth({
  seed,
  /* 声明验证器 */
  validators: {
    // 登录状态验证器
    login(state) {

      // 验证器的职责就是根据当前的state检测是否包含权限，没有权限时，返回一组描述信息
      if (!state.user) {
        return {
          label: '未登录',
          desc: '请登录后再进行操作',
          actions: [...],
        };
      }
    },
    // ...更多验证器
  },
  /**
   * 如果一个验证未通过，则阻止后续验证
   * * 对于or中的子权限，即使开启了validFirst，依然会对每一项进行验证，但是只会返回第一个
   * * 在执行auth()时将优先级更高的权限key放到前面有助于提高验证反馈的精度, 如 login > publisher, 因为publisher状态是以login为前提的
   *  */
  validFirst?: boolean;
});

// ###############################
//              API
// ###############################

// <Auth />本身是一个react组件，包含以下props
interface AuthProps<S, V> {
  /**
   * 权限验证通过后显示的内容
   * - 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactElement | (() => React.ReactElement);
  /**
   * 待验证的权限key组成的数组
   * - 只要有一个权限未验证通过，后续验证就会被中断，所以key的传入顺序最好按优先级从左到右，如: ['login', 'isVip']
   * - 可以通过二维数组来组合两个条件['key1', ['key2', 'key3']], 组合的条件表示逻辑 `or` */
  keys: AuthKeys<V>;
  /** 'feedback' | 反馈方式，分为占位节点、隐藏、气泡提示框三种, 当type为popper时，会自动拦截子元素的onClick事件, 同时，也需要确保子节点符合<Popper />组件的子节点规则 */
  type?: AuthTypeKeys | AuthTypeEnum;
  /** 传递给验证器的额外参数 */
  extra?: any;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (rejectMeta: ValidMeta[], props: AuthProps<S, V>) => React.ReactNode;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: Validators<S>;
  /** 自定义显示的403 icon */
  icon?: React.ReactNode;
}

// Auth组件实例还包含以下属性和方法, 通过Auth.xxx使用
interface RCAuth {
  /** 执行权限验证 */
  auth: Auth;
  /** 创建带权限检测的高阶组件 */
  withAuth: <P>(
          conf: Omit<AuthProps<S, V>, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
  /** 权限验证hook */
  useAuth: UseAuth;
}

```

## AuthPro

这是一种为中后台项目开发设计的权限功能，这些系统大部分功能都围绕权限来进行，所以会需要一种更容易以后端技术集成、更容易使用、更适合处理复杂繁重系统的权限验证的方式。

### 理解 auth string

`auth string`是一种简化权限书写的方式，是权限对象的字符串表示.

其格式为:

```ts
`name:keys`;
```

<br>

- `name` 表示能代表某个权限的唯一名称, 如：`user`、`news`、`activity`, 在多模块的系统中，使用点来分割并描述详细的模块名称: `main.client.news`
- `keys` 为 `crud` 这样的字符，其中每个字符表示一个权限的拥有情况，`curd` 分别对应功能的 增加(Create)、检索(Retrieve)、更新(Update)和删除(Delete)权限，keys 是可以由用户自由扩展的，但是`crud`一般来说已经足够描述大多数权限行为。

<br>

实际使用时的格式大致如下:

```ts
`user:cd` // 用户模块，可用权限为增加、删除
`news:cru` // 新闻模块，可用权限为增加、查询、更新
`manage.activity:crua`; // 管理端的活动模块，可用权限为增加、查询、更新、审批(自定义key)
```

### 基本示例

通过`createAuthPro()`创建实例, 使用`AuthPro.setAuth()`来更改拥有的权限, 然后通过`<AuthPro />`组件来进行验证

> `AuthPro`底层是基于常规`Auth`的，所以支持它的绝大多数用法, 比如基本相同的参数、`withAuth`、`useAuth`、定制等等.

<code src="./pro/base.tsx" />

### api 速览

```tsx | pure
import { createSeed } from 'm78/seed';
import { createAuthPro } from 'm78/auth';

// ###############################
//            实例创建
// ###############################
const AuthPro = createAuthPro({
  // 需要传入一个seed控制内部状态
  seed: createSeed(),
  // 可选的设置初始权限
  auth: ['user:cru', 'article:d'],
  // 扩展curd以外的额外key
  customAuthKeysMap: {
    /** key的简写名称, 如c/r/u/d */
    a: {
      /** 表示该简写的完整名称, 如 c 的完整 name 为 create */
      name: 'audit',
      /** 标题 */
      label: '审核',
    },
    p: {
      name: 'publish',
      label: '发布',
    },
  },
  // 为权限名赋予语义化的名称, 使其在用于反馈时更友好
  authNameMap: {
    user: '用户',
    article: '文章',
  },
  // 设置语言
  lang: 'zh-CN',
  // 自定语言配置, 可用于覆盖现有配置，或者扩充
  languages: {
    'zh-CN': {
      noPermission: '😥没有权限',
    },
  },
});

// ###############################
//              api
// ###############################

// <AuthPro />本身是一个react组件，包含以下props, 与常规Auth非常相似
interface AuthProProps {
  /**
   * 权限验证通过后显示的内容
   * - 当type为tooltip时，必须传入单个子元素，并且保证其能正常接收事件
   * */
  children: React.ReactElement | (() => React.ReactElement);
  /** 'feedback' | 反馈方式，分为占位节点、隐藏、气泡提示框三种, 当type为popper时，会自动拦截子元素的onClick事件, 同时，也需要确保子节点符合<Popper />组件的子节点规则 */
  type?: AuthTypeKeys | AuthTypeEnum;
  /** 是否禁用，禁用时直接显示子节点 */
  disabled?: boolean;
  /** 局部验证器 */
  validators?: Validators<S>;
  /** 自定义显示的403 icon */
  icon?: React.ReactNode;
  /** 期望的权限 */
  keys: AuthProStrings;
  /**
   * 定制无权限时的反馈样式
   * @param rejectMeta - 未通过的权限的具体信息
   * @param props - 组件接收的原始props
   * @return - 返回用于显示的反馈节点
   * */
  feedback?: (rejectMeta: AuthProValidMeta[], props: AuthProProps) => React.ReactNode;
}

// AuthPro组件实例还包含以下属性和方法, 通过AuthPro.xxx使用
interface AuthPro {
  /** 权限验证hook, 可参考常规Auth的用法 */
  useAuth: (keys: AuthProStrings) => AuthProValidMeta[] | null;
  /** 创建带权限检测的高阶组件, 可参考常规Auth的用法 */
  withAuth: <P>(
    conf: Omit<AuthProProps, 'children'>,
  ) => (Component: React.ComponentType<P>) => React.FC<P>;
  /** 设置当前权限 */
  setAuth: (auth: AuthProStrings) => void;
  /** 获取当前权限 */
  getAuth: () => AuthProStrings;
  /** 获取权限的详细对象 */
  getAuthDetail: () => AuthProDetailMap | null;
  /** 传入权限字符数组进行验证 */
  auth: (keys: AuthProStrings) => AuthProValidMeta[] | null;
  /** 根据当前实例的配置解析一个AuthProStrings并返回解析对象 */
  parse: (keys: AuthProStrings) => AuthProDetailMap | null;
  /** 字符串化AuthProDetailMap并返回每个权限的AuthProStrings组成的数组 */
  stringify: (authMap: AuthProDetailMap) => AuthProStrings;
  /** 内部使用的常规版auth实例 */
  authInstance: Auth<_AuthSeedProState>;
}
```

### 与后端集成

有两种可行的方式来集成到后端权限系统中，根据你的项目情况自行选择：

1. 根据现有系统的权限 api 接口编写本地转换器来将其转换成本库期望的权限描述对象(方案 2 中的任意一种).
2. 后端直接根据本库提供的权限数据格式编写 api 接口.

以下是本库期望的两种权限描述方式:

**字符风格**

推荐的格式，可以直接使用。

```ts
['user:cr', 'news:crud', 'activity:cud', 'manage:c'];
```

**JSON 风格**

使用此格式时，首先通过 api 接收到此格式的返回, 然后使用`AuthPro.stringify(map)`将其转换为字符风格的权限数据来使用。

```json
{
  "user": {
    "create": true,
    "retrieve": true
  },
  "news": {
    "create": true,
    "retrieve": true,
    "update": true,
    "delete": true
  },
  "activity": {
    "create": true,
    "update": true,
    "delete": true
  },
  "manage": {
    "create": true
  }
}
```

### 自定义 key

如果内置的`crud`四种 key 不足以描述当前的项目权限，可以对其进行扩展，操作方式如下:

```ts
// 创建实例时传入额外配置customAuthKeysMap
const AuthPro = createAuthPro({
  seed: createSeed(),
  customAuthKeysMap: {
    /** key的简写名称, 如c/r/u/d */
    a: {
      /** 表示该简写的完整名称, 如 c 的完整 name 为 create */
      name: 'audit',
      /** 标题 */
      label: '审核',
    },
    p: {
      name: 'publish',
      label: '发布',
    },
  },
});
```

然后，你就可以像使用内置的 key 一样使用它们了:

```ts
AuthPro.auth(['user:cruda', 'news:cap']);
```

### 用户端的 RBAC

RBAC(role based access control)是一种非常常见的权限控制方式，其核心思想是将需要控制访问的功能当做资源，再将这些资源与角色进行绑定，最后根据角色拥有的权限来进行权限判定。

通常后端项目的权限判定流程为:

1. 开发一个需要权限的功能
2. 获取当前用户所属的角色(一个用户往往会拥有多个角色, 通常将其称为角色组)
3. 获取这些角色包含的权限资源
4. 判断是否包含开发这个功能所必要的资源

而对于用户端，很多系统的权限实现都是用以下方式进行的:

```tsx | pure
<Auth auth={['editor', 'admin']}>
  <Button>发布文章</Button>
</Auth>
```

这其实是一种不可靠的验证方式，考虑一点，角色拥有的权限往往是具有动态性的，随时可能变更，如果代码中依赖角色来进行权限判定，当角色拥有的权限变更后，这段代码可能会产生意料之外的错误。

而后端代码中进行最终检测的是用户所属角色对应的所有权限资源，所以不会存在此问题。

所以，`AuthPro` 去掉了角色这一概念，使用精确的权限来进行权限判定，相当于直接采用上面的第 1 步和第 4 步来完成权限的验证:

```tsx | pure
<Auth auth={['article:cru']}>
  <Button>发布文章</Button>
</Auth>
```

<br>

### string 与 map

`auth string`(描述权限的字符串)与`auth map`(描述权限的对象)之间能够相互转换

这类似于`URL`中`query`的概念, 例如以下对象可以用字符`?name=lxj&like=code&like=game`表示:

```ts
const query = {
  name: 'lxj',
  like: ['code', 'game'],
};
```

而 `['user:crud', 'news:cr']` 可以表示如下对象:

```ts
const authMap = {
  user: {
    create: true,
    retrieve: true,
    update: true,
    delete: true,
  },
  user: {
    create: true,
    retrieve: true,
  },
};
```

通过`AuthPro.stringify()`和`AuthPro.parse()`，你可以很容易的在这两者间进行转换
